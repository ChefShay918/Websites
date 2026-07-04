const STORAGE_KEY = "comic-guide-list";

const els = {
  statCount: document.getElementById("stat-count"),
  statCost: document.getElementById("stat-cost"),
  statValue: document.getElementById("stat-value"),
  statGain: document.getElementById("stat-gain"),
  list: document.getElementById("comic-list"),
  emptyState: document.getElementById("empty-state"),
  search: document.getElementById("search"),
  sort: document.getElementById("sort"),
  btnAdd: document.getElementById("btn-add"),
  btnExport: document.getElementById("btn-export"),
  btnImport: document.getElementById("btn-import"),
  modalBackdrop: document.getElementById("modal-backdrop"),
  form: document.getElementById("comic-form"),
  modalTitle: document.getElementById("modal-title"),
  btnCancel: document.getElementById("btn-cancel"),
  btnDelete: document.getElementById("btn-delete"),
  fields: {
    id: document.getElementById("comic-id"),
    title: document.getElementById("field-title"),
    series: document.getElementById("field-series"),
    issue: document.getElementById("field-issue"),
    publisher: document.getElementById("field-publisher"),
    condition: document.getElementById("field-condition"),
    date: document.getElementById("field-date"),
    cost: document.getElementById("field-cost"),
    currentValue: document.getElementById("field-current-value"),
    notes: document.getElementById("field-notes"),
  },
};

function loadComics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveComics(comics) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comics));
}

let comics = loadComics();

function formatMoney(n) {
  return `$${n.toFixed(2)}`;
}

function gainOf(comic) {
  const value = comic.currentValue ?? comic.cost;
  return value - comic.cost;
}

function renderStats(list) {
  const totalCost = list.reduce((sum, c) => sum + c.cost, 0);
  const totalValue = list.reduce((sum, c) => sum + (c.currentValue ?? c.cost), 0);
  const gain = totalValue - totalCost;

  els.statCount.textContent = list.length;
  els.statCost.textContent = formatMoney(totalCost);
  els.statValue.textContent = formatMoney(totalValue);
  els.statGain.textContent = `${gain >= 0 ? "+" : ""}${formatMoney(gain)}`;
  els.statGain.classList.toggle("positive", gain > 0);
  els.statGain.classList.toggle("negative", gain < 0);
}

function getFilteredSorted() {
  const query = els.search.value.trim().toLowerCase();
  let list = comics.filter((c) => {
    if (!query) return true;
    return (
      c.title.toLowerCase().includes(query) ||
      (c.series || "").toLowerCase().includes(query)
    );
  });

  const sortMode = els.sort.value;
  const sorters = {
    "added-desc": (a, b) => b.addedAt - a.addedAt,
    "title-asc": (a, b) => a.title.localeCompare(b.title),
    "cost-desc": (a, b) => b.cost - a.cost,
    "value-desc": (a, b) => (b.currentValue ?? b.cost) - (a.currentValue ?? a.cost),
    "gain-desc": (a, b) => gainOf(b) - gainOf(a),
  };
  list.sort(sorters[sortMode] || sorters["added-desc"]);
  return list;
}

function render() {
  const list = getFilteredSorted();
  renderStats(comics);

  els.list.innerHTML = "";
  els.emptyState.hidden = comics.length > 0;

  for (const comic of list) {
    const card = document.createElement("div");
    card.className = "comic-card";
    card.dataset.id = comic.id;

    const gain = gainOf(comic);
    const gainClass = gain > 0 ? "positive" : gain < 0 ? "negative" : "";
    const metaParts = [comic.series, comic.issue ? `#${comic.issue}` : null, comic.publisher, comic.condition]
      .filter(Boolean)
      .join(" · ");

    card.innerHTML = `
      <div class="comic-info">
        <h3>${escapeHtml(comic.title)}</h3>
        <div class="comic-meta">${escapeHtml(metaParts)}</div>
      </div>
      <div class="comic-figures">
        <div class="cost">Paid ${formatMoney(comic.cost)}</div>
        <div class="value">Now ${formatMoney(comic.currentValue ?? comic.cost)}</div>
        <div class="gain ${gainClass}">${gain >= 0 ? "+" : ""}${formatMoney(gain)}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(comic));
    els.list.appendChild(card);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function openModal(comic) {
  els.form.reset();
  if (comic) {
    els.modalTitle.textContent = "Edit Comic";
    els.btnDelete.hidden = false;
    els.fields.id.value = comic.id;
    els.fields.title.value = comic.title;
    els.fields.series.value = comic.series || "";
    els.fields.issue.value = comic.issue || "";
    els.fields.publisher.value = comic.publisher || "";
    els.fields.condition.value = comic.condition || "";
    els.fields.date.value = comic.date || "";
    els.fields.cost.value = comic.cost;
    els.fields.currentValue.value = comic.currentValue ?? "";
    els.fields.notes.value = comic.notes || "";
  } else {
    els.modalTitle.textContent = "Add Comic";
    els.btnDelete.hidden = true;
    els.fields.id.value = "";
  }
  els.modalBackdrop.hidden = false;
  els.fields.title.focus();
}

function closeModal() {
  els.modalBackdrop.hidden = true;
}

els.btnAdd.addEventListener("click", () => openModal(null));
els.btnCancel.addEventListener("click", closeModal);
els.modalBackdrop.addEventListener("click", (e) => {
  if (e.target === els.modalBackdrop) closeModal();
});

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = els.fields.id.value || String(Date.now());
  const cost = parseFloat(els.fields.cost.value) || 0;
  const currentValueRaw = els.fields.currentValue.value;

  const comicData = {
    id,
    title: els.fields.title.value.trim(),
    series: els.fields.series.value.trim(),
    issue: els.fields.issue.value.trim(),
    publisher: els.fields.publisher.value.trim(),
    condition: els.fields.condition.value.trim(),
    date: els.fields.date.value,
    cost,
    currentValue: currentValueRaw ? parseFloat(currentValueRaw) : null,
    notes: els.fields.notes.value.trim(),
    addedAt: Date.now(),
  };

  const existingIndex = comics.findIndex((c) => c.id === id);
  if (existingIndex >= 0) {
    comicData.addedAt = comics[existingIndex].addedAt;
    comics[existingIndex] = comicData;
  } else {
    comics.push(comicData);
  }

  saveComics(comics);
  closeModal();
  render();
});

els.btnDelete.addEventListener("click", () => {
  const id = els.fields.id.value;
  comics = comics.filter((c) => c.id !== id);
  saveComics(comics);
  closeModal();
  render();
});

els.search.addEventListener("input", render);
els.sort.addEventListener("change", render);

els.btnExport.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(comics, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "comic-guide-list.json";
  a.click();
  URL.revokeObjectURL(url);
});

els.btnImport.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (Array.isArray(imported)) {
        comics = imported;
        saveComics(comics);
        render();
      }
    } catch {
      alert("Couldn't read that file — make sure it's a JSON export from this app.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

render();
