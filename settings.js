// ============================================
// MÖRSER-KARL GX LINUX – system.js
// System-Monitor, Task-Manager, Kernel-Infos
// ============================================

// ========== SYSTEM-INFO ==========
const systemInfo = {
    hostname: 'mk-gx',
    kernel: '6.9.0-mk-gx',
    arch: 'x86_64',
    os: 'Mörser-Karl GX Linux',
    version: '2.0.26 LTS',
    shell: 'mk-shell',
    cpu: 'AMD Ryzen 5 3600',
    cores: 6,
    threads: 12,
    ram: '32GB DDR4',
    gpu: 'NVIDIA RTX 3060',
    storage: '64GB USB 3.0',
    init: 'systemd',
    desktop: 'MK-Desktop (i3 Tiling)',
    proxyEngine: 'Cloudflare Worker'
};

// ========== PROZESSE ==========
let systemProcesses = [
    { pid: 1, name: 'systemd', user: 'root', cpu: 0.0, mem: 0.5, status: 'S' },
    { pid: 420, name: 'mk-desktop', user: 'user', cpu: 2.3, mem: 4.2, status: 'S' },
    { pid: 666, name: 'proxy-daemon', user: 'proxy', cpu: 1.1, mem: 1.8, status: 'S' },
    { pid: 1337, name: 'terminal', user: 'user', cpu: 0.5, mem: 0.3, status: 'R' },
    { pid: 8888, name: 'cloudflared', user: 'root', cpu: 0.8, mem: 1.2, status: 'S' },
];

// ========== SYSTEM-MONITOR (HTOP-STYLE) ==========
function openSystemMonitor() {
    const content = `
        <div style="height:100%;background:#0a0a0a;color:#0f0;font-family:'Courier New',monospace;font-size:12px;overflow-y:auto;padding:10px;">
            <div style="color:var(--accent);font-size:14px;margin-bottom:10px;">🐧 MK-GX System Monitor</div>
            
            <!-- CPU -->
            <div style="margin-bottom:15px;">
                <div style="display:flex;justify-content:space-between;">
                    <span>CPU: ${systemInfo.cpu}</span>
                    <span id="cpuUsage">2.3%</span>
                </div>
                <div style="background:#1a1a1a;height:8px;border-radius:4px;margin-top:4px;overflow:hidden;">
                    <div id="cpuBar" style="background:var(--accent);height:100%;width:2.3%;transition:width 0.5s;"></div>
                </div>
            </div>
            
            <!-- RAM -->
            <div style="margin-bottom:15px;">
                <div style="display:flex;justify-content:space-between;">
                    <span>RAM: ${systemInfo.ram}</span>
                    <span id="ramUsage">8.2G / 32G</span>
                </div>
                <div style="background:#1a1a1a;height:8px;border-radius:4px;margin-top:4px;overflow:hidden;">
                    <div id="ramBar" style="background:#0f0;height:100%;width:25%;transition:width 0.5s;"></div>
                </div>
            </div>
            
            <!-- Prozesse -->
            <div style="margin-top:15px;">
                <div style="color:var(--accent);margin-bottom:8px;">📋 Prozesse</div>
                <div style="display:grid;grid-template-columns:50px 1fr 60px 50px 50px 40px;gap:8px;font-size:10px;color:#888;padding:4px 0;border-bottom:1px solid #222;">
                    <span>PID</span><span>NAME</span><span>USER</span><span>CPU%</span><span>MEM%</span><span>STAT</span>
                </div>
                <div id="processList">
                    ${systemProcesses.map(p => `
                        <div style="display:grid;grid-template-columns:50px 1fr 60px 50px 50px 40px;gap:8px;padding:2px 0;font-size:11px;${p.pid===1337?'color:#0f0;':''}">
                            <span>${p.pid}</span><span>${p.name}</span><span>${p.user}</span><span>${p.cpu.toFixed(1)}</span><span>${p.mem.toFixed(1)}</span><span>${p.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- System-Info -->
            <div style="margin-top:15px;color:#888;font-size:10px;border-top:1px solid #222;padding-top:8px;">
                <div>Kernel: ${systemInfo.kernel} | Arch: ${systemInfo.arch}</div>
                <div>Shell: ${systemInfo.shell} | Init: ${systemInfo.init}</div>
                <div>GPU: ${systemInfo.gpu} | Storage: ${systemInfo.storage}</div>
                <div style="margin-top:4px;color:var(--accent);">💣 Mörser-Karl GX ${systemInfo.version}</div>
            </div>
        </div>
    `;
    
    createWindow('sysmon', '📊 System Monitor', '📊', content, 550, 450);
    
    // Live-Updates
    setInterval(() => {
        const cpuEl = document.getElementById('cpuUsage');
        const cpuBar = document.getElementById('cpuBar');
        const ramEl = document.getElementById('ramUsage');
        const ramBar = document.getElementById('ramBar');
        
        if (cpuEl) {
            const cpu = (Math.random() * 5 + 1).toFixed(1);
            cpuEl.textContent = cpu + '%';
            if (cpuBar) cpuBar.style.width = cpu + '%';
        }
        if (ramEl) {
            const used = (Math.random() * 4 + 6).toFixed(1);
            ramEl.textContent = used + 'G / 32G';
            if (ramBar) ramBar.style.width = (parseFloat(used) / 32 * 100) + '%';
        }
    }, 2000);
}

// ========== KERNEL-LOG (DMESG) ==========
function openKernelLog() {
    const logs = [
        '[    0.000000] Linux version 6.9.0-mk-gx (mk@mk-gx)',
        '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-mk-gx root=/dev/sda1',
        '[    0.500000] CPU: AMD Ryzen 5 3600 6-Core Processor',
        '[    1.000000] Memory: 32GB DDR4 available',
        '[    2.000000] USB Storage: 64GB detected on /dev/sda',
        '[    3.000000] Network: Cloudflare Tunnel (cloudflared) initialized',
        '[    4.000000] Proxy Daemon: Started on port 443',
        '[    5.000000] Desktop Environment: MK-Desktop (i3 Tiling) started',
        '[    6.000000] Terminal: mk-shell 2.0.26 ready',
        '[    7.000000] 🐧 Mörser-Karl GX Linux – Boot complete!',
    ];
    
    const content = `
        <div style="height:100%;background:#0a0a0a;color:#0f0;font-family:'Courier New',monospace;font-size:11px;overflow-y:auto;padding:15px;line-height:1.6;">
            <div style="color:var(--accent);font-size:14px;margin-bottom:10px;">📜 dmesg – Kernel Log</div>
            ${logs.map(l => `<div>${l}</div>`).join('')}
            <div style="margin-top:15px;color:#888;">────────────────────────────</div>
            <div style="color:#0f0;">🐧 System läuft seit: ${Math.floor((Date.now() - window.bootTime || Date.now()) / 1000)}s</div>
        </div>
    `;
    
    createWindow('dmesg', '📜 Kernel Log', '📜', content, 600, 400);
}

// ========== NETZWERK-INFO ==========
function openNetworkInfo() {
    const content = `
        <div style="height:100%;background:#0a0a0a;color:#0f0;font-family:'Courier New',monospace;font-size:12px;overflow-y:auto;padding:15px;line-height:1.6;">
            <div style="color:var(--accent);font-size:14px;margin-bottom:10px;">🌐 Netzwerk</div>
            
            <div style="color:#888;">Interface: wlan0</div>
            <div>IP: 192.168.1.42</div>
            <div>Gateway: 192.168.1.1</div>
            <div>DNS: 1.1.1.1 (Cloudflare)</div>
            <div style="margin-top:10px;"></div>
            
            <div style="color:#888;">Tunnel: Cloudflare (cloudflared)</div>
            <div>Status: ✅ Verbunden</div>
            <div>Proxy: ${typeof PROXY !== 'undefined' ? PROXY : 'Nicht initialisiert'}</div>
            <div style="margin-top:10px;"></div>
            
            <div style="color:#888;">Verbindungen:</div>
            <div>TCP: 12 established</div>
            <div>UDP: 4 active</div>
            <div>Bandbreite: ↓ 2.4 MB/s | ↑ 0.8 MB/s</div>
        </div>
    `;
    
    createWindow('network', '🌐 Netzwerk', '🌐', content, 450, 350);
}

// ========== PAKET-MANAGER (MKPKG) ==========
function openPackageManager() {
    const packages = [
        { name: 'mk-desktop', version: '2.0.26', desc: 'Desktop Environment', installed: true },
        { name: 'mk-terminal', version: '1.5.0', desc: 'Linux Terminal Emulator', installed: true },
        { name: 'mk-browser', version: '4.2.0', desc: 'Opera GX Style Browser', installed: true },
        { name: 'proxy-daemon', version: '3.1.2', desc: 'Cloudflare Worker Proxy', installed: true },
        { name: 'cloudflared', version: '2024.11.0', desc: 'Cloudflare Tunnel', installed: true },
        { name: 'neofetch', version: '7.1.0', desc: 'System Info Tool', installed: true },
        { name: 'cowsay', version: '3.04', desc: 'Configurable speaking cow', installed: false },
        { name: 'cmatrix', version: '2.0', desc: 'Matrix-style terminal', installed: false },
    ];
    
    const content = `
        <div style="height:100%;background:var(--surface);color:var(--text);overflow-y:auto;font-family:'Courier New',monospace;font-size:12px;">
            <div style="padding:15px;background:var(--surface-light);border-bottom:1px solid var(--border-dim);color:var(--accent);font-weight:bold;">
                📦 MKPKG – Mörser-Karl Paketmanager
            </div>
            <div style="padding:10px 15px;background:#0a0a0a;border-bottom:1px solid var(--border-dim);color:#0f0;">
                $ mkpkg list --installed
            </div>
            ${packages.map(p => `
                <div style="display:flex;align-items:center;gap:10px;padding:8px 15px;border-bottom:1px solid #1a1a1a;${p.installed?'':'opacity:0.5;'}">
                    <span style="color:${p.installed?'#0f0':'#888'};">${p.installed?'●':'○'}</span>
                    <span style="flex:1;font-weight:bold;">${p.name}</span>
                    <span style="color:var(--text-dim);">v${p.version}</span>
                    <span style="color:#888;font-size:10px;">${p.desc}</span>
                </div>
            `).join('')}
            <div style="padding:10px 15px;color:#888;font-size:10px;">
                8 Pakete | 6 installiert | 2 verfügbar
            </div>
        </div>
    `;
    
    createWindow('mkpkg', '📦 Paketmanager', '📦', content, 550, 400);
}

// ========== TEXT-EDITOR (NANO-STYLE) ==========
function openTextEditor() {
    const content = `
        <div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">
            <div style="display:flex;padding:6px 10px;background:#1a1a1a;border-bottom:1px solid var(--border-dim);justify-content:space-between;align-items:center;">
                <span style="color:#0f0;font-family:monospace;font-size:11px;">📝 nano 7.2 – Neue Datei</span>
                <div style="display:flex;gap:8px;font-size:10px;color:#888;">
                    <span>^G Hilfe</span><span>^O Speichern</span><span>^X Beenden</span>
                </div>
            </div>
            <textarea id="nanoContent" placeholder="Text hier eingeben..." style="flex:1;background:#0a0a0a;border:none;color:#0f0;font-family:'Courier New',monospace;font-size:13px;padding:15px;resize:none;outline:none;line-height:1.5;caret-color:#0f0;"></textarea>
            <div style="display:flex;padding:4px 10px;background:#1a1a1a;border-top:1px solid var(--border-dim);font-size:10px;color:#888;justify-content:space-between;">
                <span>🐧 mk-gx</span>
                <span>Zeile 1, Spalte 1</span>
                <span>UTF-8</span>
            </div>
        </div>
    `;
    
    createWindow('nano', '📝 Text Editor', '📝', content, 600, 400);
}

// ========== SYSTEM-START ==========
window.bootTime = Date.now();

// System-Info global verfügbar
window.mkSystem = {
    info: systemInfo,
    processes: systemProcesses,
    getUptime: () => Math.floor((Date.now() - window.bootTime) / 1000),
    reboot: () => location.reload(),
    shutdown: () => { document.body.style.opacity = '0'; setTimeout(() => document.body.innerHTML = '<div style="color:#0f0;text-align:center;padding:50px;font-size:24px;background:#000;height:100vh;">🐧 System halted.</div>', 500); },
    openMonitor: openSystemMonitor,
    openLog: openKernelLog,
    openNetwork: openNetworkInfo,
    openPkg: openPackageManager,
    openEditor: openTextEditor
};

// System-Monitor in Taskleiste
setInterval(() => {
    const cpuEl = document.querySelector('.taskbar-cpu');
    if (cpuEl) {
        const cpu = (Math.random() * 5 + 1).toFixed(1);
        cpuEl.textContent = 'CPU ' + cpu + '%';
    }
}, 2000);

// Tastenkombinationen für System-Tools
document.addEventListener('keydown', (e) => {
    // Strg+Shift+Esc = System Monitor
    if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        openSystemMonitor();
    }
    // Strg+Alt+L = Kernel Log
    if (e.ctrlKey && e.altKey && e.key === 'l') {
        e.preventDefault();
        openKernelLog();
    }
    // Strg+Alt+N = Netzwerk
    if (e.ctrlKey && e.altKey && e.key === 'n') {
        e.preventDefault();
        openNetworkInfo();
    }
});

console.log('🐧 System bereit – Kernel 6.9.0-mk-gx geladen');
console.log('💣 Mörser-Karl GX Linux Edition – Alle Systeme aktiv!');
