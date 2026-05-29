// ============================================
// MÖRSER-KARL GX DESKTOP – settings.js
// Einstellungen-App
// ============================================

// Einstellungen
let desktopSettings = {
    background: 'radial',
    theme: 'dark',
    proxyMode: 'cloudflare',
    clockFormat: '24h',
    bootAnimation: true,
    desktopIcons: true,
    taskbarPosition: 'bottom',
    startMenuStyle: 'compact'
};

function openSettings() {
    const content = `
        <div style="height:100%;overflow-y:auto;background:var(--surface);color:var(--text);">
            <!-- Hintergrund -->
            <div class="settings-section">
                <div class="settings-title">🖼️ Hintergrund</div>
                <div class="settings-row">
                    <span>Stil</span>
                    <select id="bgStyle" onchange="updateSetting('background', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="radial" ${desktopSettings.background === 'radial' ? 'selected' : ''}>Radial Glow</option>
                        <option value="solid" ${desktopSettings.background === 'solid' ? 'selected' : ''}>Einfarbig</option>
                        <option value="grid" ${desktopSettings.background === 'grid' ? 'selected' : ''}>Gitternetz</option>
                    </select>
                </div>
            </div>
            
            <!-- Theme -->
            <div class="settings-section">
                <div class="settings-title">🎨 Theme</div>
                <div class="settings-row">
                    <span>Farbmodus</span>
                    <select id="themeMode" onchange="updateSetting('theme', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="dark" ${desktopSettings.theme === 'dark' ? 'selected' : ''}>Dark (Orange)</option>
                        <option value="midnight" ${desktopSettings.theme === 'midnight' ? 'selected' : ''}>Midnight (Blau)</option>
                        <option value="cyberpunk" ${desktopSettings.theme === 'cyberpunk' ? 'selected' : ''}>Cyberpunk (Neon)</option>
                    </select>
                </div>
            </div>
            
            <!-- Proxy -->
            <div class="settings-section">
                <div class="settings-title">🔗 Proxy</div>
                <div class="settings-row">
                    <span>Aktiver Proxy</span>
                    <span style="color:var(--accent);font-size:11px;">${PROXY_CONFIG.cloudflare.active ? 'Cloudflare' : 'Lokal'}</span>
                </div>
                <div class="settings-row">
                    <span>Proxy wechseln</span>
                    <button class="settings-btn" onclick="switchProxy('cloudflare');updateSettingsUI();">Cloudflare</button>
                </div>
                <div class="settings-row">
                    <span></span>
                    <button class="settings-btn" onclick="switchProxy('local');updateSettingsUI();">Lokal</button>
                </div>
                <div class="settings-row">
                    <span>Proxy-URL</span>
                    <span style="font-size:10px;word-break:break-all;">${PROXY}</span>
                </div>
                <div class="settings-row">
                    <span>Proxy testen</span>
                    <button class="settings-btn" onclick="testProxySettings()">Test starten</button>
                </div>
                <div id="proxyTestResult" style="font-size:10px;margin-top:8px;"></div>
            </div>
            
            <!-- System -->
            <div class="settings-section">
                <div class="settings-title">⚙️ System</div>
                <div class="settings-row">
                    <span>Boot-Animation</span>
                    <input type="checkbox" ${desktopSettings.bootAnimation ? 'checked' : ''} onchange="updateSetting('bootAnimation', this.checked)">
                </div>
                <div class="settings-row">
                    <span>Desktop-Icons</span>
                    <input type="checkbox" ${desktopSettings.desktopIcons ? 'checked' : ''} onchange="updateSetting('desktopIcons', this.checked)">
                </div>
                <div class="settings-row">
                    <span>Uhrzeit-Format</span>
                    <select id="clockFormat" onchange="updateSetting('clockFormat', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="24h" ${desktopSettings.clockFormat === '24h' ? 'selected' : ''}>24 Stunden</option>
                        <option value="12h" ${desktopSettings.clockFormat === '12h' ? 'selected' : ''}>12 Stunden</option>
                    </select>
                </div>
            </div>
            
            <!-- Info -->
            <div class="settings-section">
                <div class="settings-title">ℹ️ Über</div>
                <div style="font-size:12px;line-height:1.6;">
                    <strong>Mörser-Karl GX Desktop</strong><br>
                    Version 2.0.26<br>
                    Build: Desktop Edition<br>
                    <br>
                    Proxy-System: Aktiv<br>
                    Fenster-Manager: v1.0<br>
                    <br>
                    <span style="color:var(--text-dim);">© 2024 Mörser-Karl GX</span>
                </div>
            </div>
        </div>
    `;
    
    createWindow('settings', '⚙️ Einstellungen', '⚙️', content, 500, 500);
}

function updateSetting(key, value) {
    desktopSettings[key] = value;
    console.log('⚙️ Einstellung aktualisiert:', key, '=', value);
    
    // Einstellungen anwenden
    applySettings();
}

function applySettings() {
    const body = document.body;
    
    // Hintergrund
    switch(desktopSettings.background) {
        case 'solid':
            body.style.backgroundImage = 'none';
            body.style.background = '#0a0a0a';
            break;
        case 'grid':
            body.style.backgroundImage = 'linear-gradient(rgba(255,69,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,69,0,0.05) 1px, transparent 1px)';
            body.style.backgroundSize = '40px 40px';
            break;
        case 'radial':
        default:
            body.style.backgroundImage = 'radial-gradient(ellipse at center, #2a1000 0%, #0a0a0a 70%)';
            break;
    }
    
    // Desktop-Icons
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.style.display = desktopSettings.desktopIcons ? 'grid' : 'none';
    }
}

function updateSettingsUI() {
    // Fenster-Inhalt aktualisieren
    const content = document.querySelector('#window-settings .window-content');
    if (content) {
        // Proxy-Info aktualisieren
        const proxyInfo = content.querySelector('.settings-row span[style*="word-break"]');
        if (proxyInfo) proxyInfo.textContent = PROXY;
    }
}

async function testProxySettings() {
    const resultEl = document.getElementById('proxyTestResult');
    if (!resultEl) return;
    
    resultEl.innerHTML = '<span style="color:#ff0;">⏳ Teste Proxy...</span>';
    
    const results = await testProxy();
    
    resultEl.innerHTML = `
        Cloudflare: ${results.cloudflare ? '✅' : '❌'} 
        | Lokal: ${results.local ? '✅' : '❌'}
        <br><span style="color:#888;">${results.timestamp}</span>
    `;
}

// Einstellungen beim Start anwenden
setTimeout(() => applySettings(), 500);

console.log('⚙️ Einstellungen bereit');
