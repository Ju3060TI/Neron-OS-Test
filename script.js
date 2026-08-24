// ============================================================
//  NERON OS – Desktop mit Taskleiste & echtem Taskmanager
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

// ---------- UHR ----------
function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 10000);

// ---------- STARTMENÜ ----------
startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => startMenu.classList.add('hidden'));
startMenu.addEventListener('click', (e) => e.stopPropagation());

// ---------- DESKTOP ICONS ----------
const apps = [
    { id: 'files', label: 'Dateien', icon: '📁' },
    { id: 'browser', label: 'Browser', icon: '🌐' },
    { id: 'settings', label: 'Einstellungen', icon: '⚙️' },
    { id: 'taskmanager', label: 'Taskmanager', icon: '📊' },
];

apps.forEach(app => {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.dataset.app = app.id;
    el.innerHTML = `<span class="icon">${app.icon}</span><span class="label">${app.label}</span>`;
    wallpaper.appendChild(el);
    el.addEventListener('click', () => openApp(app.id));
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
        case 'terminal': showNotification('Terminal', 'Terminal wurde geöffnet.'); break;
    }
}

// ---------- WINDOW HELPER ----------
function createWindow(title, bodyHTML, width = 520, height = 340, x = 80, y = 60) {
    const id = 'win-' + (++windowCounter);
    const win = document.createElement('div');
    win.className = 'window active';
    win.id = id;
    const maxW = window.innerWidth - 40;
    const maxH = window.innerHeight - 120;
    win.style.width = Math.min(width, maxW) + 'px';
    win.style.height = Math.min(height, maxH) + 'px';
    win.style.left = Math.min(x, maxW - 100) + 'px';
    win.style.top = Math.min(y, maxH - 60) + 'px';
    win.style.zIndex = 10 + windowCounter;

    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <span class="close" data-win="${id}">✕</span>
        </div>
        <div class="window-body">${bodyHTML}</div>
    `;
    container.appendChild(win);

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

    // Drag
    const header = win.querySelector('.window-header');
    let isDragging = false, ox = 0, oy = 0;
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.close')) return;
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

    return win;
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

    function renderTasks(filter = '') {
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
    }

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

    // Footer + Actions
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

    // Live-Updates
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

// ---------- BROWSER ----------
function openBrowser() {
    const win = createWindow('Browser', `
        <div class="browser-bar">
            <input type="text" id="browserUrl" placeholder="URL eingeben..." value="neron-os.dev">
            <button id="browserGo">Go</button>
        </div>
        <div class="browser-content" id="browserContent">
            <div class="greeting">🌐 NERON BROWSER</div>
            <p style="margin-top:8px;color:#5f738c;">Gib eine URL ein oder klick auf ein Lesezeichen.</p>
            <div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap;">
                <span style="color:#5f8ab5;cursor:pointer;" data-url="google.com">Google</span>
                <span style="color:#5f8ab5;cursor:pointer;" data-url="youtube.com">YouTube</span>
                <span style="color:#5f8ab5;cursor:pointer;" data-url="github.com">GitHub</span>
            </div>
        </div>
    `, 580, 360, 120, 60);

    const urlInput = win.querySelector('#browserUrl');
    const goBtn = win.querySelector('#browserGo');
    const content = win.querySelector('#browserContent');

    function navigate(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        content.innerHTML = `
            <div style="color:#5f738c;">Lade <span style="color:#b0c4de;">${url}</span> ...</div>
            <div style="margin-top:16px;color:#3a4a5a;font-size:12px;">🌐 Demo – der echte Browser würde die Seite laden.</div>
        `;
        showNotification('Browser', `Navigiere zu ${url}`);
    }

    goBtn.addEventListener('click', () => navigate(urlInput.value.trim() || 'neron-os.dev'));
    urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') goBtn.click(); });
    content.querySelectorAll('[data-url]').forEach(el => {
        el.addEventListener('click', () => {
            urlInput.value = el.dataset.url;
            navigate(el.dataset.url);
        });
    });
    setTimeout(() => navigate('neron-os.dev'), 100);
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

console.log('🔥 NERON OS – Desktop geladen!');
