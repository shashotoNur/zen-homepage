const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');

function updateClock() {
    const now = new Date();

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);

    timeDisplay.textContent = timeString;
    dateDisplay.textContent = dateString;
}

updateClock();
setInterval(updateClock, 1000);

const searchForm = document.getElementById('main-search-form');
const searchInput = document.getElementById('search-input');

const engines = [
    { name: "Google", action: "https://www.google.com/search", param: "q" },
    { name: "YouTube", action: "https://www.youtube.com/results", param: "search_query" },
    { name: "YouTube Music", action: "https://music.youtube.com/search", param: "q" },
    { name: "Brave", action: "https://search.brave.com/search", param: "q" },
    { name: "GitHub", action: "https://github.com/search", param: "q" },
    { name: "Arch Wiki", action: "https://wiki.archlinux.org/index.php", param: "search" }
];
let currentEngineIndex = 0;

function updateEngineDisplay() {
    const currentEngine = engines[currentEngineIndex];

    searchForm.action = currentEngine.action;
    searchInput.name = currentEngine.param;
    searchInput.placeholder = `Search ${currentEngine.name} (Ctrl+Space to change)`;
}

function cycleEngine(direction) {
    currentEngineIndex += direction;

    const length = engines.length;
    if (currentEngineIndex >= length) {
        currentEngineIndex = 0;
    } else if (currentEngineIndex < 0) {
        currentEngineIndex = length - 1;
    }

    updateEngineDisplay();
}

searchInput.addEventListener('keydown', (e) => {
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    if (isCtrlOrMeta && e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) cycleEngine(-1);
        else cycleEngine(1);
    }
});

updateEngineDisplay();
