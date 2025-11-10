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

function renderShelf() {
    const container = el.shelf;

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    const fragment = document.createDocumentFragment();

    shortcuts.forEach(s => {
        // Create the <li> element
        const listItem = document.createElement('li');
        listItem.classList.add('shortcut');

        // Create the <a> element
        const anchor = document.createElement('a');
        anchor.href = s.url;
        anchor.title = s.title;

        // Use textContent to safely insert user-defined text
        anchor.textContent = s.title;

        // Assemble the structure
        listItem.appendChild(anchor);
        fragment.appendChild(listItem);
    });

    // Single, safe append
    container.appendChild(fragment);
}

function renderShortcuts() {
    const container = el.shortcutList;
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const fragment = document.createDocumentFragment();

    shortcuts.forEach((s, i) => {
        // Outer div: config-item
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('config-item');
        itemDiv.draggable = true;
        itemDiv.dataset.id = s.title;
        itemDiv.dataset.type = 'shortcut';

        // Button: config-label
        const labelButton = document.createElement('button');
        labelButton.classList.add('config-label');
        labelButton.textContent = s.title;

        // Inner div: item-edit
        const editDiv = document.createElement('div');
        editDiv.classList.add('item-edit');

        // Input Title
        const inputTitle = document.createElement('input');
        inputTitle.dataset.type = 'shortcut';
        inputTitle.dataset.field = 'title';
        inputTitle.dataset.i = i;
        inputTitle.value = s.title;

        // Input URL
        const inputUrl = document.createElement('input');
        inputUrl.dataset.type = 'shortcut';
        inputUrl.dataset.field = 'url';
        inputUrl.dataset.i = i;
        inputUrl.value = s.url;

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-shortcut');
        deleteButton.dataset.i = i;
        deleteButton.textContent = 'Delete';

        // Assembly
        editDiv.append(inputTitle, inputUrl, deleteButton);
        itemDiv.append(labelButton, editDiv);
        fragment.appendChild(itemDiv);
    });

    container.appendChild(fragment);
}

function renderEngines() {
    const container = el.engineList;
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    const fragment = document.createDocumentFragment();

    engines.forEach((e, i) => {
        // Outer div: config-item
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('config-item');
        itemDiv.draggable = true;
        itemDiv.dataset.id = e.name;
        itemDiv.dataset.type = 'engine';

        // Button: config-label
        const labelButton = document.createElement('button');
        labelButton.classList.add('config-label');
        labelButton.textContent = e.name;

        // Inner div: item-edit
        const editDiv = document.createElement('div');
        editDiv.classList.add('item-edit');

        // Input Name
        const inputName = document.createElement('input');
        inputName.dataset.type = 'engine';
        inputName.dataset.field = 'name';
        inputName.dataset.i = i;
        inputName.value = e.name;

        // Input Action
        const inputAction = document.createElement('input');
        inputAction.dataset.type = 'engine';
        inputAction.dataset.field = 'action';
        inputAction.dataset.i = i;
        inputAction.value = e.action;

        // Input Param
        const inputParam = document.createElement('input');
        inputParam.dataset.type = 'engine';
        inputParam.dataset.field = 'param';
        inputParam.dataset.i = i;
        inputParam.value = e.param;

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-engine');
        deleteButton.dataset.i = i;
        deleteButton.textContent = 'Delete'; // Safe text insertion

        // Assembly
        editDiv.append(inputName, inputAction, inputParam, deleteButton);
        itemDiv.append(labelButton, editDiv);
        fragment.appendChild(itemDiv);
    });

    container.appendChild(fragment);
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
    if (!type || !field || i == -1) return;

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
