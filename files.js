// ============================================
// MÖRSER-KARL GX DESKTOP – files.js
// Dateimanager (simuliert)
// ============================================

// Simuliertes Dateisystem
const fileSystem = {
    'home': {
        type: 'folder',
        children: {
            'Dokumente': {
                type: 'folder',
                children: {
                    'readme.txt': { type: 'file', content: 'Willkommen bei Mörser-Karl GX Desktop!\n\nDies ist ein simuliertes Dateisystem.\nViel Spaß beim Erkunden! 💣', size: '128 B' },
                    'proxy-config.txt': { type: 'file', content: 'Proxy URL: ' + PROXY, size: '64 B' },
                    'notizen.txt': { type: 'file', content: 'Herr Franz ist der beste Admin!\nChromebook Freischaltung am Montag.', size: '96 B' }
                }
            },
            'Downloads': {
                type: 'folder',
                children: {
                    'desert-order.exe': { type: 'file', content: '🏜️ Desert Order Launcher', size: '2.4 MB' },
                    'cookie-clicker.app': { type: 'file', content: '🍪 Cookie Clicker', size: '1.1 MB' }
                }
            },
            'Desktop': {
                type: 'folder',
                children: {}
            },
            'Bilder': {
                type: 'folder',
                children: {
                    'screenshot.png': { type: 'file', content: '📸 Screenshot', size: '512 KB' },
                    'logo.png': { type: 'file', content: '💣 Mörser-Karl Logo', size: '256 KB' }
                }
            },
            'Musik': {
                type: 'folder',
                children: {
                    'never-gonna-give-you-up.mp3': { type: 'file', content: '🎵 Rick Astley', size: '3.8 MB' }
                }
            }
        }
    }
};

let currentPath = ['home'];
let fileHistory = [];

function openFiles() {
    const content = `
        <div style="display:flex;flex-direction:column;height:100%;background:var(--surface);">
            <!-- Toolbar -->
            <div style="display:flex;padding:8px 12px;gap:8px;align-items:center;background:var(--surface-light);border-bottom:1px solid var(--border-dim);">
                <button onclick="fileGoBack()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Zurück">⬅️</button>
                <button onclick="fileGoForward()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Vorwärts">➡️</button>
                <button onclick="fileGoUp()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Nach oben">⬆️</button>
                <div id="filePath" style="flex:1;padding:4px 10px;background:#1a1a1a;border:1px solid var(--border-dim);border-radius:4px;color:var(--text);font-size:11px;font-family:monospace;">
                    /home
                </div>
            </div>
            
            <!-- Dateiliste -->
            <div id="fileList" style="flex:1;overflow-y:auto;padding:8px;">
                <!-- Per JS gefüllt -->
            </div>
            
            <!-- Statusleiste -->
            <div style="padding:4px 12px;background:var(--surface-light);border-top:1px solid var(--border-dim);font-size:10px;color:var(--text-dim);">
                <span id="fileCount">0 Elemente</span>
            </div>
        </div>
    `;
    
    createWindow('files', '📁 Dateimanager', '📁', content, 650, 450);
    
    // Dateien anzeigen
    setTimeout(() => refreshFileList(), 100);
}

function getCurrentFolder() {
    let folder = fileSystem;
    for (const part of currentPath) {
        if (folder[part] && folder[part].children) {
            folder = folder[part].children;
        } else {
            return {};
        }
    }
    return folder;
}

function refreshFileList() {
    const fileList = document.getElementById('fileList');
    const filePath = document.getElementById('filePath');
    const fileCount = document.getElementById('fileCount');
    if (!fileList) return;
    
    const folder = getCurrentFolder();
    fileList.innerHTML = '';
    
    const entries = Object.entries(folder);
    
    // Ordner zuerst, dann Dateien
    const folders = entries.filter(([_, v]) => v.type === 'folder');
    const files = entries.filter(([_, v]) => v.type === 'file');
    
    // ".." für übergeordneten Ordner
    if (currentPath.length > 1) {
        const backItem = document.createElement('div');
        backItem.className = 'file-item';
        backItem.innerHTML = '<span class="file-icon">📂</span> <span style="color:var(--accent);">..</span>';
        backItem.addEventListener('dblclick', () => fileGoUp());
        fileList.appendChild(backItem);
    }
    
    // Ordner
    folders.forEach(([name, info]) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `<span class="file-icon">📁</span> ${name}`;
        item.addEventListener('dblclick', () => fileNavigate(name));
        fileList.appendChild(item);
    });
    
    // Dateien
    files.forEach(([name, info]) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        const ext = name.split('.').pop();
        const icon = getFileIcon(ext);
        item.innerHTML = `<span class="file-icon">${icon}</span> ${name} <span style="color:var(--text-dim);font-size:10px;margin-left:auto;">${info.size || ''}</span>`;
        item.addEventListener('dblclick', () => fileOpen(name, info));
        fileList.appendChild(item);
    });
    
    // Pfad aktualisieren
    if (filePath) filePath.textContent = '/' + currentPath.join('/');
    if (fileCount) fileCount.textContent = entries.length + ' Elemente';
}

function getFileIcon(ext) {
    const icons = {
        'txt': '📄',
        'exe': '⚙️',
        'app': '📱',
        'png': '🖼️',
        'jpg': '🖼️',
        'mp3': '🎵',
        'pdf': '📕',
        'zip': '📦',
    };
    return icons[ext] || '📄';
}

function fileNavigate(folderName) {
    fileHistory.push([...currentPath]);
    currentPath.push(folderName);
    refreshFileList();
}

function fileGoBack() {
    if (fileHistory.length > 0) {
        currentPath = fileHistory.pop();
        refreshFileList();
    }
}

function fileGoForward() {
    // Simpel: kein Forward (könnte man erweitern)
}

function fileGoUp() {
    if (currentPath.length > 1) {
        fileHistory.push([...currentPath]);
        currentPath.pop();
        refreshFileList();
    }
}

function fileOpen(name, info) {
    if (info.type === 'folder') {
        fileNavigate(name);
    } else {
        // Datei-Inhalt anzeigen
        const content = `
            <div style="padding:20px;color:var(--text);font-family:monospace;white-space:pre-wrap;">
                <h3 style="color:var(--accent);margin-bottom:15px;">📄 ${name}</h3>
                <p>${info.content || 'Keine Vorschau verfügbar.'}</p>
                <p style="color:var(--text-dim);margin-top:20px;font-size:10px;">Größe: ${info.size || 'Unbekannt'}</p>
            </div>
        `;
        createWindow('file-viewer-' + name, '📄 ' + name, '📄', content, 400, 300);
    }
}

console.log('📁 Dateimanager bereit');
