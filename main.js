// Defaults -------------------------------------------------------------------

const DEFAULT_SHORTCUTS = [
    { title: "Zen Homepage", url: "https://github.com/shashotoNur/zen-homepage/" },
    { title: "Reddit", url: "https://reddit.com/" },
    { title: "Stack Overflow", url: "https://stackoverflow.com/" },
    { title: "Github", url: "https://github.com/" },
    { title: "Youtube", url: "https://youtube.com/" },
    { title: "Wikipedia", url: "https://wikipedia.org/" },
    { title: "Archive", url: "https://archive.org/" },
    { title: "BBC", url: "https://www.bbc.com/" }
];

const DEFAULT_ENGINES = [
    { name: "Brave", action: "https://search.brave.com/search", param: "q" },
    { name: "Wikipedia", action: "https://en.wikipedia.org/w/index.php", param: "search" },
    { name: "Google", action: "https://www.google.com/search", param: "q" },
    { name: "YouTube", action: "https://www.youtube.com/results", param: "search_query" },
    { name: "YouTube Music", action: "https://music.youtube.com/search", param: "q" },
    { name: "GitHub", action: "https://github.com/search", param: "q" },
    { name: "Arch Wiki", action: "https://wiki.archlinux.org/index.php", param: "search" }
];

// State ----------------------------------------------------------------------

let shortcuts = JSON.parse(localStorage.getItem("customShortcuts")) || [...DEFAULT_SHORTCUTS];
let engines = JSON.parse(localStorage.getItem("customEngines")) || [...DEFAULT_ENGINES];
let currentEngineIndex = 0;

// DOM ------------------------------------------------------------------------

const el = {
    shelf: document.getElementById("shelf"),
    shortcutList: document.getElementById("shortcut-list"),
    engineList: document.getElementById("engine-list"),
    newShortcutTitle: document.getElementById("new-shortcut-title"),
    newShortcutUrl: document.getElementById("new-shortcut-url"),
    newEngineName: document.getElementById("new-engine-name"),
    newEngineAction: document.getElementById("new-engine-action"),
    newEngineParam: document.getElementById("new-engine-param"),
    searchForm: document.getElementById("main-search-form"),
    searchInput: document.getElementById("search-input"),
    time: document.getElementById("time"),
    date: document.getElementById("date"),
    configPanel: document.getElementById("config-panel"),
    importFileInput: document.getElementById("import-file-input")
};

// Clock ----------------------------------------------------------------------

function updateClock() {
    const now = new Date();
    el.time.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    el.date.textContent = now.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);

// Persistence ----------------------------------------------------------------

const persist = () => {
    localStorage.setItem("customShortcuts", JSON.stringify(shortcuts));
    localStorage.setItem("customEngines", JSON.stringify(engines));
};

// Rendering helpers -----------------------------------------------------------

const renderList = (container, items, cb) => {
    container.innerHTML = items.map(cb).join("");
};

function renderShelf() {
    renderList(el.shelf, shortcuts, s =>
        `<li class="shortcut"><a href="${s.url}" title="${s.title}">${s.title}</a></li>`
    );
}

function renderShortcuts() {
    renderList(el.shortcutList, shortcuts, (s, i) => `
        <div class="config-item" draggable="true" data-id="${s.title}" data-type="shortcut">
            <button class="config-label">${s.title}</button>
            <div class="item-edit">
                <input data-type="shortcut" data-field="title" data-i="${i}" value="${s.title}">
                <input data-type="shortcut" data-field="url" data-i="${i}" value="${s.url}">
                <button class="delete-shortcut" data-i="${i}">Delete</button>
            </div>
        </div>
    `);
}

function renderEngines() {
    renderList(el.engineList, engines, (e, i) => `
        <div class="config-item" draggable="true" data-id="${e.name}" data-type="engine">
            <button class="config-label">${e.name}</button>
            <div class="item-edit">
                <input data-type="engine" data-field="name" data-i="${i}" value="${e.name}">
                <input data-type="engine" data-field="action" data-i="${i}" value="${e.action}">
                <input data-type="engine" data-field="param" data-i="${i}" value="${e.param}">
                <button class="delete-engine" data-i="${i}">Delete</button>
            </div>
        </div>
    `);
}

// Accordion ------------------------------------------------------------------

const toggleAccordion = e => {
    e.currentTarget.closest(".config-item")?.classList.toggle("expanded");
};

function initializeAccordion() {
    document.querySelectorAll(".config-label").forEach(label => {
        label.removeEventListener("click", toggleAccordion);
        label.addEventListener("click", toggleAccordion);
    });
}

function refreshAll() {
    renderShelf();
    renderShortcuts();
    renderEngines();
    updateEngineDisplay();
    initializeAccordion();

    enableDragReorder(el.shortcutList, "shortcut");
    enableDragReorder(el.engineList, "engine");
}

// Search engine switching -----------------------------------------------------

function updateEngineDisplay() {
    const e = engines[currentEngineIndex];
    el.searchForm.action = e.action;
    el.searchInput.name = e.param;
    el.searchInput.placeholder = `Search ${e.name} (Ctrl+Space to change)`;
}

function cycleEngine(dir) {
    currentEngineIndex = (currentEngineIndex + dir + engines.length) % engines.length;
    updateEngineDisplay();
}

el.searchInput.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === " ") {
        e.preventDefault();
        cycleEngine(e.shiftKey ? -1 : 1);
    }
});

// Input auto-update -----------------------------------------------------------

document.addEventListener("input", e => {
    const t = e.target;
    const { type, field, i } = t.dataset;
    if (!type || !field) return;

    if (type === "shortcut") {
        shortcuts[i][field] = t.value;
        renderShelf();
    } else if (type === "engine") {
        engines[i][field] = t.value;
        currentEngineIndex = 0;
        updateEngineDisplay();
    }

    persist();
});

// Click handlers --------------------------------------------------------------

document.addEventListener("click", e => {
    const t = e.target;
    const delShortcut = t.classList.contains("delete-shortcut");
    const delEngine = t.classList.contains("delete-engine");

    if (delShortcut || delEngine) {
        const arr = delShortcut ? shortcuts : engines;
        arr.splice(Number(t.dataset.i), 1);
        currentEngineIndex = 0;
        persist();
        refreshAll();
    }
});

document.getElementById("add-shortcut-btn").onclick = () => {
    const title = el.newShortcutTitle.value.trim();
    const url = el.newShortcutUrl.value.trim();
    if (!title || !url) return;

    shortcuts.push({ title, url });
    el.newShortcutTitle.value = "";
    el.newShortcutUrl.value = "";
    persist();
    refreshAll();
};

document.getElementById("add-engine-btn").onclick = () => {
    const name = el.newEngineName.value.trim();
    const action = el.newEngineAction.value.trim();
    const param = el.newEngineParam.value.trim();
    if (!name || !action || !param) return;

    engines.push({ name, action, param });
    el.newEngineName.value = "";
    el.newEngineAction.value = "";
    el.newEngineParam.value = "";
    persist();
    refreshAll();
};

document.getElementById("config-btn").onclick = () => {
    el.configPanel.classList.toggle("open");
};

// Data buttons ----------------------------------------------------------------

document.getElementById("export-data-btn").onclick = () => {
    const blob = new Blob(
        [JSON.stringify({ shortcuts, engines }, null, 2)],
        { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zen.homepage.data.json";
    a.click();
    URL.revokeObjectURL(url);
};

document.getElementById("import-data-btn").onclick = () => {
    el.importFileInput.click();
};

el.importFileInput.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const data = JSON.parse(await file.text());
        if (data.shortcuts && data.engines) {
            shortcuts = data.shortcuts;
            engines = data.engines;
            currentEngineIndex = 0;
            persist();
            refreshAll();
        }
    } catch (err) {
        console.error("Invalid import file:", err);
    }
});

document.getElementById("erase-data-btn").onclick = () => {
    if (!confirm("Erase all custom data?")) return;

    shortcuts = [...DEFAULT_SHORTCUTS];
    engines = [...DEFAULT_ENGINES];
    currentEngineIndex = 0;

    persist();
    refreshAll();
};

// Drag Logic ------------------------------------------------------------------

function enableDragReorder(container, type) {
    let dragged = null;

    container.addEventListener("dragstart", e => {
        const item = e.target.closest(".config-item");
        if (!item) return;
        dragged = item;
        item.classList.add("dragging");
    });

    container.addEventListener("dragend", () => {
        if (!dragged) return;
        dragged.classList.remove("dragging");
        dragged = null;

        const ids = [...container.querySelectorAll(".config-item")].map(el => el.dataset.id);

        if (type === "shortcut") {
            shortcuts = ids.map(id => shortcuts.find(s => s.title === id));
        } else if (type === "engine") {
            engines = ids.map(id => engines.find(e => e.name === id));
            currentEngineIndex = 0;
        }

        persist();
        refreshAll();
    });

    container.addEventListener("dragover", e => {
        e.preventDefault();
        const after = getDragAfterElement(container, e.clientY);
        if (!after) {
            container.appendChild(dragged);
        } else {
            container.insertBefore(dragged, after);
        }
    });
}

function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll(".config-item:not(.dragging)")];
    return items.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// Initialize ------------------------------------------------------------------

refreshAll();