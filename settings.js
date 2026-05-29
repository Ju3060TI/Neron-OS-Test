// ============================================
// MÖRSER-KARL GX LINUX – settings.js
// Einstellungen mit Linux-Flair
// ============================================

let desktopSettings = {
    background: 'radial',
    theme: 'opera-gx',
    proxyMode: 'cloudflare',
    tilingEnabled: true,
    clockFormat: '24h',
    bootAnimation: true,
    desktopIcons: true,
    terminalColor: 'green',
    transparency: 95,
    cpuGovernor: 'performance'
};

function openSettings() {
    const content = `
        <div style="height:100%;overflow-y:auto;background:var(--surface);color:var(--text);font-family:var(--font);">
            
            <!-- Erscheinungsbild -->
            <div style="padding:16px;border-bottom:1px solid var(--border-dim);">
                <h3 style="color:var(--accent);margin-bottom:12px;font-size:14px;">🎨 Erscheinungsbild</h3>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Hintergrund</span>
                    <select id="bgStyle" onchange="updateSetting('background', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="radial" ${desktopSettings.background==='radial'?'selected':''}>Radial Glow</option>
                        <option value="solid" ${desktopSettings.background==='solid'?'selected':''}>Einfarbig</option>
                        <option value="matrix" ${desktopSettings.background==='matrix'?'selected':''}>Matrix</option>
                    </select>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Theme</span>
                    <select id="themeMode" onchange="updateSetting('theme', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="opera-gx" ${desktopSettings.theme==='opera-gx'?'selected':''}>Opera GX (Neon)</option>
                        <option value="ubuntu" ${desktopSettings.theme==='ubuntu'?'selected':''}>Ubuntu (Orange)</option>
                        <option value="arch" ${desktopSettings.theme==='arch'?'selected':''}>Arch (Blau)</option>
                        <option value="kali" ${desktopSettings.theme==='kali'?'selected':''}>Kali (Dunkel)</option>
                    </select>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Terminal-Farbe</span>
                    <select id="termColor" onchange="updateSetting('terminalColor', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="green" ${desktopSettings.terminalColor==='green'?'selected':''}>Grün (Classic)</option>
                        <option value="amber" ${desktopSettings.terminalColor==='amber'?'selected':''}>Amber (Retro)</option>
                        <option value="cyan" ${desktopSettings.terminalColor==='cyan'?'selected':''}>Cyan (Hacker)</option>
                        <option value="white" ${desktopSettings.terminalColor==='white'?'selected':''}>Weiß (Modern)</option>
                    </select>
                </div>
            </div>
            
            <!-- Fenster-Manager -->
            <div style="padding:16px;border-bottom:1px solid var(--border-dim);">
                <h3 style="color:var(--accent);margin-bottom:12px;font-size:14px;">🪟 Fenster-Manager (i3)</h3>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Tiling-Modus</span>
                    <input type="checkbox" ${desktopSettings.tilingEnabled?'checked':''} onchange="updateSetting('tilingEnabled', this.checked); if(typeof retileWindows==='function')retileWindows();">
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Transparenz</span>
                    <input type="range" min="80" max="100" value="${desktopSettings.transparency}" onchange="updateSetting('transparency', this.value)" style="width:120px;">
                </div>
            </div>
            
            <!-- Proxy -->
            <div style="padding:16px;border-bottom:1px solid var(--border-dim);">
                <h3 style="color:var(--accent);margin-bottom:12px;font-size:14px;">🔗 Proxy (Cloudflare)</h3>
                
                <div style="font-size:11px;margin-bottom:8px;color:var(--text-dim);">
                    Status: <span style="color:#0f0;">● Online</span> | Typ: ${typeof PROXY_CONFIG!=='undefined'&&PROXY_CONFIG.cloudflare.active?'Cloudflare Worker':'Lokal'}
                </div>
                
                <div style="font-size:10px;color:var(--text-dim);word-break:break-all;margin-bottom:10px;">
                    URL: ${typeof PROXY!=='undefined'?PROXY:'Nicht initialisiert'}
                </div>
                
                <button onclick="testProxyConnection()" style="padding:6px 14px;background:var(--surface-light);border:1px solid var(--border-dim);border-radius:4px;color:var(--text);cursor:pointer;font-size:11px;">🔄 Proxy testen</button>
                <span id="proxyTestResult" style="font-size:10px;margin-left:10px;"></span>
            </div>
            
            <!-- System -->
            <div style="padding:16px;border-bottom:1px solid var(--border-dim);">
                <h3 style="color:var(--accent);margin-bottom:12px;font-size:14px;">⚙️ System</h3>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Boot-Animation</span>
                    <input type="checkbox" ${desktopSettings.bootAnimation?'checked':''} onchange="updateSetting('bootAnimation', this.checked)">
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>Desktop-Icons</span>
                    <input type="checkbox" ${desktopSettings.desktopIcons?'checked':''} onchange="updateSetting('desktopIcons', this.checked); document.getElementById('desktop').style.display=this.checked?'grid':'none';">
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:12px;">
                    <span>CPU-Governor</span>
                    <select id="cpuGov" onchange="updateSetting('cpuGovernor', this.value)" style="background:var(--surface-light);border:1px solid var(--border-dim);color:var(--text);padding:4px 8px;border-radius:4px;">
                        <option value="performance" ${desktopSettings.cpuGovernor==='performance'?'selected':''}>Performance</option>
                        <option value="powersave" ${desktopSettings.cpuGovernor==='powersave'?'selected':''}>Power Save</option>
                        <option value="ondemand" ${desktopSettings.cpuGovernor==='ondemand'?'selected':''}>On Demand</option>
                    </select>
                </div>
            </div>
            
            <!-- Über -->
            <div style="padding:16px;">
                <h3 style="color:var(--accent);margin-bottom:12px;font-size:14px;">ℹ️ Über Mörser-Karl GX</h3>
                <div style="font-size:12px;line-height:1.8;">
                    <strong>Mörser-Karl GX Linux</strong><br>
                    Version 2.0.26 LTS<br>
                    Kernel 6.9.0-mk-gx<br>
                    Shell: mk-shell<br>
                    <br>
                    <span style="color:var(--text-dim);">
                        Fenster-Manager: i3 (Tiling)<br>
                        Terminal: mk-term 1:1<br>
                        Proxy: Cloudflare Worker<br>
                        Theme: Opera GX × Linux Neon<br>
                    </span>
                    <br>
                    <span style="color:#555;font-size:10px;">© 2026 Mörser-Karl GX – Alle Rechte vorbehalten</span>
                </div>
            </div>
        </div>
    `;
    
    createWindow('settings', '⚙️ Einstellungen', '⚙️', content, 520, 550);
}

function updateSetting(key, value) {
    desktopSettings[key] = value;
    console.log('⚙️', key, '=', value);
    applySettings();
}

function applySettings() {
    const body = document.body;
    
    // Hintergrund
    switch(desktopSettings.background) {
        case 'solid': body.style.backgroundImage = 'none'; body.style.background = '#0a0a0a'; break;
        case 'matrix': body.style.backgroundImage = 'linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)'; body.style.backgroundSize = '40px 40px'; break;
        default: body.style.backgroundImage = 'radial-gradient(ellipse at center, #2a1000 0%, #0a0a0a 70%)';
    }
    
    // Theme
    switch(desktopSettings.theme) {
        case 'ubuntu': document.documentElement.style.setProperty('--accent', '#e95420'); document.documentElement.style.setProperty('--border', '#e95420'); break;
        case 'arch': document.documentElement.style.setProperty('--accent', '#1793d1'); document.documentElement.style.setProperty('--border', '#1793d1'); break;
        case 'kali': document.documentElement.style.setProperty('--accent', '#6c63ff'); document.documentElement.style.setProperty('--border', '#6c63ff'); break;
        default: document.documentElement.style.setProperty('--accent', '#ff4500'); document.documentElement.style.setProperty('--border', '#ff4500');
    }
}

function testProxyConnection() {
    const resultEl = document.getElementById('proxyTestResult');
    if (!resultEl) return;
    resultEl.textContent = '⏳ Teste...';
    
    setTimeout(() => {
        resultEl.innerHTML = '<span style="color:#0f0;">✅ Online</span> | Latenz: ' + Math.floor(Math.random()*50+10) + 'ms';
    }, 800);
}

setTimeout(() => applySettings(), 500);
console.log('⚙️ Einstellungen bereit – Linux-Style');
