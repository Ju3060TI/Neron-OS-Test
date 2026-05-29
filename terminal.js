// ============================================
// MÖRSER-KARL GX LINUX – terminal.js
// Linux Terminal 1:1 Clone mit echten Befehlen
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
                            'Dokumente': { type: 'dir', children: {} },
                            'Downloads': { type: 'dir', children: {} },
                            'Desktop': { type: 'dir', children: {} },
                            'projekte': {
                                type: 'dir',
                                children: {
                                    'moerser-karl': {
                                        type: 'dir',
                                        children: {
                                            'proxy.js': { type: 'file', content: '// Proxy Config', size: '2.4K' },
                                            'README.md': { type: 'file', content: '# Mörser-Karl GX', size: '1.2K' },
                                            '.config': { type: 'file', content: '{}', size: '128B' }
                                        }
                                    }
                                }
                            },
                            '.bashrc': { type: 'file', content: 'export PS1="┌──(\\u@\\h)-[\\w]\\n└─$ "', size: '512B' },
                            '.profile': { type: 'file', content: '# User profile', size: '256B' }
                        }
                    }
                }
            },
            'etc': {
                type: 'dir',
                children: {
                    'hostname': { type: 'file', content: 'mk-gx', size: '6B' },
                    'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/mk-shell', size: '128B' },
                    'os-release': { type: 'file', content: 'NAME="Mörser-Karl GX Linux"\nVERSION="2.0.26 LTS"\nID=mk-gx', size: '256B' }
                }
            },
            'var': { type: 'dir', children: { 'log': { type: 'dir', children: {} } } },
            'tmp': { type: 'dir', children: {} },
            'proc': { type: 'dir', children: {
                'cpuinfo': { type: 'file', content: 'processor: AMD Ryzen 5 3600\ncores: 6\nthreads: 12', size: '1K' },
                'meminfo': { type: 'file', content: 'MemTotal: 32GB\nMemFree: 24GB', size: '512B' }
            }}
        }
    }
};

let currentDir = ['home', 'user', 'projekte', 'moerser-karl'];
let commandHistory = [];
let historyIndex = -1;

function openTerminal() {
    const content = `
        <div class="terminal-content" id="termOutput">
            <div style="color:#0f0;">🐧 Mörser-Karl GX Linux Terminal [Version 2.0.26]</div>
            <div style="color:#888;">Kernel 6.9.0-mk-gx on x86_64</div>
            <div style="color:#888;">────────────────────────────────────────────</div>
            <div style="color:#888;">Last login: ${new Date().toString()}</div>
            <div style="color:#0f0;">Welcome back, user!</div>
            <div></div>
            <div id="termHistory"></div>
            <div class="terminal-input" style="display:flex;align-items:center;">
                <span style="color:#0f0;">┌──(</span><span style="color:#00ff00;">user@mk-gx</span><span style="color:#0f0;">)-[</span><span style="color:#00aaff;">~/${currentDir.join('/')}</span><span style="color:#0f0;">]</span>
                <br>
                <span style="color:#0f0;">└─$ </span>
                <input type="text" id="termInput" autofocus 
                       style="flex:1;background:transparent;border:none;color:#0f0;font-family:'Courier New',monospace;font-size:13px;outline:none;caret-color:#0f0;"
                       onkeydown="handleTermKey(event)">
            </div>
        </div>
    `;
    createWindow('terminal', '💻 Terminal', '💻', content, 750, 500);
    setTimeout(() => document.getElementById('termInput')?.focus(), 200);
}

function handleTermKey(e) {
    const input = document.getElementById('termInput');
    const history = document.getElementById('termHistory');
    if (!input || !history) return;
    
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (!cmd) { showPrompt(); return; }
        
        // Command in History speichern
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        
        // Prompt mit Befehl anzeigen
        const promptHTML = `<span style="color:#0f0;">┌──(</span><span style="color:#00ff00;">user@mk-gx</span><span style="color:#0f0;">)-[</span><span style="color:#00aaff;">~/${currentDir.join('/')}</span><span style="color:#0f0;">]</span>\n<span style="color:#0f0;">└─$</span> ${cmd}`;
        history.innerHTML += `<div>${promptHTML}</div>`;
        
        // Befehl ausführen
        const result = executeLinuxCmd(cmd);
        if (result) history.innerHTML += `<div style="white-space:pre-wrap;">${result}</div>`;
        
        // Scroll to bottom
        const output = document.getElementById('termOutput');
        if (output) output.scrollTop = output.scrollHeight;
        
        input.value = '';
        showPrompt();
        
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        // Auto-Vervollständigung
        const input_val = input.value;
        const parts = input_val.split(' ');
        const last = parts[parts.length - 1];
        
        const cmds = ['ls','cd','pwd','cat','mkdir','rm','touch','echo','clear','neofetch',
                       'htop','cowsay','cmatrix','uname','whoami','hostname','date','cal',
                       'df','du','free','ps','kill','sudo','apt','pacman','nano','vim',
                       'exit','shutdown','reboot','man','help'];
        const matches = cmds.filter(c => c.startsWith(last));
        
        if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            input.value = parts.join(' ');
        } else if (matches.length > 1) {
            const termOutput = document.getElementById('termOutput');
            termOutput.innerHTML += `<div style="color:#888;">${matches.join('  ')}</div>`;
            termOutput.scrollTop = termOutput.scrollHeight;
        }
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('termHistory').innerHTML = '';
        document.getElementById('termOutput').scrollTop = 0;
    }
}

function showPrompt() {
    const output = document.getElementById('termOutput');
    if (output) output.scrollTop = output.scrollHeight;
}

function getCurrentFolder() {
    let folder = linuxFS['/'].children;
    for (const part of currentDir) {
        if (folder[part] && folder[part].children) {
            folder = folder[part].children;
        } else {
            return {};
        }
    }
    return folder;
}

function executeLinuxCmd(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];
    const args = parts.slice(1);
    
    switch(main) {
        case 'ls':
            const folder = getCurrentFolder();
            const entries = Object.entries(folder);
            if (args.includes('-la') || args.includes('-a') || args.includes('-l')) {
                let output = 'total ' + entries.length + '\n';
                entries.forEach(([name, info]) => {
                    const perms = info.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
                    const size = info.size || (info.type === 'dir' ? '4096' : '0');
                    const date = 'Mai 29 08:30';
                    output += `${perms}  1 user user ${size} ${date} ${info.type === 'dir' ? '\x1b[34m' + name + '\x1b[0m/' : name}\n`;
                });
                return output;
            }
            return entries.map(([name, info]) => info.type === 'dir' ? `📁 ${name}/` : `📄 ${name}`).join('\n');
            
        case 'cd':
            if (args.length === 0 || args[0] === '~') {
                currentDir = ['home', 'user'];
            } else if (args[0] === '..') {
                if (currentDir.length > 0) currentDir.pop();
            } else if (args[0] === '/') {
                currentDir = [];
            } else {
                const target = args[0];
                const folder = getCurrentFolder();
                if (folder[target] && folder[target].type === 'dir') {
                    currentDir.push(target);
                } else {
                    return `bash: cd: ${target}: No such file or directory`;
                }
            }
            return '';
            
        case 'pwd':
            return '/' + (currentDir.length ? currentDir.join('/') : '');
            
        case 'cat':
            if (args.length === 0) return '';
            const file = getCurrentFolder()[args[0]];
            if (file && file.type === 'file') {
                return file.content || '(empty)';
            }
            return `cat: ${args[0]}: No such file or directory`;
            
        case 'echo':
            return args.join(' ');
            
        case 'clear':
            document.getElementById('termHistory').innerHTML = '';
            return '';
            
        case 'neofetch':
            return `
    \x1b[31m███╗   ███╗██╗  ██╗\x1b[0m      \x1b[32muser\x1b[0m@\x1b[32mmk-gx\x1b[0m
    \x1b[31m████╗ ████║██║ ██╔╝\x1b[0m      ─────────────
    \x1b[31m██╔████╔██║█████╔╝\x1b[0m       \x1b[33mOS:\x1b[0m Mörser-Karl GX Linux
    \x1b[31m██║╚██╔╝██║██╔═██╗\x1b[0m       \x1b[33mKernel:\x1b[0m 6.9.0-mk-gx
    \x1b[31m██║ ╚═╝ ██║██║  ██╗\x1b[0m      \x1b[33mShell:\x1b[0m mk-shell 2.0.26
    \x1b[31m╚═╝     ╚═╝╚═╝  ╚═╝\x1b[0m      \x1b[33mCPU:\x1b[0m AMD Ryzen 5 3600
                              \x1b[33mRAM:\x1b[0m 32GB DDR4
                              \x1b[33mProxy:\x1b[0m ${typeof PROXY !== 'undefined' ? 'Online' : 'Offline'}
                              \x1b[33mTheme:\x1b[0m Opera GX × Linux Neon
            `;
            
        case 'cowsay':
            const msg = args.join(' ') || 'Mörser-Karl GX!';
            return `  _________________________
< ${msg} >
  =========================
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
                
        case 'cmatrix':
            return '🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢\n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢\n(Simuliert – Original braucht ncurses)';
            
        case 'htop':
            return `  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0   168.0m  12.0m   8.0m S   0.0   0.5   0:00.50 systemd
  420 user      20   0  1024.0m 256.0m 128.0m S   2.3   4.2   0:15.30 mk-desktop
  666 proxy     20   0   512.0m  64.0m  32.0m S   1.1   1.8   0:05.10 proxy-daemon
 1337 user      20   0   256.0m  32.0m  16.0m S   0.5   0.3   0:02.40 terminal`;
            
        case 'uname':
            return args.includes('-a') ? 'Linux mk-gx 6.9.0-mk-gx #1 SMP PREEMPT Sun May 26 02:15:00 UTC 2026 x86_64 GNU/Linux' : 'Linux';
            
        case 'whoami': return 'user';
        case 'hostname': return 'mk-gx';
        case 'date': return new Date().toString();
        
        case 'cal':
            return `     Mai 2026
So Mo Di Mi Do Fr Sa
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31`;
            
        case 'free':
            return '              total        used        free      shared  buff/cache   available\nMem:          32GB        8GB        20GB        512MB         4GB        24GB\nSwap:          8GB          0B         8GB';
            
        case 'df':
            return 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        64G   12G   52G  19% /\n/dev/sdb1       500G  200G  300G  40% /home';
            
        case 'ps':
            return '  PID TTY          TIME CMD\n 1337 pts/0    00:00:02 terminal\n  420 ?        00:00:15 mk-desktop';
            
        case 'sudo':
            if (args[0] === 'su') return 'root@mk-gx:~# (Zugriff verweigert – kein Root-Passwort)';
            if (args[0] === 'apt') return 'apt: Befehl nicht gefunden (nutze mkpkg)';
            return 'sudo: ' + args.join(' ') + ': command not found';
            
        case 'apt':
        case 'pacman':
            return `${main}: Paketmanager nicht verfügbar. Nutze 'mkpkg' für Mörser-Karl GX.`;
            
        case 'mkpkg':
            if (args[0] === 'install') return `📦 Installiere ${args[1] || 'Paket'}...\n✅ Fertig!`;
            if (args[0] === 'update') return '🔄 Paketliste aktualisiert.';
            return 'mkpkg: Nutzung: mkpkg [install|update|remove] [paket]';
            
        case 'nano':
        case 'vim':
            return `${main}: Editor nicht im Terminal-Modus verfügbar. Nutze die Notizen-App (GUI).`;
            
        case 'man':
            return `MÖRSER-KARL GX LINUX – Manual\n\nBEFEHLE:\n  ls, cd, pwd, cat, echo, clear\n  neofetch, cowsay, htop, cmatrix\n  uname, whoami, hostname, date, cal\n  free, df, ps, sudo, mkpkg\n  exit, shutdown, reboot, help`;
            
        case 'help':
            return `\x1b[33m🐧 MÖRSER-KARL GX LINUX – Befehle\x1b[0m\n\n📁 Dateisystem: ls, cd, pwd, cat, mkdir, rm, touch\n🖥️ System: neofetch, htop, uname, whoami, hostname\n📊 Info: free, df, ps, date, cal\n🎮 Spaß: cowsay, cmatrix\n📦 Pakete: mkpkg\n⚡ Admin: sudo, shutdown, reboot\n\nTasten:\n  Tab = Auto-Vervollständigung\n  Pfeil hoch/runter = Befehlshistorie\n  Strg+L = Bildschirm löschen`;
            
        case 'exit':
            closeWindow('terminal');
            return '';
            
        case 'shutdown':
            document.body.style.opacity = '0';
            setTimeout(() => document.body.innerHTML = '<div style="color:#0f0;text-align:center;padding:50px;font-size:24px;background:#000;height:100vh;">🐧 System halted.<br><span style="color:#888;font-size:14px;">Mörser-Karl GX Linux – Goodbye!</span></div>', 500);
            return 'System wird heruntergefahren...';
            
        case 'reboot':
            location.reload();
            return '';
            
        default:
            return `bash: ${main}: command not found. Type 'help' for available commands.`;
    }
}

console.log('💻 Linux Terminal 1:1 bereit – Herr Franz wird staunen! 🐧');
