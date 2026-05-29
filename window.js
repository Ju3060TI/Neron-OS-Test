// ============================================
// MÖRSER-KARL GX DESKTOP – window.js
// Fenster-Manager (öffnen, schließen, drag, resize)
// ============================================

let windowZIndex = 100;
let openWindows = {};
let activeWindowId = null;

// Fenster erstellen
function createWindow(id, title, icon, content, width = 800, height = 500) {
    // Prüfen ob bereits offen
    if (openWindows[id]) {
        focusWindow(id);
        return;
    }
    
    const container = document.getElementById('windowsContainer');
    
    // Zufällige Position
    const left = 50 + Object.keys(openWindows).length * 30;
    const top = 30 + Object.keys(openWindows).length * 30;
    
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = 'window-' + id;
    windowEl.style.left = left + 'px';
    windowEl.style.top = top + 'px';
    windowEl.style.width = width + 'px';
    windowEl.style.height = height + 'px';
    windowEl.style.zIndex = ++windowZIndex;
    
    windowEl.innerHTML = `
        <div class="window-titlebar" id="titlebar-${id}">
            <span style="font-size:16px;">${icon}</span>
            <span class="window-title">${title}</span>
            <div class="window-controls">
                <button class="window-btn minimize" title="Minimieren" data-action="minimize"></button>
                <button class="window-btn maximize" title="Maximieren" data-action="maximize"></button>
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
    windowEl.addEventListener('mousedown', () => {
        focusWindow(id);
    });
    
    // Drag & Drop
    makeDraggable(windowEl, id);
    
    // Im Taskbar anzeigen
    addTaskbarTab(id, title, icon);
    
    // Speichern
    openWindows[id] = {
        el: windowEl,
        title: title,
        icon: icon,
        minimized: false,
        maximized: false,
        lastPosition: { left, top, width, height }
    };
    
    focusWindow(id);
    
    return windowEl;
}

// Fenster fokussieren
function focusWindow(id) {
    if (!openWindows[id]) return;
    
    // Alle Fenster in den Hintergrund
    Object.values(openWindows).forEach(win => {
        win.el.style.borderColor = 'var(--border)';
        win.el.style.boxShadow = '0 0 20px var(--glow)';
    });
    
    // Dieses Fenster hervorheben
    const win = openWindows[id];
    win.el.style.zIndex = ++windowZIndex;
    win.el.style.borderColor = 'var(--accent-bright)';
    win.el.style.boxShadow = '0 0 40px var(--glow-strong)';
    
    activeWindowId = id;
    
    // Taskbar updaten
    document.querySelectorAll('.taskbar-tab').forEach(tab => tab.classList.remove('active'));
    const taskbarTab = document.getElementById('taskbar-tab-' + id);
    if (taskbarTab) taskbarTab.classList.add('active');
    
    // Minimiertes Fenster wiederherstellen
    if (win.minimized) {
        restoreWindow(id);
    }
}

// Fenster schließen
function closeWindow(id) {
    if (!openWindows[id]) return;
    
    const win = openWindows[id];
    
    // Iframe-Inhalt bereinigen
    const iframe = win.el.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    
    // Element entfernen
    win.el.remove();
    
    // Taskbar entfernen
    const taskbarTab = document.getElementById('taskbar-tab-' + id);
    if (taskbarTab) taskbarTab.remove();
    
    delete openWindows[id];
    
    if (activeWindowId === id) {
        activeWindowId = null;
        const remaining = Object.keys(openWindows);
        if (remaining.length > 0) {
            focusWindow(remaining[remaining.length - 1]);
        }
    }
}

// Fenster minimieren
function minimizeWindow(id) {
    if (!openWindows[id]) return;
    
    const win = openWindows[id];
    win.el.style.display = 'none';
    win.minimized = true;
    
    document.getElementById('taskbar-tab-' + id)?.classList.remove('active');
}

// Fenster wiederherstellen
function restoreWindow(id) {
    if (!openWindows[id]) return;
    
    const win = openWindows[id];
    win.el.style.display = 'flex';
    win.minimized = false;
    focusWindow(id);
}

// Maximieren / Wiederherstellen
function toggleMaximize(id) {
    if (!openWindows[id]) return;
    
    const win = openWindows[id];
    const windowEl = win.el;
    
    if (win.maximized) {
        // Wiederherstellen
        windowEl.classList.remove('maximized');
        windowEl.style.left = win.lastPosition.left + 'px';
        windowEl.style.top = win.lastPosition.top + 'px';
        windowEl.style.width = win.lastPosition.width + 'px';
        windowEl.style.height = win.lastPosition.height + 'px';
        win.maximized = false;
    } else {
        // Position speichern
        win.lastPosition = {
            left: parseInt(windowEl.style.left),
            top: parseInt(windowEl.style.top),
            width: parseInt(windowEl.style.width),
            height: parseInt(windowEl.style.height)
        };
        // Maximieren
        windowEl.classList.add('maximized');
        win.maximized = true;
    }
}

// Fenster draggable machen
function makeDraggable(windowEl, id) {
    const titlebar = windowEl.querySelector('.window-titlebar');
    let isDragging = false;
    let offsetX, offsetY;
    
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
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        // Begrenzung innerhalb des Bildschirms
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 44 - 40;
        
        windowEl.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        windowEl.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }
    
    function onDrop() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDrop);
    }
}

// ========== TASKBAR-TABS ==========
function addTaskbarTab(id, title, icon) {
    const tabsContainer = document.getElementById('taskbarTabs');
    
    // Prüfen ob schon existiert
    if (document.getElementById('taskbar-tab-' + id)) return;
    
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab';
    tab.id = 'taskbar-tab-' + id;
    tab.innerHTML = `${icon} ${title}`;
    
    tab.addEventListener('click', () => {
        if (openWindows[id]) {
            if (openWindows[id].minimized) {
                restoreWindow(id);
            } else if (activeWindowId === id) {
                minimizeWindow(id);
            } else {
                focusWindow(id);
            }
        }
    });
    
    tabsContainer.appendChild(tab);
}

// App öffnen (wird von apps.js aufgerufen)
function openApp(appId) {
    // Wird in apps.js definiert
    if (typeof openApplication === 'function') {
        openApplication(appId);
    }
}

console.log('🪟 Fenster-Manager initialisiert');
