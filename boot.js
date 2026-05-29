// ============================================
// MÖRSER-KARL GX DESKTOP – boot.js
// Start-Animation & System-Initialisierung
// ============================================

// ========== BOOT-SEQUENZ ==========
function initBoot() {
    const bootScreen = document.getElementById('bootScreen');
    const bootBar = document.querySelector('.boot-bar');
    const bootLogo = document.querySelector('.boot-logo');
    
    if (!bootScreen || !bootBar) {
        // Falls kein Boot-Screen, direkt starten
        finishBoot();
        return;
    }
    
    // Boot-Animation starten
    console.log('💣 MÖRSER-KARL GX DESKTOP – Boote...');
    
    // Logo-Pulsation
    let pulseCount = 0;
    const logoInterval = setInterval(() => {
        if (bootLogo) {
            bootLogo.style.transform = 'scale(1.2)';
            setTimeout(() => { if (bootLogo) bootLogo.style.transform = 'scale(1)'; }, 300);
        }
        pulseCount++;
        if (pulseCount >= 6) clearInterval(logoInterval);
    }, 500);
    
    // Ladebalken
    setTimeout(() => {
        bootBar.style.width = '25%';
        console.log('🟢 Kernel geladen...');
    }, 600);
    
    setTimeout(() => {
        bootBar.style.width = '50%';
        console.log('🟢 Proxy initialisiert...');
    }, 1200);
    
    setTimeout(() => {
        bootBar.style.width = '75%';
        console.log('🟢 Fenster-Manager gestartet...');
    }, 1800);
    
    setTimeout(() => {
        bootBar.style.width = '95%';
        console.log('🟢 Desktop bereit...');
    }, 2400);
    
    // Boot abschließen
    setTimeout(() => {
        bootBar.style.width = '100%';
        finishBoot(bootScreen);
    }, 3000);
}

function finishBoot(bootScreen) {
    if (bootScreen) {
        bootScreen.classList.add('hidden');
        setTimeout(() => {
            if (bootScreen.parentNode) {
                bootScreen.parentNode.removeChild(bootScreen);
            }
        }, 800);
    }
    
    console.log('✅ MÖRSER-KARL GX DESKTOP – Bereit!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💣 System online');
    console.log('🔗 Proxy:', PROXY);
    console.log('📱 Apps geladen');
    console.log('🖥️ Desktop initialisiert');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Willkommen-Fenster (optional)
    setTimeout(() => {
        showWelcomeMessage();
    }, 1000);
    
    // Auto-Start Apps
    setTimeout(() => {
        autoStartApps();
    }, 2000);
}

// ========== WILLKOMMEN ==========
function showWelcomeMessage() {
    // Kleines Willkommen-Fenster (nur beim ersten Start)
    const content = `
        <div style="padding:20px;text-align:center;color:var(--text);">
            <div style="font-size:48px;">💣</div>
            <h2 style="color:var(--accent);margin:15px 0;">Willkommen bei Mörser-Karl GX!</h2>
            <p style="font-size:13px;line-height:1.6;">
                Desktop Edition v2.0.26<br>
                Proxy-System aktiv<br>
                <br>
                <span style="color:var(--text-dim);font-size:11px;">
                    Doppelklick auf Icons zum Öffnen<br>
                    Rechtsklick für Kontextmenü<br>
                    Terminal mit 'help' für Befehle
                </span>
            </p>
            <button onclick="closeWindow('welcome')" 
                    style="margin-top:15px;padding:8px 24px;background:var(--accent);border:none;border-radius:20px;color:#000;font-weight:700;cursor:pointer;">
                LOS GEHT'S! 🚀
            </button>
        </div>
    `;
    
    createWindow('welcome', '💣 Willkommen', '💣', content, 380, 320);
}

// ========== AUTO-START ==========
function autoStartApps() {
    // Öffne den Browser automatisch
    console.log('🚀 Auto-Start: Browser wird geöffnet...');
    // openMoerserKarlBrowser(); // Einkommentieren für Auto-Start
}

// ========== SYSTEM-EVENTS ==========
// Tastenkombinationen
document.addEventListener('keydown', (e) => {
    // Strg+Alt+T = Terminal
    if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault();
        openTerminal();
    }
    
    // Strg+Alt+B = Browser
    if (e.ctrlKey && e.altKey && e.key === 'b') {
        e.preventDefault();
        openMoerserKarlBrowser();
    }
    
    // Strg+Alt+S = Settings
    if (e.ctrlKey && e.altKey && e.key === 's') {
        e.preventDefault();
        openSettings();
    }
    
    // Strg+Alt+Entf = Task-Manager (einfach Fenster-Liste)
    if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault();
        showTaskManager();
    }
});

// ========== TASK-MANAGER ==========
function showTaskManager() {
    const windowList = Object.entries(openWindows).map(([id, win]) => {
        return `<div class="file-item">
            <span>${win.icon}</span> ${win.title}
            <button onclick="closeWindow('${id}')" style="margin-left:auto;background:#f44336;border:none;color:#fff;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:10px;">Beenden</button>
        </div>`;
    }).join('');
    
    const content = `
        <div style="padding:10px;">
            <h3 style="color:var(--accent);margin-bottom:10px;">📋 Task-Manager</h3>
            ${windowList || '<p style="color:var(--text-dim);">Keine offenen Fenster</p>'}
            <div style="margin-top:10px;font-size:10px;color:var(--text-dim);">
                Offene Fenster: ${Object.keys(openWindows).length}
            </div>
        </div>
    `;
    
    createWindow('taskmanager', '📋 Task-Manager', '📋', content, 350, 250);
}

// ========== SYSTEM-INFO ==========
function getSystemInfo() {
    return {
        version: '2.0.26',
        build: 'Desktop Edition',
        proxy: PROXY_CONFIG.cloudflare.active ? 'Cloudflare' : 'Local',
        proxyUrl: PROXY,
        openWindows: Object.keys(openWindows).length,
        desktopIcons: desktopIcons.length,
        uptime: Math.floor((Date.now() - bootTime) / 1000),
        userAgent: navigator.userAgent
    };
}

let bootTime = Date.now();

// ========== INIT ==========
console.log('💣 MÖRSER-KARL GX DESKTOP');
console.log('═══════════════════════');
console.log('Starte Boot-Sequenz...');

// Boot starten
initBoot();

// Globale System-Info
window.mkSystem = {
    version: '2.0.26',
    getInfo: getSystemInfo,
    reboot: () => {
        document.body.style.opacity = '0';
        setTimeout(() => location.reload(), 500);
    }
};

console.log('🟢 boot.js geladen');
