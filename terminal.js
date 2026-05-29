// ============================================
// MÖRSER-KARL GX DESKTOP – terminal.js
// Terminal-App mit Befehlen
// ============================================

function openTerminal() {
    const content = `
        <div class="terminal-content" id="terminalOutput">
            <div class="terminal-line" style="color:var(--accent);">
                💣 MÖRSER-KARL GX TERMINAL v2.0.26
            </div>
            <div class="terminal-line" style="color:#888;">
                Type 'help' for available commands.
            </div>
            <div class="terminal-line"></div>
            <div id="terminalHistory"></div>
            <div class="terminal-input">
                <span class="terminal-prompt">mk@gx:~$</span>
                <input type="text" id="terminalInput" autofocus 
                       onkeypress="if(event.key==='Enter')executeCommand()"
                       style="flex:1;background:transparent;border:none;color:#0f0;font-family:'Courier New',monospace;font-size:13px;outline:none;">
            </div>
        </div>
    `;
    
    createWindow('terminal', '💻 Terminal', '💻', content, 650, 400);
    
    // Fokus auf Input
    setTimeout(() => {
        const input = document.getElementById('terminalInput');
        if (input) input.focus();
    }, 200);
}

// Befehle ausführen
function executeCommand() {
    const input = document.getElementById('terminalInput');
    const history = document.getElementById('terminalHistory');
    if (!input || !history) return;
    
    const command = input.value.trim();
    if (!command) return;
    
    // Befehl in History anzeigen
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span style="color:var(--accent);">mk@gx:~$</span> ${command}`;
    history.appendChild(cmdLine);
    
    // Befehl verarbeiten
    const output = processCommand(command);
    
    // Ausgabe
    const outLine = document.createElement('div');
    outLine.className = 'terminal-line';
    outLine.innerHTML = output;
    history.appendChild(outLine);
    
    // Scroll to bottom
    const terminal = document.getElementById('terminalOutput');
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
    
    // Input leeren
    input.value = '';
}

function processCommand(cmd) {
    const parts = cmd.toLowerCase().split(' ');
    const main = parts[0];
    const args = parts.slice(1);
    
    switch(main) {
        case 'help':
            return `
                <span style="color:#ff0;">━━━━━━━━━━━━━━━━━━━━━━━━━━</span><br>
                <span style="color:var(--accent);">Available Commands:</span><br>
                <span style="color:#0ff;">help</span> – Show this help<br>
                <span style="color:#0ff;">clear</span> – Clear terminal<br>
                <span style="color:#0ff;">time</span> – Show current time<br>
                <span style="color:#0ff;">date</span> – Show current date<br>
                <span style="color:#0ff;">whoami</span> – Show user<br>
                <span style="color:#0ff;">proxy</span> – Show proxy status<br>
                <span style="color:#0ff;">proxy test</span> – Test proxy<br>
                <span style="color:#0ff;">proxy switch [local/cloud]</span> – Switch proxy<br>
                <span style="color:#0ff;">neofetch</span> – System info<br>
                <span style="color:#0ff;">ls</span> – List desktop icons<br>
                <span style="color:#0ff;">open [app]</span> – Open application<br>
                <span style="color:#0ff;">browser</span> – Open browser<br>
                <span style="color:#0ff;">youtube</span> – Open YouTube<br>
                <span style="color:#0ff;">games</span> – Open Games<br>
                <span style="color:#0ff;">ki</span> – Open KI-Chat<br>
                <span style="color:#0ff;">settings</span> – Open settings<br>
                <span style="color:#0ff;">exit</span> – Close terminal<br>
                <span style="color:#0ff;">shutdown</span> – Shutdown system<br>
                <span style="color:#ff0;">━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
            `;
            
        case 'clear':
            document.getElementById('terminalHistory').innerHTML = '';
            return '';
            
        case 'time':
            return new Date().toLocaleTimeString('de-DE');
            
        case 'date':
            return new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
        case 'whoami':
            return 'Mörser-Karl GX User';
            
        case 'proxy':
            if (args[0] === 'test') {
                testProxy().then(r => {
                    const hist = document.getElementById('terminalHistory');
                    const line = document.createElement('div');
                    line.className = 'terminal-line';
                    line.innerHTML = `Cloudflare: ${r.cloudflare ? '✅ Online' : '❌ Offline'}<br>Lokal: ${r.local ? '✅ Online' : '❌ Offline'}`;
                    hist.appendChild(line);
                });
                return '<span style="color:#888;">Testing...</span>';
            } else if (args[0] === 'switch') {
                if (args[1] === 'local') {
                    switchProxy('local');
                    return '✅ Switched to local proxy';
                } else {
                    switchProxy('cloudflare');
                    return '✅ Switched to Cloudflare proxy';
                }
            }
            return `Proxy: ${PROXY}`;
            
        case 'neofetch':
            return `
                <span style="color:var(--accent);">      💣</span><br>
                <span style="color:var(--accent);">   💣💣💣</span>   MÖRSER-KARL GX DESKTOP<br>
                <span style="color:var(--accent);"> 💣💣💣💣💣</span>  Version 2.0.26<br>
                <span style="color:var(--accent);">💣💣💣💣💣💣💣</span> ---------------------<br>
                <span style="color:#888;">OS:</span> Mörser-Karl GX Desktop<br>
                <span style="color:#888;">Proxy:</span> ${PROXY_CONFIG.cloudflare.active ? 'Cloudflare' : 'Local'}<br>
                <span style="color:#888;">User:</span> Mörser-Karl GX<br>
            `;
            
        case 'ls':
            return desktopIcons.map(i => `${i.icon} ${i.label}`).join('<br>');
            
        case 'open':
            if (args[0]) {
                openApplication(args[0]);
                return `Opening ${args[0]}...`;
            }
            return 'Usage: open [app]';
            
        case 'browser':
            openMoerserKarlBrowser();
            return 'Opening Mörser-Karl Browser...';
            
        case 'youtube':
            openYouTube();
            return 'Opening YouTube...';
            
        case 'games':
            openGames();
            return 'Opening Games...';
            
        case 'ki':
            openKI();
            return 'Opening KI-Chat...';
            
        case 'settings':
            openSettings();
            return 'Opening Settings...';
            
        case 'exit':
            closeWindow('terminal');
            return '';
            
        case 'shutdown':
            if (confirm('System herunterfahren?')) {
                document.body.style.opacity = '0';
            }
            return 'Shutting down...';
            
        default:
            return `<span style="color:#f00;">Command not found: ${cmd}</span> – Type <span style="color:#0ff;">help</span> for commands`;
    }
}

// Terminal-Ausgabe scrollt automatisch
document.addEventListener('click', (e) => {
    if (e.target.id === 'terminalInput') {
        const terminal = document.getElementById('terminalOutput');
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
    }
});

console.log('💻 Terminal-App bereit');
