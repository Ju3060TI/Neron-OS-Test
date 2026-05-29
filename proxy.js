// ============================================
// MÖRSER-KARL GX DESKTOP – proxy.js
// Proxy-Verbindung & Konfiguration
// ============================================

// ========== PROXY-KONFIGURATION ==========
const PROXY_CONFIG = {
    // Primär: Cloudflare Worker
    cloudflare: {
        url: 'https://proxy.ju-labs.workers.dev/?url=',
        base64: 'cHJveHkuanUtbGFicy53b3JrZXJzLmRldg==',
        active: true
    },
    
    // Backup: Lokaler Server (für später)
    local: {
        url: 'http://localhost:3000/proxy?url=',
        active: false
    },
    
    // Tertiär: Notfall-Proxy
    emergency: {
        url: '',
        active: false
    }
};

// Aktuelle Proxy-URL
let PROXY = '';

// Proxy initialisieren
function initProxy() {
    // Entschlüssele Cloudflare Worker URL
    try {
        const decoded = atob(PROXY_CONFIG.cloudflare.base64);
        PROXY = 'https://' + decoded + '/?url=';
        console.log('🔗 Proxy initialisiert:', PROXY);
        return true;
    } catch(e) {
        console.error('❌ Proxy-Fehler:', e);
        PROXY = PROXY_CONFIG.cloudflare.url;
        return false;
    }
}

// Proxy-Status prüfen
async function checkProxyStatus() {
    const testUrl = PROXY + 'https://example.com';
    
    try {
        const response = await fetch(testUrl, { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        });
        return true;
    } catch(e) {
        console.warn('⚠️ Proxy nicht erreichbar:', e.message);
        return false;
    }
}

// Proxy wechseln (falls Cloudflare gesperrt)
function switchProxy(type) {
    switch(type) {
        case 'local':
            PROXY = PROXY_CONFIG.local.url;
            PROXY_CONFIG.local.active = true;
            PROXY_CONFIG.cloudflare.active = false;
            break;
        case 'cloudflare':
            PROXY = PROXY_CONFIG.cloudflare.url;
            PROXY_CONFIG.cloudflare.active = true;
            PROXY_CONFIG.local.active = false;
            break;
        default:
            PROXY = PROXY_CONFIG.cloudflare.url;
    }
    
    console.log('🔄 Proxy gewechselt zu:', PROXY);
    updateProxyIndicator();
}

// Proxy-Anzeige in Taskleiste aktualisieren
function updateProxyIndicator() {
    const dot = document.getElementById('proxyStatus');
    if (!dot) return;
    
    if (PROXY_CONFIG.cloudflare.active) {
        dot.style.background = '#0f0';
        dot.style.boxShadow = '0 0 8px #0f0';
        dot.title = 'Cloudflare Proxy – Online';
    } else if (PROXY_CONFIG.local.active) {
        dot.style.background = '#ff0';
        dot.style.boxShadow = '0 0 8px #ff0';
        dot.title = 'Lokaler Proxy – Online';
    } else {
        dot.style.background = '#f00';
        dot.style.boxShadow = '0 0 8px #f00';
        dot.title = 'Proxy – Offline';
    }
}

// URL für Proxy vorbereiten
function prepareProxyUrl(url) {
    if (!url) return '';
    if (url.startsWith('http')) return PROXY + url;
    return PROXY + 'https://' + url;
}

// Prüfen ob URL Proxy benötigt
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

// ========== PROXY-TEST ==========
async function testProxy() {
    const results = {
        cloudflare: false,
        local: false,
        timestamp: new Date().toISOString()
    };
    
    // Cloudflare testen
    try {
        const cfTest = await fetch(PROXY_CONFIG.cloudflare.url + 'https://example.com');
        results.cloudflare = cfTest.ok;
    } catch(e) {}
    
    // Lokal testen
    try {
        const localTest = await fetch(PROXY_CONFIG.local.url + 'https://example.com');
        results.local = localTest.ok;
    } catch(e) {}
    
    console.log('📊 Proxy-Test:', results);
    return results;
}

// ========== INIT ==========
initProxy();
updateProxyIndicator();

// Periodischer Proxy-Check (alle 5 Minuten)
setInterval(async () => {
    const online = await checkProxyStatus();
    if (!online) {
        console.warn('⚠️ Proxy ausgefallen – versuche lokalen Proxy...');
        switchProxy('local');
    }
    updateProxyIndicator();
}, 300000);

console.log('🔗 Proxy-System bereit');
console.log('   Cloudflare:', PROXY_CONFIG.cloudflare.url);
console.log('   Lokal:', PROXY_CONFIG.local.url);
