// Desktop-Icons
const desktopIcons = [
    { id: 'browser', icon: '🌐', label: 'Browser', app: 'browser' },
    { id: 'terminal', icon: '💻', label: 'Terminal', app: 'terminal' },
    { id: 'files', icon: '📁', label: 'Dateien', app: 'files' },
    { id: 'settings', icon: '⚙️', label: 'Settings', app: 'settings' },
    { id: 'youtube', icon: '▶️', label: 'YouTube', app: 'youtube' },
    { id: 'games', icon: '🎮', label: 'Games', app: 'games' },
    { id: 'ki', icon: '🧠', label: 'KI', app: 'ki' },
    { id: 'spotify', icon: '🎵', label: 'Spotify', app: 'spotify' },
    { id: 'calculator', icon: '🔢', label: 'Rechner', app: 'calculator' },
    { id: 'notepad', icon: '📝', label: 'Notizen', app: 'notepad' },
];

function initDesktop() {
    const desktop = document.getElementById('desktop');
    desktop.innerHTML = '';
    desktopIcons.forEach(item => {
        const iconEl = document.createElement('div');
        iconEl.className = 'desktop-icon';
        iconEl.innerHTML = `<div class="icon-img">${item.icon}</div><div class="icon-label">${item.label}</div>`;
        iconEl.addEventListener('dblclick', () => openApp(item.app));
        desktop.appendChild(iconEl);
    });
}

// Startmenü
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    const btn = document.getElementById('startBtn');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden'); btn.classList.add('active');
        document.getElementById('startApps').innerHTML = desktopIcons.map(i =>
            `<div class="start-app-item" onclick="openApp('${i.app}');toggleStartMenu()"><span>${i.icon}</span> ${i.label}</div>`
        ).join('');
    } else {
        menu.classList.add('hidden'); btn.classList.remove('active');
    }
}

document.getElementById('startBtn').addEventListener('click', e => { e.stopPropagation(); toggleStartMenu(); });
document.addEventListener('click', () => { document.getElementById('startMenu').classList.add('hidden'); document.getElementById('startBtn').classList.remove('active'); });
document.getElementById('startShutdown').addEventListener('click', () => { document.body.style.opacity = '0'; setTimeout(() => document.body.innerHTML = '<div style="color:#ff4500;text-align:center;padding:50px;font-size:24px;">🐧 System halted.</div>', 500); });

// Uhr
setInterval(() => document.getElementById('taskbarClock').textContent = new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'}), 1000);
// CPU simuliert
setInterval(() => document.querySelector('.taskbar-cpu').textContent = 'CPU ' + (Math.random()*5+1).toFixed(1) + '%', 2000);

// Proxy Status
setInterval(() => {
    const dot = document.getElementById('proxyStatus');
    dot.style.background = typeof PROXY !== 'undefined' && PROXY ? '#0f0' : '#f00';
}, 5000);

// Kontextmenü
document.getElementById('desktop').addEventListener('contextmenu', e => {
    e.preventDefault();
    const menu = document.getElementById('contextMenu');
    menu.classList.remove('hidden');
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    setTimeout(() => document.addEventListener('click', () => menu.classList.add('hidden'), { once: true }), 0);
});

function refreshDesktop() { initDesktop(); document.getElementById('contextMenu').classList.add('hidden'); }

// Workspaces (i3-style)
document.querySelectorAll('.ws').forEach(ws => {
    ws.addEventListener('click', function() {
        document.querySelectorAll('.ws').forEach(w => w.classList.remove('active'));
        this.classList.add('active');
    });
});

initDesktop();
