// ============================================
// MÖRSER-KARL GX LINUX – window.js
// i3-style Tiling Window Manager
// ============================================

let windowZIndex = 100;
let openWindows = {};
let activeWindowId = null;
let tilingMode = true; // i3 Tiling!
let currentWorkspace = 1;

// Fenster erstellen
function createWindow(id, title, icon, content, width = 800, height = 500) {
    // Prüfen ob bereits offen
    if (openWindows[id]) {
        focusWindow(id);
        return;
    }
    
    const container = document.getElementById('windowsContainer');
    
    // Position für Tiling berechnen
    const windowCount = Object.keys(openWindows).length;
    let left, top, w, h;
    
    if (tilingMode && windowCount > 0) {
        // i3-style: Fenster automatisch anordnen
        if (windowCount === 1) {
            // Master-Stack Layout
            left = 0; top = 0;
            w = container.offsetWidth * 0.55;
            h = container.offsetHeight;
        } else {
            // Stack rechts
            const stackCount = windowCount - 1;
            const stackHeight = container.offsetHeight / stackCount;
            left = container.offsetWidth * 0.55;
            top = (stackCount - 1) * stackHeight;
            w = container.offsetWidth * 0.45;
            h = stackHeight;
        }
    } else {
        // Float-Modus
        left = 50 + windowCount * 30;
        top = 30 + windowCount * 30;
        w = width;
        h = height;
    }
    
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = 'window-' + id;
    windowEl.style.left = left + 'px';
    windowEl.style.top = top + 'px';
    windowEl.style.width = w + 'px';
    windowEl.style.height = h + 'px';
    windowEl.style.zIndex = ++windowZIndex;
    windowEl.setAttribute('data-workspace', currentWorkspace);
    
    windowEl.innerHTML = `
        <div class="window-titlebar" id="titlebar-${id}">
            <span style="font-size:16px;">${icon}</span>
            <span class="window-title">${title}</span>
            <div class="window-controls">
                <button class="window-btn minimize" title="Minimieren" data-action="minimize"></button>
                <button class="window-btn maximize" title="Maximieren / Float" data-action="maximize"></button>
                <button class="window-btn close" title="Schließen" data-action="close"></button>
            </div>
        </div>
        <div class="window-content" id="content-${id}">
            ${content}
        </div>
    `;
    
    container.appendChild(windowEl);
    
    // Event-Listener für Fenster-Buttons
    windowEl.querySelectorAll('.window-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'close') closeWindow(id);
            if (action === 'minimize') minimizeWindow(id);
            if (action === 'maximize') toggleMaximize(id);
        });
    });
    
    // Klick auf Fenster → fokussieren
    windowEl.addEventListener('mousedown', () => focusWindow(id));
    
    // i3 Tastenkombinationen
    windowEl.addEventListener('keydown', (e) => {
        // Super+Shift+Q = Fenster schließen (i3-style)
        if (e.metaKey && e.shiftKey && e.key === 'q') {
            closeWindow(id);
        }
        // Super+F = Fullscreen
        if (e.metaKey && e.key === 'f') {
            e.preventDefault();
            toggleMaximize(id);
        }
        // Super+Leertaste = Float/Tiling wechseln
        if (e.metaKey && e.key === ' ') {
            e.preventDefault();
            tilingMode = !tilingMode;
            retileWindows();
        }
    });
    
    // Drag & Drop (nur im Float-Modus)
    if (!tilingMode) makeDraggable(windowEl, id);
    
    // Im Taskbar anzeigen
    addTaskbarTab(id, title, icon);
    
    // Speichern
    openWindows[id] = {
        el: windowEl,
        title: title,
        icon: icon,
        minimized: false,
        maximized: false,
        floating: !tilingMode,
        workspace: currentWorkspace
    };
    
    focusWindow(id);
    
    // Andere Fenster neu anordnen (i3 Tiling)
    if (tilingMode) retileWindows();
    
    return windowEl;
}

// i3 Tiling: Alle Fenster neu anordnen
function retileWindows() {
    const container = document.getElementById('windowsContainer');
    const windows = Object.values(openWindows).filter(w => !w.minimized && !w.maximized);
    const count = windows.length;
    
    if (count === 0) return;
    
    if (tilingMode && count > 1) {
        // Master-Stack Layout
        const masterWidth = container.offsetWidth * 0.55;
        const stackWidth = container.offsetWidth * 0.45;
        
        // Master (erstes Fenster)
        windows[0].el.style.left = '0px';
        windows[0].el.style.top = '0px';
        windows[0].el.style.width = masterWidth + 'px';
        windows[0].el.style.height = container.offsetHeight + 'px';
        windows[0].floating = false;
        
        // Stack (restliche Fenster)
        if (count > 1) {
            const stackHeight = container.offsetHeight / (count - 1);
            for (let i = 1; i < count; i++) {
                windows[i].el.style.left = masterWidth + 'px';
                windows[i].el.style.top = ((i - 1) * stackHeight) + 'px';
                windows[i].el.style.width = stackWidth + 'px';
                windows[i].el.style.height = stackHeight + 'px';
                windows[i].floating = false;
            }
        }
    } else if (count === 1 && tilingMode) {
        // Ein Fenster = Vollbild
        windows[0].el.style.left = '0px';
        windows[0].el.style.top = '0px';
        windows[0].el.style.width = '100%';
        windows[0].el.style.height = '100%';
        windows[0].floating = false;
    }
}

// Fenster fokussieren
function focusWindow(id) {
    if (!openWindows[id]) return;
    
    Object.values(openWindows).forEach(win => {
        win.el.style.borderColor = 'var(--border)';
        win.el.style.boxShadow = '0 0 20px var(--glow)';
    });
    
    const win = openWindows[id];
    win.el.style.zIndex = ++windowZIndex;
    win.el.style.borderColor = 'var(--accent-bright)';
    win.el.style.boxShadow = '0 0 40px var(--glow-strong)';
    
    activeWindowId = id;
    
    // Taskbar updaten
    document.querySelectorAll('.taskbar-tab').forEach(tab => tab.classList.remove('active'));
    const taskbarTab = document.getElementById('taskbar-tab-' + id);
    if (taskbarTab) taskbarTab.classList.add('active');
    
    if (win.minimized) restoreWindow(id);
}

// Fenster schließen
function closeWindow(id) {
    if (!openWindows[id]) return;
    
    const win = openWindows[id];
    const iframe = win.el.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    
    win.el.remove();
    document.getElementById('taskbar-tab-' + id)?.remove();
    
    delete openWindows[id];
    
    if (activeWindowId === id) {
        activeWindowId = null;
        const remaining = Object.keys(openWindows);
        if (remaining.length > 0) focusWindow(remaining[remaining.length - 1]);
    }
    
    if (tilingMode) retileWindows();
}

// Minimieren
function minimizeWindow(id) {
    if (!openWindows[id]) return;
    openWindows[id].el.style.display = 'none';
    openWindows[id].minimized = true;
    document.getElementById('taskbar-tab-' + id)?.classList.remove('active');
    if (tilingMode) retileWindows();
}

// Wiederherstellen
function restoreWindow(id) {
    if (!openWindows[id]) return;
    openWindows[id].el.style.display = 'flex';
    openWindows[id].minimized = false;
    focusWindow(id);
    if (tilingMode) retileWindows();
}

// Maximieren / Float wechseln
function toggleMaximize(id) {
    if (!openWindows[id]) return;
    const win = openWindows[id];
    const windowEl = win.el;
    
    if (win.maximized) {
        windowEl.classList.remove('maximized');
        win.maximized = false;
        win.floating = true;
        tilingMode = false;
        windowEl.style.left = '100px';
        windowEl.style.top = '50px';
        windowEl.style.width = '700px';
        windowEl.style.height = '450px';
        makeDraggable(windowEl, id);
    } else {
        windowEl.classList.add('maximized');
        win.maximized = true;
        win.floating = false;
        tilingMode = true;
    }
}

// Draggable (Float-Modus)
function makeDraggable(windowEl, id) {
    const titlebar = windowEl.querySelector('.window-titlebar');
    let isDragging = false, offsetX, offsetY;
    
    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-btn')) return;
        if (openWindows[id]?.maximized) return;
        isDragging = true;
        offsetX = e.clientX - windowEl.offsetLeft;
        offsetY = e.clientY - windowEl.offsetTop;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDrop);
    });
    
    function onDrag(e) {
        if (!isDragging) return;
        const x = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - 100));
        const y = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - 100));
        windowEl.style.left = x + 'px';
        windowEl.style.top = y + 'px';
    }
    
    function onDrop() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDrop);
    }
}

// Taskbar-Tabs
function addTaskbarTab(id, title, icon) {
    if (document.getElementById('taskbar-tab-' + id)) return;
    const tabsContainer = document.getElementById('taskbarTabs');
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab';
    tab.id = 'taskbar-tab-' + id;
    tab.innerHTML = `${icon} ${title}`;
    tab.addEventListener('click', () => {
        if (openWindows[id]) {
            if (openWindows[id].minimized) restoreWindow(id);
            else if (activeWindowId === id) minimizeWindow(id);
            else focusWindow(id);
        }
    });
    tabsContainer.appendChild(tab);
}

// i3 Tastenkombinationen global
document.addEventListener('keydown', (e) => {
    // Super+1-4 = Workspace wechseln
    if (e.metaKey && ['1','2','3','4'].includes(e.key)) {
        e.preventDefault();
        currentWorkspace = parseInt(e.key);
        document.querySelectorAll('.ws').forEach((w, i) => w.classList.toggle('active', i === currentWorkspace - 1));
    }
    // Super+Shift+Leertaste = Tiling umschalten
    if (e.metaKey && e.shiftKey && e.key === ' ') {
        e.preventDefault();
        tilingMode = !tilingMode;
        retileWindows();
    }
});

function openApp(appId) {
    if (typeof openApplication === 'function') openApplication(appId);
}

console.log('🪟 i3 Tiling Window Manager bereit');
