// ============================================================
//  NERON OS – Desktop mit Taskleiste, Terminal, Browser, Drag
// ============================================================

// ---------- PROZESS-DATEN ----------
let processes = [
    { pid: 101, name: 'Minecraft', cpu: 45, ram: 3.2, status: 'running' },
    { pid: 102, name: 'Discord', cpu: 8, ram: 0.28, status: 'running' },
    { pid: 103, name: 'Chrome', cpu: 15, ram: 1.8, status: 'running' },
    { pid: 104, name: 'Neron-Update', cpu: 2, ram: 0.05, status: 'paused' },
    { pid: 105, name: 'Bash', cpu: 0, ram: 0.008, status: 'running' },
    { pid: 106, name: 'Explorer', cpu: 1, ram: 0.02, status: 'running' },
];
let nextPid = 107;
let windowCounter = 0;

// ---------- DOM REFS ----------
const wallpaper = document.getElementById('wallpaper');
const container = document.getElementById('window-container');
const taskItems = document.getElementById('taskItems');
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
const clockEl = document.getElementById('clock');
const notification = document.getElementById('notification');
const notiTitle = document.getElementById('notiTitle');
const notiText = document.getElementById('notiText');
const notiClose = document.getElementById('notiClose');

// ---------- NOTIFICATION ----------
function showNotification(title, text) {
    notiTitle.textContent = title;
    notiText.textContent = text;
    notification.classList.remove('hidden');
    clearTimeout(window.notiTimeout);
    window.notiTimeout = setTimeout(() => notification.classList.add('hidden'), 4000);
}
notiClose.addEventListener('click', () => notification.classList.add('hidden'));

// ---------- LIVE-UHR ----------
function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
updateClock();
setInterval(updateClock, 1000);

// ---------- STARTMENÜ ----------
startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => startMenu.classList.add('hidden'));
startMenu.addEventListener('click', (e) => e.stopPropagation());

// ---------- DESKTOP ICONS ----------
const appIcons = [
    { id: 'files', label: 'Dateien', icon: '📁' },
    { id: 'browser', label: 'Browser', icon: '🌐' },
    { id: 'settings', label: 'Einstellungen', icon: '⚙️' },
    { id: 'taskmanager', label: 'Taskmanager', icon: '📊' },
    { id: 'terminal', label: 'Terminal', icon: '🖥️' },
];

let dragData = null;

appIcons.forEach(app => {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.dataset.app = app.id;
    el.draggable = true;
    el.innerHTML = `<span class="icon">${app.icon}</span><span class="label">${app.label}</span>`;
    wallpaper.appendChild(el);

    el.addEventListener('click', () => openApp(app.id));

    el.addEventListener('dragstart', (e) => {
        dragData = { id: app.id, el: el };
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
        document.querySelectorAll('.desktop-icon.drag-over').forEach(ic => ic.classList.remove('drag-over'));
    });
    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragData && dragData.id !== app.id) {
            el.classList.add('drag-over');
        }
    });
    el.addEventListener('dragleave', () => {
        el.classList.remove('drag-over');
    });
    el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        if (!dragData || dragData.id === app.id) return;
        const children = Array.from(wallpaper.children);
        const idx1 = children.indexOf(dragData.el);
        const idx2 = children.indexOf(el);
        if (idx1 < idx2) {
            wallpaper.insertBefore(dragData.el, el.nextSibling);
        } else {
            wallpaper.insertBefore(dragData.el, el);
        }
        dragData = null;
        showNotification('Icon verschoben', `${app.label} wurde verschoben.`);
    });
});

// ---------- STARTMENÜ-APPS ----------
document.querySelectorAll('.start-app').forEach(el => {
    el.addEventListener('click', () => {
        startMenu.classList.add('hidden');
        openApp(el.dataset.app);
    });
});

// ---------- APP-ÖFFNER ----------
function openApp(appId) {
    switch (appId) {
        case 'files': openFiles(); break;
        case 'browser': openBrowser(); break;
        case 'settings': openSettings(); break;
        case 'taskmanager': openTaskmanager(); break;
        case 'terminal': openTerminal(); break;
        default: showNotification('Info', `App "${appId}" wird geöffnet.`);
    }
}

// ---------- WINDOW HELPER (mit Fullscreen) ----------
function createWindow(title, bodyHTML, width = 520, height = 340, x = 80, y = 60) {
    const id = 'win-' + (++windowCounter);
    const win = document.createElement('div');
    win.className = 'window active';
    win.id = id;
    const maxW = window.innerWidth - 40;
    const maxH = window.innerHeight - 130;
    win.style.width = Math.min(width, maxW) + 'px';
    win.style.height = Math.min(height, maxH) + 'px';
    win.style.left = Math.min(x, maxW - 100) + 'px';
    win.style.top = Math.min(y, maxH - 60) + 'px';
    win.style.zIndex = 10 + windowCounter;

    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <div class="window-controls">
                <span class="fullscreen-btn" title="Fullscreen (Doppelklick oder hier klicken)">⛶</span>
                <span class="close" data-win="${id}">✕</span>
            </div>
        </div>
        <div class="window-body">${bodyHTML}</div>
    `;
    container.appendChild(win);

    // Fullscreen per Doppelklick auf Header
    const header = win.querySelector('.window-header');
    header.addEventListener('dblclick', () => toggleFullscreen(win));

    // Fullscreen-Button
    win.querySelector('.fullscreen-btn').addEventListener('click', () => toggleFullscreen(win));

    // Taskleiste-Eintrag
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item active';
    taskItem.textContent = title;
    taskItem.dataset.win = id;
    taskItem.addEventListener('click', () => {
        const w = document.getElementById(id);
        if (w) {
            w.classList.toggle('active');
            taskItem.classList.toggle('active');
            if (w.classList.contains('active')) w.style.zIndex = 10 + (++windowCounter);
        }
    });
    taskItems.appendChild(taskItem);

    // Close-Button
    win.querySelector('.close').addEventListener('click', () => {
        win.remove();
        taskItem.remove();
        showNotification('Fenster geschlossen', `${title} wurde geschlossen.`);
    });

    // Drag (Fenster) – nur wenn nicht im Fullscreen
    let isDragging = false,
        ox = 0,
        oy = 0;
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.close') || e.target.closest('.fullscreen-btn')) return;
        if (win.classList.contains('fullscreen')) return;
        isDragging = true;
        const rect = win.getBoundingClientRect();
        ox = e.clientX - rect.left;
        oy = e.clientY - rect.top;
        win.style.cursor = 'grabbing';
        win.style.zIndex = 10 + (++windowCounter);
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dRect = document.body.getBoundingClientRect();
        let x = e.clientX - dRect.left - ox;
        let y = e.clientY - dRect.top - oy;
        x = Math.max(0, Math.min(x, window.innerWidth - win.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - win.offsetHeight - 60));
        win.style.left = x + 'px';
        win.style.top = y + 'px';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        win.style.cursor = 'default';
    });

    // ESC zum Verlassen von Fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && win.classList.contains('fullscreen')) {
            toggleFullscreen(win);
        }
    });

    return win;
}

// ---------- FULLSCREEN TOGGLE ----------
function toggleFullscreen(win) {
    win.classList.toggle('fullscreen');
    if (win.classList.contains('fullscreen')) {
        win.style.zIndex = 999;
        // Taskleiste ausblenden?
        // document.querySelector('.taskbar').style.display = 'none';
        showNotification('Fullscreen', 'Fenster ist jetzt im Vollbildmodus. ESC zum Verlassen.');
    } else {
        win.style.zIndex = 10 + (++windowCounter);
        // document.querySelector('.taskbar').style.display = 'flex';
        // Fenster wieder in normale Größe bringen
        const maxW = window.innerWidth - 40;
        const maxH = window.innerHeight - 130;
        win.style.width = Math.min(520, maxW) + 'px';
        win.style.height = Math.min(340, maxH) + 'px';
        win.style.left = Math.min(80, maxW - 100) + 'px';
        win.style.top = Math.min(60, maxH - 60) + 'px';
        showNotification('Fullscreen', 'Vollbildmodus verlassen.');
    }
}

// ---------- TERMINAL ----------
function openTerminal() {
    const win = createWindow('Terminal', `
        <div class="terminal-output" id="termOutput">
            <span style="color:#5f738c;">Neron OS Terminal v1.0</span>
            <span style="color:#5f738c;">╔═══════════════════════════╗</span>
            <span style="color:#5f738c;">║  Willkommen, Imperator!  ║</span>
            <span style="color:#5f738c;">╚═══════════════════════════╝</span>
            <span style="color:#5faf5f;">$ <span id="termReady">Bereit</span></span>
        </div>
        <div class="terminal-input-line">
            <span>$</span>
            <input type="text" id="termInput" placeholder="Befehl eingeben..." autofocus />
        </div>
    `, 560, 340, 100, 70);

    const output = win.querySelector('#termOutput');
    const input = win.querySelector('#termInput');
    const ready = win.querySelector('#termReady');

    function executeCommand(cmd) {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        output.innerHTML += `\n<span style="color:#5faf5f;">$</span> ${trimmed}`;

        const parts = trimmed.split(' ');
        const mainCmd = parts[0].toLowerCase();

        switch (mainCmd) {
            case 'help':
                output.innerHTML += `\n<span style="color:#5f8ab5;">Verfügbare Befehle:</span>
                \n  <span style="color:#d7af5f;">help</span>   – Diese Hilfe anzeigen
                \n  <span style="color:#d7af5f;">clear</span>  – Terminal löschen
                \n  <span style="color:#d7af5f;">echo</span>   – Text ausgeben
                \n  <span style="color:#d7af5f;">date</span>   – Aktuelle Zeit anzeigen
                \n  <span style="color:#d7af5f;">whoami</span> – Benutzername anzeigen
                \n  <span style="color:#d7af5f;">ps</span>     – Prozesse anzeigen
                \n  <span style="color:#d7af5f;">kill</span>   – Prozess beenden (kill PID)
                \n  <span style="color:#d7af5f;">neofetch</span> – Systeminfo`;
                break;
            case 'clear':
                output.innerHTML = `<span style="color:#5f738c;">Terminal geleert.</span>`;
                break;
            case 'echo':
                output.innerHTML += `\n${parts.slice(1).join(' ')}`;
                break;
            case 'date':
                output.innerHTML += `\n${new Date().toLocaleString('de-DE')}`;
                break;
            case 'whoami':
                output.innerHTML += `\nimperator`;
                break;
            case 'ps':
                processes.forEach(p => {
                    output.innerHTML += `\n  ${p.pid}  ${p.name.padEnd(12)} ${p.cpu}%  ${p.ram.toFixed(2)}G  ${p.status}`;
                });
                break;
            case 'kill':
                const pid = parseInt(parts[1]);
                if (isNaN(pid)) {
                    output.innerHTML += `\n<span style="color:#c05a5a;">Fehler: PID angeben (z.B. kill 101)</span>`;
                } else {
                    const idx = processes.findIndex(p => p.pid === pid);
                    if (idx === -1) {
                        output.innerHTML += `\n<span style="color:#c05a5a;">Prozess mit PID ${pid} nicht gefunden.</span>`;
                    } else {
                        const name = processes[idx].name;
                        processes.splice(idx, 1);
                        output.innerHTML += `\n<span style="color:#5faf5f;">Prozess ${name} (PID ${pid}) wurde beendet.</span>`;
                        showNotification('Terminal', `${name} wurde gekillt.`);
                        document.querySelectorAll('.window').forEach(w => {
                            if (w.querySelector('#taskTableBody')) {
                                const search = w.querySelector('#taskSearch')?.value || '';
                                renderTasks(search);
                            }
                        });
                    }
                }
                break;
            case 'neofetch':
                output.innerHTML += `
                \n<span style="color:#5f8ab5;">    ███████   Neron OS</span>
                \n<span style="color:#5f8ab5;">   ███  ███   Version: 1.0 (Preview)</span>
                \n<span style="color:#5f8ab5;">  ███    ███  Architektur: Web x86_64</span>
                \n<span style="color:#5f8ab5;">  ███████████ Kernel: Neron v1.0</span>
                \n<span style="color:#5f8ab5;">  ███    ███  CPU: ${navigator.hardwareConcurrency || '?'} Kerne</span>
                \n<span style="color:#5f8ab5;">   ███  ███   RAM: ${(processes.reduce((s,p) => s + p.ram, 0)).toFixed(1)} / 8.0 GB</span>
                \n<span style="color:#5f8ab5;">    ███████   Prozesse: ${processes.length}</span>
                \n<span style="color:#5f738c;">   ⚡ Der Imperator grüßt!</span>`;
                break;
            default:
                output.innerHTML += `\n<span style="color:#c05a5a;">Unbekannter Befehl: ${trimmed}</span>`;
        }

        output.scrollTop = output.scrollHeight;
        ready.textContent = 'Bereit';
        input.value = '';
        input.focus();
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(input.value);
        }
    });

    win.addEventListener('click', () => input.focus());
    setTimeout(() => input.focus(), 200);
}

// ---------- BROWSER ----------
function openBrowser() {
    const win = createWindow('Browser', `
        <div class="browser-bar">
            <input type="text" id="browserUrl" placeholder="URL eingeben..." value="https://example.com" />
            <button id="browserGo">Go</button>
            <button id="browserHome">🏠</button>
        </div>
        <iframe class="browser-iframe" id="browserFrame" src="https://example.com"></iframe>
    `, 680, 480, 80, 40);

    const urlInput = win.querySelector('#browserUrl');
    const goBtn = win.querySelector('#browserGo');
    const homeBtn = win.querySelector('#browserHome');
    const frame = win.querySelector('#browserFrame');

    function navigate(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        try {
            frame.src = url;
            urlInput.value = url;
            showNotification('Browser', `Navigiere zu ${url}`);
        } catch (e) {
            showNotification('Browser', 'Fehler beim Laden der Seite.');
        }
    }

    goBtn.addEventListener('click', () => navigate(urlInput.value.trim()));
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') goBtn.click();
    });
    homeBtn.addEventListener('click', () => navigate('https://example.com'));

    setTimeout(() => navigate('https://example.com'), 200);
}

// ---------- TASKMANAGER ----------
function openTaskmanager() {
    const win = createWindow('NERON TASKMANAGER', `
        <table class="task-table">
            <thead><tr><th>PID</th><th>NAME</th><th>CPU</th><th>RAM</th><th>STATUS</th><th></th></tr></thead>
            <tbody id="taskTableBody"></tbody>
        </table>
    `, 640, 400, 60, 40);

    const tbody = win.querySelector('#taskTableBody');

    window.renderTasks = function(filter = '') {
        const filtered = processes.filter(p =>
            p.name.toLowerCase().includes(filter.toLowerCase())
        );
        tbody.innerHTML = '';
        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="pid">${p.pid}</td>
                <td class="name">${p.name}</td>
                <td>${p.cpu}%</td>
                <td>${p.ram >= 1 ? p.ram.toFixed(1) + 'G' : (p.ram * 1024).toFixed(0) + 'M'}</td>
                <td class="status ${p.status}">● ${p.status}</td>
                <td><span class="kill-btn" data-pid="${p.pid}">[KILL]</span></td>
            `;
            tbody.appendChild(tr);
        });
        document.querySelectorAll('#taskTableBody .kill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = parseInt(btn.dataset.pid);
                const idx = processes.findIndex(p => p.pid === pid);
                if (idx !== -1) {
                    const name = processes[idx].name;
                    processes.splice(idx, 1);
                    renderTasks(searchInput?.value || '');
                    updateFooter();
                    showNotification('Prozess getötet', `${name} (PID ${pid}) wurde beendet.`);
                }
            });
        });
        updateFooter();
    };

    function updateFooter() {
        const totalCpu = processes.reduce((s, p) => s + p.cpu, 0);
        const totalRam = processes.reduce((s, p) => s + p.ram, 0);
        const footer = win.querySelector('.window-footer');
        if (footer) {
            footer.innerHTML = `
                <span>CPU: ${Math.min(totalCpu, 100)}%</span>
                <span>RAM: ${totalRam.toFixed(1)} / 8.0 GB</span>
                <span>DISK: 4.2 / 64 GB</span>
            `;
        }
    }

    const body = win.querySelector('.window-body');
    const footer = document.createElement('div');
    footer.className = 'window-footer';
    body.after(footer);

    const actions = document.createElement('div');
    actions.className = 'window-actions';
    actions.innerHTML = `
        <span class="kill-all">[KILL ALL]</span>
        <span class="refresh">[REFRESH]</span>
        <span class="search">[SEARCH: <input type="text" id="taskSearch" placeholder="filter...">]</span>
    `;
    body.after(actions);

    const searchInput = actions.querySelector('#taskSearch');
    searchInput.addEventListener('input', () => renderTasks(searchInput.value));

    actions.querySelector('.refresh').addEventListener('click', () => {
        renderTasks(searchInput.value);
        showNotification('Aktualisiert', 'Prozessliste neu geladen.');
    });

    actions.querySelector('.kill-all').addEventListener('click', () => {
        if (!processes.length) {
            showNotification('Info', 'Keine Prozesse zum Töten.');
            return;
        }
        const count = processes.length;
        processes = [];
        renderTasks(searchInput.value);
        showNotification('Massaker', `${count} Prozesse wurden getötet.`);
    });

    renderTasks('');

    const interval = setInterval(() => {
        if (!win.isConnected) { clearInterval(interval); return; }
        processes.forEach(p => {
            p.cpu = Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 8));
            p.cpu = Math.round(p.cpu);
        });
        renderTasks(searchInput.value);
    }, 5000);
    win.addEventListener('remove', () => clearInterval(interval));
}

// ---------- DATEIEN ----------
function openFiles() {
    const files = [
        { name: 'Dokumente', type: 'folder' },
        { name: 'Bilder', type: 'folder' },
        { name: 'Musik', type: 'folder' },
        { name: 'Projekte', type: 'folder' },
        { name: 'README.md', type: 'file' },
        { name: 'index.html', type: 'file' },
    ];
    let html = '<ul class="file-list">';
    files.forEach(f => {
        const icon = f.type === 'folder' ? '📁' : '📄';
        html += `<li class="${f.type}"><span>${icon}</span> ${f.name}</li>`;
    });
    html += '</ul>';
    const win = createWindow('Dateien', html, 420, 300, 100, 80);
    win.querySelectorAll('.file-list li').forEach(li => {
        li.addEventListener('click', () => {
            showNotification('Datei geöffnet', `${li.textContent.trim()} wurde geöffnet.`);
        });
    });
}

// ---------- EINSTELLUNGEN ----------
function openSettings() {
    createWindow('Einstellungen', `
        <div class="setting-group">
            <label>Helligkeit</label>
            <input type="range" min="0" max="100" value="80">
        </div>
        <div class="setting-group">
            <label>Lautstärke</label>
            <input type="range" min="0" max="100" value="65">
        </div>
        <div class="setting-group">
            <label>Design</label>
            <select><option>Dunkel (Standard)</option><option>Hell</option><option>Neron Rot</option></select>
        </div>
        <div style="color:#5f738c;font-size:12px;margin-top:12px;padding:8px;background:#0f141c;border-radius:4px;border:1px solid #1a212b;">
            <strong>System</strong><br>
            Version: 1.0<br>
            RAM: 8.0 GB (davon ${processes.reduce((s,p) => s + p.ram, 0).toFixed(1)} GB genutzt)<br>
            Prozesse: ${processes.length}
        </div>
    `, 420, 340, 200, 100);
}

// ---------- INIT ----------
console.log('🔥 NERON OS – Desktop mit Fullscreen, Terminal, Browser & Drag geladen!');
