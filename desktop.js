// ============================================
// MÖRSER-KARL GX DESKTOP – desktop.js
// ============================================

// Desktop-Icons
const desktopIcons = [
    { id: 'browser', icon: '🌐', label: 'Browser', app: 'browser' },
    { id: 'youtube', icon: '▶️', label: 'YouTube', app: 'youtube' },
    { id: 'games', icon: '🎮', label: 'Games', app: 'games' },
    { id: 'ki', icon: '🧠', label: 'KI-Chat', app: 'ki' },
    { id: 'terminal', icon: '💻', label: 'Terminal', app: 'terminal' },
    { id: 'files', icon: '📁', label: 'Dateien', app: 'files' },
    { id: 'settings', icon: '⚙️', label: 'Settings', app: 'settings' },
    { id: 'spotify', icon: '🎵', label: 'Spotify', app: 'spotify' },
    { id: 'netflix', icon: '🎬', label: 'Netflix', app: 'netflix' },
    { id: 'twitch', icon: '📺', label: 'Twitch', app: 'twitch' },
    { id: 'discord', icon: '💬', label: 'Discord', app: 'discord' },
    { id: 'github', icon: '🐙', label: 'GitHub', app: 'github' },
];

// Desktop initialisieren
function initDesktop() {
    const desktop = document.getElementById('desktop');
    desktop.innerHTML = '';
    
    desktopIcons.forEach(item => {
        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon';
        iconEl.id = 'icon-' + item.id;
        iconEl.innerHTML = `
            <div class="icon-img">${item.icon}</div>
            <div class="icon-label">${item.label}</div>
        `;
        
        // Doppelklick öffnet App
        iconEl.addEventListener('dblclick', () => {
            openApp(item.app);
        });
        
        // Einfachklick selektiert
        iconEl.addEventListener('click', (e) => {
            e.stopPropagation();
            selectIcon(item.id);
        });
        
        // Drag & Drop
        iconEl.draggable = true;
        iconEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.id);
            iconEl.style.opacity = '0.5';
        });
        iconEl.addEventListener('dragend', () => {
            iconEl.style.opacity = '1';
        });
        
        desktop.appendChild(iconEl);
    });
    
    // Kontextmenü auf Desktop
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
    
    // Klick auf Desktop → Kontextmenü schließen, Deselektieren
    desktop.addEventListener('click', () => {
        hideContextMenu();
        deselectAllIcons();
    });
}

// Icon selektieren
function selectIcon(id) {
    deselectAllIcons();
    const icon = document.getElementById('icon-' + id);
    if (icon) {
        icon.style.background = 'rgba(255, 69, 0, 0.2)';
        icon.style.borderRadius = '8px';
    }
}

// Alle Icons deselektieren
function deselectAllIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.style.background = '';
    });
}

// Kontextmenü
function showContextMenu(x, y) {
    const menu = document.getElementById('contextMenu');
    menu.classList.remove('hidden');
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    
    // Menü schließen wenn woanders geklickt
    setTimeout(() => {
        document.addEventListener('click', hideContextMenu, { once: true });
    }, 0);
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.add('hidden');
}

function refreshDesktop() {
    initDesktop();
    hideContextMenu();
}

// ========== STARTMENÜ ==========
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    const btn = document.getElementById('startBtn');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        btn.classList.add('active');
        populateStartMenu();
    } else {
        menu.classList.add('hidden');
        btn.classList.remove('active');
    }
}

function populateStartMenu() {
    const startApps = document.getElementById('startApps');
    startApps.innerHTML = '';
    
    desktopIcons.forEach(item => {
        const appEl = document.createElement('div');
        appEl.className = 'start-app-item';
        appEl.innerHTML = `<span>${item.icon}</span> ${item.label}`;
        appEl.addEventListener('click', () => {
            openApp(item.app);
            toggleStartMenu();
        });
        startApps.appendChild(appEl);
    });
}

// Start-Button Event
document.getElementById('startBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
});

// Klick außerhalb schließt Startmenü
document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const btn = document.getElementById('startBtn');
    if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.add('hidden');
        btn.classList.remove('active');
    }
});

// Shutdown
document.getElementById('startShutdown').addEventListener('click', () => {
    if (confirm('Mörser-Karl GX herunterfahren?')) {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.close();
            // Fallback
            document.body.innerHTML = '<div style="color:#ff4500;text-align:center;padding:50px;">💣 System heruntergefahren</div>';
        }, 500);
    }
});

// ========== UHR ==========
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('taskbarClock').textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

// ========== PROXY STATUS ==========
function updateProxyStatus() {
    const dot = document.getElementById('proxyStatus');
    if (typeof PROXY !== 'undefined' && PROXY) {
        dot.classList.remove('offline');
        dot.title = 'Proxy Online – ' + PROXY;
    } else {
        dot.classList.add('offline');
        dot.title = 'Proxy Offline';
    }
}
setInterval(updateProxyStatus, 5000);
updateProxyStatus();

// ========== DRAG & DROP FÜR DESKTOP ==========
document.getElementById('desktop').addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.getElementById('desktop').addEventListener('drop', (e) => {
    e.preventDefault();
    const iconId = e.dataTransfer.getData('text/plain');
    const icon = document.getElementById('icon-' + iconId);
    if (icon) {
        // Position als Grid-Item bleibt erhalten
        // Nur visuelles Feedback
        icon.style.transform = 'scale(1.1)';
        setTimeout(() => { icon.style.transform = ''; }, 200);
    }
});

// ========== INIT ==========
console.log('💣 MÖRSER-KARL GX DESKTOP – Desktop initialisiert');
initDesktop();
