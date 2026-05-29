// ============================================
// MÖRSER-KARL GX LINUX – files.js
// Linux-Dateimanager mit echtem Dateisystem
// ============================================

const linuxFS = {
    '/': {
        type: 'dir',
        children: {
            'home': {
                type: 'dir',
                children: {
                    'user': {
                        type: 'dir',
                        children: {
                            'Dokumente': { type: 'dir', children: {
                                'schulprojekt.txt': { type: 'file', content: 'Mörser-Karl GX – Schulprojekt 2026\nBetreuer: Herr Franz\nStatus: Genehmigt ✅', size: '256B' },
                                'notizen.md': { type: 'file', content: '# Notizen\n- Chromebook Freischaltung Montag\n- USB-Stick als Serverplatte\n- Puppeteer für YouTube', size: '128B' }
                            }},
                            'Downloads': { type: 'dir', children: {
                                'desert-order.exe': { type: 'file', content: '🏜️ Desert Order Launcher', size: '2.4M' },
                                'cookie-clicker.app': { type: 'file', content: '🍪 Cookie Clicker', size: '1.1M' }
                            }},
                            'Desktop': { type: 'dir', children: {} },
                            'Bilder': { type: 'dir', children: {
                                'screenshot.png': { type: 'file', content: '📸 Screenshot', size: '512K' },
                                'logo.png': { type: 'file', content: '💣 Mörser-Karl Logo', size: '256K' }
                            }},
                            'Musik': { type: 'dir', children: {
                                'synthwave.mp3': { type: 'file', content: '🎵 Synthwave Track', size: '4.2M' },
                                'lofi.mp3': { type: 'file', content: '🎵 LoFi Beats', size: '3.8M' }
                            }},
                            'projekte': {
                                type: 'dir',
                                children: {
                                    'moerser-karl': {
                                        type: 'dir',
                                        children: {
                                            'index.html': { type: 'file', content: '<!DOCTYPE html>...', size: '8.4K' },
                                            'style.css': { type: 'file', content: ':root { ... }', size: '12.2K' },
                                            'proxy.js': { type: 'file', content: '// Proxy Config', size: '2.4K' },
                                            'terminal.js': { type: 'file', content: '// Linux Terminal', size: '15.6K' },
                                            'README.md': { type: 'file', content: '# Mörser-Karl GX Linux Edition', size: '1.2K' },
                                            '.config': { type: 'file', content: '{"theme":"opera-gx","proxy":"cloudflare"}', size: '128B' }
                                        }
                                    }
                                }
                            },
                            '.bashrc': { type: 'file', content: 'export PS1="┌──(\\u@\\h)-[\\w]\\n└─$ "', size: '512B' }
                        }
                    }
                }
            },
            'etc': {
                type: 'dir',
                children: {
                    'hostname': { type: 'file', content: 'mk-gx', size: '6B' },
                    'os-release': { type: 'file', content: 'NAME="Mörser-Karl GX Linux"\nVERSION="2.0.26 LTS"', size: '128B' }
                }
            },
            'var': { type: 'dir', children: { 'log': { type: 'dir', children: {} } } },
            'tmp': { type: 'dir', children: {} }
        }
    }
};

let filePath = ['home', 'user'];
let fileHistory = [];

function openFiles() {
    const content = `
        <div style="display:flex;flex-direction:column;height:100%;background:var(--surface);">
            <!-- Toolbar -->
            <div style="display:flex;padding:8px 12px;gap:8px;align-items:center;background:var(--surface-light);border-bottom:1px solid var(--border-dim);">
                <button onclick="fileGoBack()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Zurück">⬅️</button>
                <button onclick="fileGoUp()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Nach oben">⬆️</button>
                <button onclick="fileRefresh()" style="background:transparent;border:1px solid var(--border-dim);color:var(--text);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;" title="Aktualisieren">🔄</button>
                <div id="filePathDisplay" style="flex:1;padding:4px 10px;background:#1a1a1a;border:1px solid var(--border-dim);border-radius:4px;color:var(--text);font-size:11px;font-family:monospace;">
                    🐧 /home/user
                </div>
            </div>
            
            <!-- Adressleiste (Linux-Style) -->
            <div style="display:flex;padding:4px 12px;background:var(--surface);border-bottom:1px solid var(--border-dim);align-items:center;gap:8px;">
                <span style="color:var(--green);font-family:monospace;font-size:11px;">user@mk-gx:</span>
                <input type="text" id="filePathInput" value="/home/user" 
                       style="flex:1;padding:4px 8px;background:#1a1a1a;border:1px solid var(--border-dim);border-radius:4px;color:var(--text);font-size:11px;font-family:monospace;"
                       onkeypress="if(event.key==='Enter')fileNavigatePath(this.value)">
            </div>
            
            <!-- Dateiliste -->
            <div id="fileList" style="flex:1;overflow-y:auto;padding:8px;background:var(--surface);">
                <!-- Per JS gefüllt -->
            </div>
            
            <!-- Statusleiste (Linux-Style) -->
            <div style="display:flex;padding:4px 12px;background:var(--surface-light);border-top:1px solid var(--border-dim);font-size:10px;color:var(--text-dim);gap:20px;">
                <span id="fileCount">0 Elemente</span>
                <span>🐧 mk-gx</span>
                <span style="margin-left:auto;">Speicher: 52G frei</span>
            </div>
        </div>
    `;
    
    createWindow('files', '📁 Dateimanager', '📁', content, 700, 500);
    setTimeout(() => refreshFileList(), 100);
}

function getFolderByPath(pathArray) {
    let folder = linuxFS['/'].children;
    for (const part of pathArray) {
        if (folder[part] && folder[part].children) {
            folder = folder[part].children;
        } else {
            return null;
        }
    }
    return folder;
}

function refreshFileList() {
    const fileList = document.getElementById('fileList');
    const filePathDisplay = document.getElementById('filePathDisplay');
    const filePathInput = document.getElementById('filePathInput');
    const fileCount = document.getElementById('fileCount');
    if (!fileList) return;
    
    const folder = getFolderByPath(filePath);
    if (!folder) {
        fileList.innerHTML = '<div style="color:var(--text-dim);padding:20px;text-align:center;">📂 Ordner nicht gefunden</div>';
        return;
    }
    
    fileList.innerHTML = '';
    
    const entries = Object.entries(folder);
    const folders = entries.filter(([_, v]) => v.type === 'dir');
    const files = entries.filter(([_, v]) => v.type === 'file');
    
    // ".." für übergeordneten Ordner
    if (filePath.length > 0) {
        const backItem = document.createElement('div');
        backItem.className = 'file-item';
        backItem.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;font-size:13px;color:var(--text);border-radius:4px;';
        backItem.innerHTML = '<span style="font-size:20px;">📂</span> <span style="color:var(--accent);">..</span>';
        backItem.addEventListener('dblclick', () => fileGoUp());
        backItem.addEventListener('mouseover', function() { this.style.background = 'var(--surface-light)'; });
        backItem.addEventListener('mouseout', function() { this.style.background = ''; });
        fileList.appendChild(backItem);
    }
    
    // Ordner
    folders.forEach(([name, info]) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;font-size:13px;color:var(--text);border-radius:4px;';
        item.innerHTML = `<span style="font-size:20px;">📁</span> <span style="color:#00aaff;">${name}</span>`;
        item.addEventListener('dblclick', () => fileNavigateDown(name));
        item.addEventListener('mouseover', function() { this.style.background = 'var(--surface-light)'; });
        item.addEventListener('mouseout', function() { this.style.background = ''; });
        fileList.appendChild(item);
    });
    
    // Dateien
    files.forEach(([name, info]) => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;font-size:13px;color:var(--text);border-radius:4px;';
        const ext = name.split('.').pop();
        const icon = getFileIcon(ext);
        item.innerHTML = `<span style="font-size:20px;">${icon}</span> ${name} <span style="color:var(--text-dim);font-size:10px;margin-left:auto;">${info.size || ''}</span>`;
        item.addEventListener('dblclick', () => fileOpen(name, info));
        item.addEventListener('mouseover', function() { this.style.background = 'var(--surface-light)'; });
        item.addEventListener('mouseout', function() { this.style.background = ''; });
        fileList.appendChild(item);
    });
    
    // Pfad aktualisieren
    const pathStr = '/' + filePath.join('/');
    if (filePathDisplay) filePathDisplay.textContent = '🐧 ' + pathStr;
    if (filePathInput) filePathInput.value = pathStr;
    if (fileCount) fileCount.textContent = entries.length + ' Elemente';
}

function getFileIcon(ext) {
    const icons = {
        'txt': '📄', 'md': '📝', 'js': '💛', 'css': '🎨', 'html': '🌐',
        'json': '⚙️', 'exe': '⚡', 'app': '📱', 'png': '🖼️', 'jpg': '🖼️',
        'mp3': '🎵', 'pdf': '📕', 'zip': '📦', 'config': '🔧'
    };
    return icons[ext] || '📄';
}

function fileNavigateDown(folderName) {
    fileHistory.push([...filePath]);
    filePath.push(folderName);
    refreshFileList();
}

function fileGoUp() {
    if (filePath.length > 0) {
        fileHistory.push([...filePath]);
        filePath.pop();
        refreshFileList();
    }
}

function fileGoBack() {
    if (fileHistory.length > 0) {
        filePath = fileHistory.pop();
        refreshFileList();
    }
}

function fileNavigatePath(pathStr) {
    const parts = pathStr.split('/').filter(p => p);
    const folder = getFolderByPath(parts);
    if (folder) {
        fileHistory.push([...filePath]);
        filePath = parts;
        refreshFileList();
    } else {
        alert('Pfad nicht gefunden: ' + pathStr);
    }
}

function fileRefresh() {
    refreshFileList();
}

function fileOpen(name, info) {
    if (info.type === 'dir') {
        fileNavigateDown(name);
    } else {
        // Datei-Inhalt anzeigen
        const ext = name.split('.').pop();
        let displayContent = info.content || '(leer)';
        
        // Syntax-Highlighting simulieren
        if (ext === 'js') {
            displayContent = `<span style="color:#f0f;">const</span> <span style="color:#0ff;">PROXY</span> = <span style="color:#0f0;">'${PROXY}'</span>;\n<span style="color:#888;">// ${info.content}</span>`;
        } else if (ext === 'html') {
            displayContent = `<span style="color:#f0f;">&lt;!DOCTYPE html&gt;</span>\n<span style="color:#888;">&lt;!-- ${info.content} --&gt;</span>`;
        } else if (ext === 'css') {
            displayContent = `<span style="color:#f0f;">:root</span> {\n  <span style="color:#0ff;">--accent</span>: <span style="color:#0f0;">#ff4500</span>;\n}\n<span style="color:#888;">/* ${info.content} */</span>`;
        } else if (ext === 'json' || ext === 'config') {
            displayContent = `<span style="color:#f0f;">{</span>\n  <span style="color:#0ff;">"theme"</span>: <span style="color:#0f0;">"opera-gx"</span>\n<span style="color:#f0f;">}</span>`;
        }
        
        const content = `
            <div style="padding:20px;color:var(--text);font-family:monospace;white-space:pre-wrap;background:#1a1a1a;height:100%;overflow-y:auto;">
                <h3 style="color:var(--accent);margin-bottom:15px;font-family:var(--font);">📄 ${name}</h3>
                <div style="background:#0a0a0a;padding:15px;border-radius:8px;border:1px solid var(--border-dim);line-height:1.6;">
                    ${displayContent}
                </div>
                <p style="color:var(--text-dim);margin-top:15px;font-size:10px;">Größe: ${info.size || 'Unbekannt'} | Typ: ${ext.toUpperCase()}-Datei</p>
            </div>
        `;
        createWindow('file-view-' + name, '📄 ' + name, '📄', content, 500, 400);
    }
}

console.log('📁 Linux-Dateimanager bereit');
