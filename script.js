// ============================================================
//  NERON OS – CORE EDITION
//  Nur Dateien, Browser, Einstellungen + Taskmanager (live)
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

// ---------- DOM ----------
const desktop = document.getElementById('desktop');
const container = document.getElementById('window-container');
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
    window.notiTimeout = setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}
notiClose.addEventListener('click', () => notification.classList.add('hidden'));

// ---------- WINDOW HELPERS ----------
function createWindow(title, bodyHTML, width = 520, height = 340, x = 80, y = 60) {
    const win = document.createElement('div');
    win.className = 'window';
    win.style.width = Math.min(width, desktop.clientWidth - 40) + 'px';
    win.style.height = Math.min(height, desktop.clientHeight - 60) + 'px';
    win.style.left = Math.min(x, desktop.clientWidth - win.style.width.replace('px','') - 20) + 'px';
    win.style.top = Math.min(y, desktop.clientHeight - win.style.height.replace('px','') - 20) + 'px';

    win.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <span class="close">✕</span>
        </div>
        <div class="window-body">${bodyHTML}</div>
    `;

    container.appendChild(win);

    // Close
    win.querySelector('.close').addEventListener('click', () => {
        win.remove();
    });

    // Drag
    const header = win.querySelector('.window-header');
    let isDragging = false, ox = 0, oy = 0;
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = win.getBoundingClientRect();
        const dRect = desktop.getBoundingClientRect();
        ox = e.clientX - rect.left;
        oy = e.clientY - rect.top;
        win.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dRect = desktop.getBoundingClientRect();
        let x = e.clientX - dRect.left - ox;
        let y = e.clientY - dRect.top - oy;
        x = Math.max(0, Math.min(x, dRect.width - win.offsetWidth));
        y = Math.max(0, Math.min(y, dRect.height - win.offsetHeight - 10));
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
        <table class="task-table" id="taskTable">
            <thead><tr>
                <th>PID</th><th>NAME</th><th>CPU</th><th>RAM</th><th>STATUS</th><th></th>
            </tr></thead>
            <tbody id="taskTableBody"></tbody>
        </table>
    `, 640, 380, 60, 40);

    const tbody = win.querySelector('#taskTableBody');

    function render(filter = '') {
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
                    render(searchInput.value);
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
    searchInput.addEventListener('input', () => render(searchInput.value));

    actions.querySelector('.refresh').addEventListener('click', () => {
        render(searchInput.value);
        showNotification('Aktualisiert', 'Prozessliste neu geladen.');
    });

    actions.querySelector('.kill-all').addEventListener('click', () => {
        if (processes.length === 0) {
            showNotification('Info', 'Keine Prozesse zum Töten.');
            return;
        }
        const count = processes.length;
        processes = [];
        render(searchInput.value);
        showNotification('Massaker', `${count} Prozesse wurden getötet.`);
    });

    render('');

    // Live-Updates
    const interval = setInterval(() => {
        if (!win.isConnected) { clearInterval(interval); return; }
        processes.forEach(p => {
            p.cpu = Math.max(0, Math.min(100, p.cpu + (Math.random() - 0.5) * 8));
            p.cpu = Math.round(p.cpu);
        });
        render(searchInput.value);
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
        { name: 'config.json', type: 'file' },
    ];

    let listHTML = '<ul class="file-list">';
    files.forEach(f => {
        const icon = f.type === 'folder' ? '📁' : '📄';
        const cls = f.type === 'folder' ? 'folder' : 'file';
        listHTML += `<li class="${cls}"><span>${icon}</span> ${f.name}</li>`;
    });
    listHTML += '</ul>';

    const win = createWindow('Dateien', listHTML, 440, 320, 100, 80);
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
            <input type="text" id="browserUrl" placeholder="URL eingeben..." value="https://neron-os.dev">
            <button id="browserGo">Los</button>
        </div>
        <div class="browser-content" id="browserContent">
            <div class="greeting">🌐 NERON BROWSER</div>
            <p style="margin-top:10px;color:#5f738c;">Willkommen im Neron-Browser. Gib eine URL ein und klick auf "Los".</p>
            <p style="margin-top:6px;color:#3a4a5a;font-size:12px;">(Demo – Seiten werden nicht geladen, nur die Idee.)</p>
        </div>
    `, 600, 360, 120, 60);

    const urlInput = win.querySelector('#browserUrl');
    const goBtn = win.querySelector('#browserGo');
    const content = win.querySelector('#browserContent');

    function navigate(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        content.innerHTML = `
            <div style="color:#5f738c;">Lade <span style="color:#b0c4de;">${url}</span> ...</div>
            <div style="margin-top:20px;color:#3a4a5a;font-size:12px;">🌐 Dies ist eine Demo. Der echte Browser würde jetzt die Seite laden.</div>
            <div style="margin-top:8px;color:#3a4a5a;font-size:12px;">🔒 Neron OS – Sicher & schnell.</div>
        `;
        showNotification('Browser', `Navigiere zu ${url}`);
    }

    goBtn.addEventListener('click', () => {
        const url = urlInput.value.trim() || 'neron-os.dev';
        navigate(url);
    });

    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') goBtn.click();
    });

    setTimeout(() => navigate('neron-os.dev'), 100);
}

// ---------- EINSTELLUNGEN ----------
function openSettings() {
    const win = createWindow('Einstellungen', `
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
            <select>
                <option>Dunkel (Standard)</option>
                <option>Hell</option>
                <option>Neron Rot</option>
            </select>
        </div>
        <div class="setting-group">
            <label>System-Töne</label>
            <div class="toggle-group">
                <div class="toggle active" id="soundToggle"></div>
                <span>Aktiviert</span>
            </div>
        </div>
    `, 440, 320, 200, 100);

    // Toggle
    const toggle = win.querySelector('.toggle');
    const label = toggle.parentElement.querySelector('span');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        label.textContent = toggle.classList.contains('active') ? 'Aktiviert' : 'Deaktiviert';
        showNotification('Einstellung', `System-Töne ${label.textContent.toLowerCase()}.`);
    });

    // Slider
    win.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            showNotification('Einstellung', `${slider.parentElement.querySelector('label').textContent} auf ${slider.value}% gesetzt.`);
        });
    });

    // Select
    win.querySelector('select').addEventListener('change', (e) => {
        showNotification('Design', `Design auf "${e.target.value}" gesetzt.`);
    });
}

// ---------- DESKTOP ICONS ----------
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const app = icon.dataset.app;
        switch (app) {
            case 'files': openFiles(); break;
            case 'settings': openSettings(); break;
            case 'browser': openBrowser(); break;
            case 'taskmanager': openTaskmanager(); break;
        }
    });
});

// ---------- RESPONSIVE: Fenster beim Resize anpassen ----------
window.addEventListener('resize', () => {
    document.querySelectorAll('.window').forEach(win => {
        const maxW = desktop.clientWidth - 40;
        const maxH = desktop.clientHeight - 60;
        const w = parseInt(win.style.width);
        const h = parseInt(win.style.height);
        if (w > maxW) win.style.width = maxW + 'px';
        if (h > maxH) win.style.height = maxH + 'px';
        const left = parseInt(win.style.left);
        const top = parseInt(win.style.top);
        if (left + w > desktop.clientWidth) win.style.left = (desktop.clientWidth - w - 20) + 'px';
        if (top + h > desktop.clientHeight) win.style.top = (desktop.clientHeight - h - 20) + 'px';
    });
});

console.log('🔥 NERON OS – Core Edition geladen!');
console.log('📌 Klicke auf die Icons, um die Apps zu öffnen.');
