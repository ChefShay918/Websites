const STORAGE_KEY = "comic-guide-list";

const els = {
  statCount: document.getElementById("stat-count"),
  statCost: document.getElementById("stat-cost"),
  statValue: document.getElementById("stat-value"),
  statRealized: document.getElementById("stat-realized"),
  statGain: document.getElementById("stat-gain"),
  list: document.getElementById("comic-list"),
  emptyState: document.getElementById("empty-state"),
  search: document.getElementById("search"),
  filterStatus: document.getElementById("filter-status"),
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
    image: document.getElementById("field-image"),
    series: document.getElementById("field-series"),
    issue: document.getElementById("field-issue"),
    publisher: document.getElementById("field-publisher"),
    condition: document.getElementById("field-condition"),
    date: document.getElementById("field-date"),
    cost: document.getElementById("field-cost"),
    currentValue: document.getElementById("field-current-value"),
    notes: document.getElementById("field-notes"),
    sold: document.getElementById("field-sold"),
    soldPrice: document.getElementById("field-sold-price"),
    soldDate: document.getElementById("field-sold-date"),
  },
  soldFields: document.getElementById("sold-fields"),
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

function effectiveValueOf(comic) {
  if (comic.sold) return comic.soldPrice ?? comic.cost;
  return comic.currentValue ?? comic.cost;
}

function gainOf(comic) {
  return effectiveValueOf(comic) - comic.cost;
}

function renderStats(list) {
  const totalCost = list.reduce((sum, c) => sum + c.cost, 0);
  const holdingsValue = list
    .filter((c) => !c.sold)
    .reduce((sum, c) => sum + (c.currentValue ?? c.cost), 0);
  const realizedGain = list
    .filter((c) => c.sold)
    .reduce((sum, c) => sum + gainOf(c), 0);
  const totalGain = list.reduce((sum, c) => sum + gainOf(c), 0);

  els.statCount.textContent = list.length;
  els.statCost.textContent = formatMoney(totalCost);
  els.statValue.textContent = formatMoney(holdingsValue);

  els.statRealized.textContent = `${realizedGain >= 0 ? "+" : ""}${formatMoney(realizedGain)}`;
  els.statRealized.classList.toggle("positive", realizedGain > 0);
  els.statRealized.classList.toggle("negative", realizedGain < 0);

  els.statGain.textContent = `${totalGain >= 0 ? "+" : ""}${formatMoney(totalGain)}`;
  els.statGain.classList.toggle("positive", totalGain > 0);
  els.statGain.classList.toggle("negative", totalGain < 0);
}

function getFilteredSorted() {
  const query = els.search.value.trim().toLowerCase();
  const statusFilter = els.filterStatus.value;
  let list = comics.filter((c) => {
    if (statusFilter === "owned" && c.sold) return false;
    if (statusFilter === "sold" && !c.sold) return false;
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
    "value-desc": (a, b) => effectiveValueOf(b) - effectiveValueOf(a),
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
    card.className = `comic-card${comic.sold ? " is-sold" : ""}`;
    card.dataset.id = comic.id;

    const gain = gainOf(comic);
    const gainClass = gain > 0 ? "positive" : gain < 0 ? "negative" : "";
    const metaParts = [comic.series, comic.issue ? `#${comic.issue}` : null, comic.publisher, comic.condition]
      .filter(Boolean)
      .join(" · ");
    const valueLine = comic.sold
      ? `Sold ${formatMoney(comic.soldPrice ?? comic.cost)}`
      : `Now ${formatMoney(comic.currentValue ?? comic.cost)}`;

    const coverImg = comic.image
      ? `<img class="comic-cover" src="${escapeHtml(comic.image)}" alt="" loading="lazy">`
      : "";

    card.innerHTML = `
      <div class="comic-main">
        ${coverImg}
        <div class="comic-info">
          <h3>${escapeHtml(comic.title)}${comic.sold ? '<span class="sold-badge">Sold</span>' : ""}</h3>
          <div class="comic-meta">${escapeHtml(metaParts)}</div>
        </div>
      </div>
      <div class="comic-figures">
        <div class="cost">Paid ${formatMoney(comic.cost)}</div>
        <div class="value">${valueLine}</div>
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
    els.fields.image.value = comic.image || "";
    els.fields.series.value = comic.series || "";
    els.fields.issue.value = comic.issue || "";
    els.fields.publisher.value = comic.publisher || "";
    els.fields.condition.value = comic.condition || "";
    els.fields.date.value = comic.date || "";
    els.fields.cost.value = comic.cost;
    els.fields.currentValue.value = comic.currentValue ?? "";
    els.fields.notes.value = comic.notes || "";
    els.fields.sold.checked = Boolean(comic.sold);
    els.fields.soldPrice.value = comic.soldPrice ?? "";
    els.fields.soldDate.value = comic.soldDate || "";
  } else {
    els.modalTitle.textContent = "Add Comic";
    els.btnDelete.hidden = true;
    els.fields.id.value = "";
  }
  els.soldFields.hidden = !els.fields.sold.checked;
  els.modalBackdrop.hidden = false;
  els.fields.title.focus();
}

els.fields.sold.addEventListener("change", () => {
  els.soldFields.hidden = !els.fields.sold.checked;
});

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
  const sold = els.fields.sold.checked;
  const soldPriceRaw = els.fields.soldPrice.value;

  const comicData = {
    id,
    title: els.fields.title.value.trim(),
    image: els.fields.image.value.trim(),
    series: els.fields.series.value.trim(),
    issue: els.fields.issue.value.trim(),
    publisher: els.fields.publisher.value.trim(),
    condition: els.fields.condition.value.trim(),
    date: els.fields.date.value,
    cost,
    currentValue: currentValueRaw ? parseFloat(currentValueRaw) : null,
    notes: els.fields.notes.value.trim(),
    sold,
    soldPrice: sold && soldPriceRaw ? parseFloat(soldPriceRaw) : null,
    soldDate: sold ? els.fields.soldDate.value : "",
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
els.filterStatus.addEventListener("change", render);
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
    let imported;
    try {
      imported = JSON.parse(reader.result);
    } catch {
      alert("Couldn't read that file — it doesn't look like valid JSON.");
      return;
    }
    if (!Array.isArray(imported)) {
      alert("That file doesn't look like a comic guide list export (expected a list of comics).");
      return;
    }
    comics = imported;
    saveComics(comics);
    render();
    alert(`Imported ${comics.length} comic${comics.length === 1 ? "" : "s"}.`);
  };
  reader.onerror = () => {
    alert("Couldn't read that file from disk. Try picking it again.");
  };
  reader.readAsText(file);
  e.target.value = "";
});

render();
