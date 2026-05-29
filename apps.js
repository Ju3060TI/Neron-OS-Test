// ============================================
// MÖRSER-KARL GX DESKTOP – apps.js (MIT MÖRSER-KARL BROWSER)
// Alle Apps inklusive unserem eigenen Browser
// ============================================

// Haupt-App-Öffner
function openApplication(appId) {
    switch(appId) {
        case 'browser':
            openMoerserKarlBrowser();  // 🆕 Unser eigener Browser!
            break;
        case 'youtube':
            openYouTube();
            break;
        case 'games':
            openGames();
            break;
        case 'ki':
            openKI();
            break;
        case 'terminal':
            openTerminal();
            break;
        case 'files':
            openFiles();
            break;
        case 'settings':
            openSettings();
            break;
        case 'spotify':
            openWebApp('Spotify', '🎵', 'https://open.spotify.com/');
            break;
        case 'netflix':
            openWebApp('Netflix', '🎬', PROXY + 'https://www.netflix.com/');
            break;
        case 'twitch':
            openWebApp('Twitch', '📺', PROXY + 'https://www.twitch.tv/');
            break;
        case 'discord':
            openWebApp('Discord', '💬', PROXY + 'https://discord.com/app/');
            break;
        case 'github':
            openWebApp('GitHub', '🐙', 'https://github.com/');
            break;
        default:
            openMoerserKarlBrowser();
    }
}

// ========== 🆕 MÖRSER-KARL BROWSER ==========
function openMoerserKarlBrowser() {
    const content = `
        <div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">
            <!-- Top Bar -->
            <div style="display:flex;padding:8px 12px;gap:8px;align-items:center;background:#0d0d0d;border-bottom:1px solid var(--border);">
                <span style="font-size:16px;font-weight:900;letter-spacing:2px;
                    background:linear-gradient(135deg,#ff4500,#ff6347);
                    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                    background-clip:text;white-space:nowrap;">
                    💣 MÖRSER-KARL GX
                </span>
                <input type="text" id="mkUrlInput" placeholder="🔍 URL oder Suche..." 
                       style="flex:1;padding:8px 15px;background:#1a1a1a;border:1px solid #333;border-radius:25px;color:#ccc;font-size:13px;outline:none;"
                       onkeypress="if(event.key==='Enter')mkNavigate()"
                       onfocus="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 15px var(--glow)'"
                       onblur="this.style.borderColor='#333';this.style.boxShadow='none'">
                <button onclick="mkNavigate()" 
                        style="padding:8px 20px;background:transparent;border:1px solid var(--accent);border-radius:25px;color:var(--accent);font-weight:700;cursor:pointer;font-size:12px;text-transform:uppercase;letter-spacing:1px;transition:all 0.3s;"
                        onmouseover="this.style.background='var(--accent)';this.style.color='#000';this.style.boxShadow='0 0 20px var(--glow-strong)'"
                        onmouseout="this.style.background='transparent';this.style.color='var(--accent)';this.style.boxShadow='none'">
                    🎯 FEUER!
                </button>
            </div>
            
            <!-- Tabs -->
            <div id="mkTabs" style="display:flex;background:#0a0a0a;border-bottom:1px solid #222;padding:0 8px;gap:2px;overflow-x:auto;min-height:34px;"></div>
            
            <!-- Frames -->
            <div id="mkFrames" style="flex:1;position:relative;background:#000;">
                <div id="mkStartPage" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;background:radial-gradient(ellipse at center,#3a1500 0%,#1a0500 40%,#0a0a0a 70%);z-index:5;pointer-events:none;">
                    <div style="font-size:60px;font-weight:900;letter-spacing:5px;
                        background:linear-gradient(135deg,#ff4500,#ff8c00,#ff6347);
                        -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                        background-clip:text;text-transform:uppercase;margin-bottom:5px;">
                        MÖRSER-KARL
                    </div>
                    <div style="font-size:14px;color:#555;letter-spacing:3px;">GX EDITION</div>
                </div>
            </div>
            
            <!-- Status Bar -->
            <div style="display:flex;padding:5px 15px;background:#0d0d0d;border-top:1px solid #222;font-size:11px;color:#555;gap:20px;">
                <span><span style="width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block;box-shadow:0 0 8px var(--accent);margin-right:6px;"></span> Geschützt</span>
                <span>🔒 Proxy aktiv</span>
                <span id="mkTabCount">0 Tabs</span>
            </div>
        </div>
    `;
    
    createWindow('browser', '💣 Mörser-Karl GX', '💣', content, 1000, 600);
    
    // Mörser-Karl Browser initialisieren
    setTimeout(() => initMoerserKarlBrowser(), 100);
}

// Mörser-Karl Browser Logik
let mkTabs = [];
let mkActiveTabId = null;
let mkTabCounter = 0;

function initMoerserKarlBrowser() {
    window.mkNavigate = function() {
        const input = document.getElementById('mkUrlInput');
        if (!input) return;
        
        let eingabe = input.value.trim();
        if (!eingabe) return;
        
        const lower = eingabe.toLowerCase();
        let url;
        
        // Keywords
        const seiten = {
            'youtube': 'https://www.youtube.com/',
            'yt': 'https://www.youtube.com/',
            'google': 'https://www.google.com/',
            'github': 'https://github.com/',
            'wiki': 'https://www.wikipedia.org/',
            'spotify': 'https://open.spotify.com/',
            'netflix': 'https://www.netflix.com/',
            'twitch': 'https://www.twitch.tv/',
            'discord': 'https://discord.com/app/',
            'chatgpt': 'https://chat.openai.com/',
            'claude': 'https://claude.ai/',
            'deepseek': 'https://chat.deepseek.com/',
        };
        
        if (seiten[lower]) {
            url = seiten[lower];
        } else if (eingabe.includes('.') && !eingabe.includes(' ')) {
            if (!eingabe.startsWith('http')) eingabe = 'https://' + eingabe;
            url = eingabe;
        } else {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(eingabe);
        }
        
        // Proxy?
        if (needsProxy(url)) {
            url = PROXY + url;
        }
        
        mkAddTab(url, lower.length > 20 ? lower.substring(0, 20) + '...' : lower);
        input.value = url;
    };
    
    window.mkAddTab = function(url, title) {
        mkTabCounter++;
        const tabId = 'mktab-' + mkTabCounter;
        mkTabs.push({ id: tabId, url, title });
        
        const startPage = document.getElementById('mkStartPage');
        if (startPage) startPage.style.display = 'none';
        
        // Tab-Element
        const tabsContainer = document.getElementById('mkTabs');
        const tabEl = document.createElement('div');
        tabEl.id = 'tab-el-' + tabId;
        tabEl.style.cssText = 'padding:6px 15px;background:#1a1a1a;color:#999;border-radius:6px 6px 0 0;cursor:pointer;font-size:11px;border:1px solid transparent;border-bottom:none;white-space:nowrap;display:flex;align-items:center;gap:6px;transition:all 0.2s;';
        tabEl.innerHTML = `<span>${title}</span><span style="font-size:13px;opacity:0.5;cursor:pointer;" onclick="event.stopPropagation();mkCloseTab('${tabId}')">✕</span>`;
        tabEl.addEventListener('click', () => mkSwitchTab(tabId));
        tabsContainer.appendChild(tabEl);
        
        // Frame
        const framesContainer = document.getElementById('mkFrames');
        const frame = document.createElement('iframe');
        frame.id = 'frame-' + tabId;
        frame.src = url;
        frame.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;background:#000;display:none;';
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation');
        framesContainer.appendChild(frame);
        
        mkSwitchTab(tabId);
        mkUpdateTabCount();
    };
    
    window.mkSwitchTab = function(tabId) {
        document.querySelectorAll('#mkTabs > div').forEach(t => {
            t.style.background = '#1a1a1a';
            t.style.color = '#999';
            t.style.borderColor = 'transparent';
        });
        document.querySelectorAll('#mkFrames iframe').forEach(f => f.style.display = 'none');
        
        const tabEl = document.getElementById('tab-el-' + tabId);
        const frame = document.getElementById('frame-' + tabId);
        
        if (tabEl) {
            tabEl.style.background = '#0d0d0d';
            tabEl.style.color = '#ff6347';
            tabEl.style.borderColor = 'var(--accent)';
        }
        if (frame) frame.style.display = 'block';
        
        mkActiveTabId = tabId;
    };
    
    window.mkCloseTab = function(tabId) {
        document.getElementById('tab-el-' + tabId)?.remove();
        document.getElementById('frame-' + tabId)?.remove();
        mkTabs = mkTabs.filter(t => t.id !== tabId);
        
        if (mkActiveTabId === tabId) {
            if (mkTabs.length > 0) mkSwitchTab(mkTabs[mkTabs.length - 1].id);
            else {
                mkActiveTabId = null;
                const startPage = document.getElementById('mkStartPage');
                if (startPage) startPage.style.display = 'flex';
            }
        }
        mkUpdateTabCount();
    };
    
    function mkUpdateTabCount() {
        const el = document.getElementById('mkTabCount');
        if (el) el.textContent = mkTabs.length + ' Tab' + (mkTabs.length !== 1 ? 's' : '');
    }
}

// ========== YOUTUBE ==========
function openYouTube() {
    const url = PROXY + 'https://www.youtube.com/';
    const content = `<iframe src="${url}" style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
    createWindow('youtube', '▶️ YouTube', '▶️', content, 950, 550);
}

// ========== GAMES ==========
function openGames() {
    const games = [
        { name: 'Desert Order', icon: '🏜️', url: 'https://desertorder.com/' },
        { name: 'Bloxd.io', icon: '🎮', url: 'https://bloxd.io/' },
        { name: 'Cookie Clicker', icon: '🍪', url: 'https://orteil.dashnet.org/cookieclicker/' },
        { name: '1v1.LOL', icon: '🔫', url: 'https://1v1.lol/' },
        { name: 'Krunker', icon: '🎯', url: 'https://krunker.io/' },
        { name: 'Slope', icon: '⛷️', url: 'https://slope.game/' },
        { name: 'Subway Surfers', icon: '🏃', url: 'https://subwaysurfers.com/' },
        { name: 'Geometry Dash', icon: '📐', url: 'https://geometrydash.io/' },
    ];
    
    let gamesHTML = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:15px;">';
    games.forEach(game => {
        gamesHTML += `
            <div onclick="openWebApp('${game.name}', '${game.icon}', PROXY + '${game.url}')" 
                 style="padding:15px;background:var(--surface-light);border:1px solid var(--border-dim);border-radius:8px;cursor:pointer;text-align:center;transition:all 0.2s;"
                 onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 15px var(--glow)'"
                 onmouseout="this.style.borderColor='var(--border-dim)';this.style.boxShadow='none'">
                <div style="font-size:32px;">${game.icon}</div>
                <div style="font-size:12px;color:var(--text);margin-top:8px;">${game.name}</div>
            </div>
        `;
    });
    gamesHTML += '</div>';
    
    createWindow('games', '🎮 Games', '🎮', gamesHTML, 500, 450);
}

// ========== KI ==========
function openKI() {
    const kiTools = [
        { name: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com/' },
        { name: 'Claude', icon: '🧪', url: 'https://claude.ai/' },
        { name: 'DeepSeek', icon: '🧠', url: 'https://chat.deepseek.com/' },
        { name: 'Perplexity', icon: '🔍', url: 'https://perplexity.ai/' },
        { name: 'Gemini', icon: '💎', url: 'https://gemini.google.com/' },
        { name: 'Grok', icon: '🐦', url: 'https://grok.x.ai/' },
    ];
    
    let kiHTML = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:15px;">';
    kiTools.forEach(tool => {
        kiHTML += `
            <div onclick="openWebApp('${tool.name}', '${tool.icon}', PROXY + '${tool.url}')" 
                 style="padding:15px;background:var(--surface-light);border:1px solid var(--border-dim);border-radius:8px;cursor:pointer;text-align:center;transition:all 0.2s;"
                 onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 15px var(--glow)'"
                 onmouseout="this.style.borderColor='var(--border-dim)';this.style.boxShadow='none'">
                <div style="font-size:32px;">${tool.icon}</div>
                <div style="font-size:12px;color:var(--text);margin-top:8px;">${tool.name}</div>
            </div>
        `;
    });
    kiHTML += '</div>';
    
    createWindow('ki', '🧠 KI-Chat', '🧠', kiHTML, 500, 400);
}

// ========== WEB-APP ==========
function openWebApp(name, icon, url) {
    const content = `<iframe src="${url}" style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    createWindow(id, `${icon} ${name}`, icon, content, 900, 500);
}

// ========== PROXY-CHECK ==========
function needsProxy(url) {
    const proxyDomains = [
        'youtube.com', 'youtu.be', 'youtube-nocookie.com',
        'netflix.com', 'twitch.tv', 'disneyplus.com',
        'tiktok.com', 'instagram.com', 'snapchat.com',
        'reddit.com', 'twitter.com', 'x.com',
        'discord.com', 'open.spotify.com',
        'chat.openai.com', 'claude.ai', 'chat.deepseek.com',
        'grok.x.ai', 'perplexity.ai', 'gemini.google.com',
        'desertorder.com', '1v1.lol', 'subwaysurfers.com',
        'geometrydash.io', 'krunker.io', 'shellshockers.io',
        'slope.game', 'orteil.dashnet.org'
    ];
    return proxyDomains.some(d => url.includes(d));
}

console.log('📱 Apps initialisiert – MÖRSER-KARL BROWSER READY 💣');
