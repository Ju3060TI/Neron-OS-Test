// ============================================
// MÖRSER-KARL GX LINUX – apps.js
// Opera GX × Linux Apps
// ============================================

// Desktop-Icons
const desktopIcons = [
    { id: 'browser', icon: '🌐', label: 'Browser', app: 'browser' },
    { id: 'terminal', icon: '💻', label: 'Terminal', app: 'terminal' },
    { id: 'files', icon: '📁', label: 'Dateien', app: 'files' },
    { id: 'settings', icon: '⚙️', label: 'Settings', app: 'settings' },
    { id: 'youtube', icon: '▶️', label: 'YouTube', app: 'youtube' },
    { id: 'games', icon: '🎮', label: 'Games', app: 'games' },
    { id: 'ki', icon: '🧠', label: 'KI-Chat', app: 'ki' },
    { id: 'spotify', icon: '🎵', label: 'Spotify', app: 'spotify' },
    { id: 'netflix', icon: '🎬', label: 'Netflix', app: 'netflix' },
    { id: 'twitch', icon: '📺', label: 'Twitch', app: 'twitch' },
    { id: 'discord', icon: '💬', label: 'Discord', app: 'discord' },
    { id: 'github', icon: '🐙', label: 'GitHub', app: 'github' },
    { id: 'calculator', icon: '🔢', label: 'Rechner', app: 'calculator' },
    { id: 'notepad', icon: '📝', label: 'Notizen', app: 'notepad' },
    { id: 'paint', icon: '🎨', label: 'Paint', app: 'paint' },
    { id: 'snake', icon: '🐍', label: 'Snake', app: 'snake' },
    { id: 'tictactoe', icon: '⭕', label: 'TicTacToe', app: 'tictactoe' },
    { id: 'weather', icon: '🌤️', label: 'Wetter', app: 'weather' },
    { id: 'piano', icon: '🎹', label: 'Piano', app: 'piano' },
    { id: 'chat', icon: '💭', label: 'Chat', app: 'chat' },
];

function openApplication(appId) {
    switch(appId) {
        case 'browser': openMKbrowser(); break;
        case 'terminal': openTerminal(); break;
        case 'files': openFiles(); break;
        case 'settings': openSettings(); break;
        case 'youtube': openWebApp('YouTube', '▶️', PROXY + 'https://www.youtube.com/'); break;
        case 'games': openGames(); break;
        case 'ki': openKI(); break;
        case 'spotify': openWebApp('Spotify', '🎵', 'https://open.spotify.com/'); break;
        case 'netflix': openWebApp('Netflix', '🎬', PROXY + 'https://www.netflix.com/'); break;
        case 'twitch': openWebApp('Twitch', '📺', PROXY + 'https://www.twitch.tv/'); break;
        case 'discord': openWebApp('Discord', '💬', PROXY + 'https://discord.com/app/'); break;
        case 'github': openWebApp('GitHub', '🐙', 'https://github.com/'); break;
        case 'calculator': openCalculator(); break;
        case 'notepad': openNotepad(); break;
        case 'paint': openPaint(); break;
        case 'snake': openSnake(); break;
        case 'tictactoe': openTicTacToe(); break;
        case 'weather': openWeather(); break;
        case 'piano': openPiano(); break;
        case 'chat': openChat(); break;
        default: openMKbrowser();
    }
}

// ========== MÖRSER-KARL BROWSER (Opera GX Style) ==========
function openMKbrowser() {
    const content = `
        <div style="display:flex;flex-direction:column;height:100%;background:#0a0a0a;">
            <!-- Speed Dial -->
            <div style="display:flex;padding:10px;gap:10px;background:#0d0d0d;border-bottom:1px solid var(--border);overflow-x:auto;">
                ${[
                    {icon:'▶️',label:'YouTube',url:'https://www.youtube.com/'},
                    {icon:'📺',label:'Twitch',url:'https://www.twitch.tv/'},
                    {icon:'💬',label:'Discord',url:'https://discord.com/app/'},
                    {icon:'🎮',label:'Games',url:'#'},
                    {icon:'🧠',label:'KI',url:'#'},
                    {icon:'🐙',label:'GitHub',url:'https://github.com/'},
                ].map(s => `
                    <div onclick="mkNavigateUrl('${s.url}')" style="min-width:80px;padding:10px;background:var(--surface-light);border-radius:8px;text-align:center;cursor:pointer;border:1px solid transparent;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 10px var(--glow)'" onmouseout="this.style.borderColor='transparent';this.style.boxShadow='none'">
                        <div style="font-size:24px;">${s.icon}</div>
                        <div style="font-size:10px;color:var(--text);margin-top:4px;">${s.label}</div>
                    </div>
                `).join('')}
            </div>
            <!-- URL Bar -->
            <div style="display:flex;padding:8px 12px;gap:8px;align-items:center;background:#0d0d0d;border-bottom:1px solid var(--border-dim);">
                <span style="color:var(--accent);font-weight:900;letter-spacing:2px;white-space:nowrap;">💣 MK-GX</span>
                <input type="text" id="mkUrlInput" placeholder="🔍 URL oder Suche..." style="flex:1;padding:8px 15px;background:#1a1a1a;border:1px solid #333;border-radius:25px;color:#ccc;font-size:13px;outline:none;" onkeypress="if(event.key==='Enter')mkNavigate()">
                <button onclick="mkNavigate()" style="padding:8px 20px;background:transparent;border:1px solid var(--accent);border-radius:25px;color:var(--accent);font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">🎯 FEUER!</button>
            </div>
            <!-- Tabs -->
            <div id="mkTabs" style="display:flex;background:#0a0a0a;border-bottom:1px solid #222;padding:0 8px;gap:2px;overflow-x:auto;min-height:34px;"></div>
            <!-- Frames -->
            <div id="mkFrames" style="flex:1;position:relative;background:#000;">
                <div id="mkStartPage" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;background:radial-gradient(ellipse at center,#3a1500 0%,#1a0500 40%,#0a0a0a 70%);z-index:5;pointer-events:none;">
                    <div style="font-size:60px;font-weight:900;letter-spacing:5px;background:linear-gradient(135deg,#ff4500,#0f0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">MÖRSER-KARL</div>
                    <div style="font-size:14px;color:#555;letter-spacing:3px;">GX LINUX EDITION</div>
                </div>
            </div>
            <!-- Status -->
            <div style="display:flex;padding:4px 15px;background:#0d0d0d;border-top:1px solid #222;font-size:10px;color:#555;gap:20px;">
                <span>🔒 Proxy aktiv</span>
                <span id="mkTabCount">0 Tabs</span>
            </div>
        </div>
    `;
    createWindow('browser', '🌐 Mörser-Karl GX', '🌐', content, 1000, 600);
    setTimeout(initMKbrowser, 100);
}

let mkTabs=[], mkActive=null, mkCount=0;
function initMKbrowser() {
    window.mkNavigate = function() {
        const input = document.getElementById('mkUrlInput'); if(!input) return;
        let url = input.value.trim(); if(!url) return;
        if(!url.startsWith('http')) { if(url.includes('.')&&!url.includes(' ')) url='https://'+url; else url='https://google.com/search?q='+encodeURIComponent(url); }
        if(needsProxy(url)) url = PROXY + url;
        mkAddTab(url, url.replace(/https?:\/\//,'').substring(0,25));
        input.value = url;
    };
    window.mkNavigateUrl = function(url) { document.getElementById('mkUrlInput').value=url; mkNavigate(); };
    window.mkAddTab = function(url, title) {
        mkCount++; const tid='mktab-'+mkCount; mkTabs.push({id:tid,url,title});
        document.getElementById('mkStartPage').style.display='none';
        const t=document.createElement('div'); t.id='tab-el-'+tid;
        t.style.cssText='padding:6px 15px;background:#1a1a1a;color:#999;border-radius:6px 6px 0 0;cursor:pointer;font-size:11px;border:1px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:6px;';
        t.innerHTML=`<span>${title}</span><span style="font-size:13px;opacity:0.5;cursor:pointer;" onclick="event.stopPropagation();mkCloseTab('${tid}')">✕</span>`;
        t.addEventListener('click',()=>mkSwitchTab(tid));
        document.getElementById('mkTabs').appendChild(t);
        const f=document.createElement('iframe'); f.id='frame-'+tid; f.src=url;
        f.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;border:none;background:#000;display:none;';
        f.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');
        document.getElementById('mkFrames').appendChild(f);
        mkSwitchTab(tid); document.getElementById('mkTabCount').textContent=mkTabs.length+' Tabs';
    };
    window.mkSwitchTab = function(tid) {
        document.querySelectorAll('#mkTabs>div').forEach(t=>{t.style.background='#1a1a1a';t.style.color='#999';t.style.borderColor='transparent';});
        document.querySelectorAll('#mkFrames iframe').forEach(f=>f.style.display='none');
        const te=document.getElementById('tab-el-'+tid), fe=document.getElementById('frame-'+tid);
        if(te){te.style.background='#0d0d0d';te.style.color='#ff6347';te.style.borderColor='var(--accent)';}
        if(fe)fe.style.display='block'; mkActive=tid;
    };
    window.mkCloseTab = function(tid) {
        document.getElementById('tab-el-'+tid)?.remove(); document.getElementById('frame-'+tid)?.remove();
        mkTabs=mkTabs.filter(t=>t.id!==tid);
        if(mkActive===tid){if(mkTabs.length)mkSwitchTab(mkTabs[mkTabs.length-1].id);else{mkActive=null;document.getElementById('mkStartPage').style.display='flex';}}
        document.getElementById('mkTabCount').textContent=mkTabs.length+' Tabs';
    };
}

// ========== GAMES ==========
function openGames() {
    const games=[['Desert Order','🏜️','https://desertorder.com/'],['Bloxd.io','🎮','https://bloxd.io/'],['Cookie Clicker','🍪','https://orteil.dashnet.org/cookieclicker/'],['1v1.LOL','🔫','https://1v1.lol/'],['Krunker','🎯','https://krunker.io/'],['Slope','⛷️','https://slope.game/'],['Subway Surfers','🏃','https://subwaysurfers.com/'],['Geometry Dash','📐','https://geometrydash.io/']];
    let h='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:15px;">';
    games.forEach(g=>h+=`<div onclick="openWebApp('${g[0]}','${g[1]}',PROXY+'${g[2]}')" style="padding:15px;background:var(--surface-light);border:1px solid var(--border-dim);border-radius:8px;cursor:pointer;text-align:center;" onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 15px var(--glow)'" onmouseout="this.style.borderColor='var(--border-dim)';this.style.boxShadow='none'"><div style="font-size:32px;">${g[1]}</div><div style="font-size:12px;color:var(--text);margin-top:8px;">${g[0]}</div></div>`);
    h+='</div>'; createWindow('games','🎮 Games','🎮',h,500,450);
}

// ========== KI ==========
function openKI() {
    const ki=[['ChatGPT','🤖','https://chat.openai.com/'],['Claude','🧪','https://claude.ai/'],['DeepSeek','🧠','https://chat.deepseek.com/'],['Perplexity','🔍','https://perplexity.ai/'],['Gemini','💎','https://gemini.google.com/'],['Grok','🐦','https://grok.x.ai/']];
    let h='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:15px;">';
    ki.forEach(k=>h+=`<div onclick="openWebApp('${k[0]}','${k[1]}',PROXY+'${k[2]}')" style="padding:15px;background:var(--surface-light);border:1px solid var(--border-dim);border-radius:8px;cursor:pointer;text-align:center;" onmouseover="this.style.borderColor='var(--accent)';this.style.boxShadow='0 0 15px var(--glow)'" onmouseout="this.style.borderColor='var(--border-dim)';this.style.boxShadow='none'"><div style="font-size:32px;">${k[1]}</div><div style="font-size:12px;color:var(--text);margin-top:8px;">${k[0]}</div></div>`);
    h+='</div>'; createWindow('ki','🧠 KI-Chat','🧠',h,500,400);
}

// ========== WEB APP ==========
function openWebApp(name, icon, url) {
    createWindow(name.toLowerCase().replace(/\s+/g,'-'), `${icon} ${name}`, icon, `<iframe src="${url}" style="width:100%;height:100%;border:none;background:#000;"></iframe>`, 900, 500);
}

// ========== RECHNER ==========
function openCalculator() {
    const btns=['C','±','%','÷','7','8','9','×','4','5','6','-','1','2','3','+','0','00','.','='];
    let h='<div style="padding:15px;height:100%;display:flex;flex-direction:column;background:#1a1a1a;"><input type="text" id="calcDisplay" readonly style="width:100%;padding:15px;background:#000;border:1px solid var(--border-dim);border-radius:8px;color:#0f0;font-size:24px;text-align:right;margin-bottom:10px;font-family:monospace;" value="0"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1;">';
    btns.forEach(b=>{const isOp=['÷','×','-','+','=','C'].includes(b); h+=`<button onclick="calcInput('${b}')" style="padding:12px;background:${isOp?'var(--accent)':'#2a2a2a'};border:none;border-radius:6px;color:${isOp?'#000':'#fff'};font-size:18px;cursor:pointer;">${b}</button>`;});
    h+='</div></div>'; createWindow('calculator','🔢 Rechner','🔢',h,300,400);
    window.calcInput=function(k){const d=document.getElementById('calcDisplay'); if(k==='C')d.value='0'; else if(k==='=')try{d.value=eval(d.value.replace('×','*').replace('÷','/'))}catch(e){d.value='Error'} else d.value=d.value==='0'?k:d.value+k;};
}

// ========== NOTIZEN ==========
function openNotepad() {
    createWindow('notepad','📝 Notizen','📝',`<div style="display:flex;flex-direction:column;height:100%;background:#1a1a1a;"><div style="display:flex;padding:8px;gap:5px;background:#0d0d0d;"><button onclick="localStorage.setItem('mk-note',document.getElementById('noteText').value)" style="padding:4px 10px;background:var(--accent);border:none;border-radius:3px;color:#000;cursor:pointer;">💾</button><button onclick="document.getElementById('noteText').value=''" style="padding:4px 10px;background:#333;border:none;border-radius:3px;color:#fff;cursor:pointer;">🗑️</button></div><textarea id="noteText" placeholder="Notizen..." style="flex:1;padding:15px;background:#111;border:none;color:#ccc;font-size:14px;resize:none;outline:none;">${localStorage.getItem('mk-note')||''}</textarea></div>`,500,400);
}

// ========== PAINT ==========
function openPaint() {
    createWindow('paint','🎨 Paint','🎨',`<div style="display:flex;flex-direction:column;height:100%;background:#1a1a1a;"><div style="display:flex;padding:8px;gap:5px;background:#0d0d0d;"><input type="color" id="pColor" value="#ff4500" style="width:30px;height:30px;border:none;cursor:pointer;"><input type="range" id="pSize" min="1" max="20" value="5" style="width:80px;"><button onclick="pClear()" style="padding:4px 10px;background:#333;border:none;border-radius:3px;color:#fff;cursor:pointer;">Löschen</button></div><canvas id="pCanvas" style="flex:1;background:#fff;cursor:crosshair;"></canvas></div>`,600,450);
    setTimeout(()=>{const c=document.getElementById('pCanvas'),ctx=c.getContext('2d');c.width=c.offsetWidth;c.height=c.offsetHeight;let p=false;c.addEventListener('mousedown',e=>{p=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY)});c.addEventListener('mouseup',()=>p=false);c.addEventListener('mousemove',e=>{if(!p)return;ctx.strokeStyle=document.getElementById('pColor').value;ctx.lineWidth=document.getElementById('pSize').value;ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke()});window.pClear=()=>ctx.clearRect(0,0,c.width,c.height);},100);
}

// ========== SNAKE ==========
function openSnake() { createWindow('snake','🐍 Snake','🐍','<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;gap:10px;"><canvas id="sCanvas" width="300" height="300" style="border:1px solid var(--accent);"></canvas><div style="color:var(--accent);">Punkte: <span id="sScore">0</span></div><button onclick="sStart()" style="padding:8px 20px;background:var(--accent);border:none;border-radius:4px;color:#000;cursor:pointer;">🐍 Start</button></div>',350,420); }

// ========== TIC TAC TOE ==========
function openTicTacToe() {
    createWindow('tictactoe','⭕ Tic Tac Toe','⭕','<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1a1a1a;gap:10px;"><h3 style="color:var(--accent);">Tic Tac Toe</h3><div id="tttBoard" style="display:grid;grid-template-columns:repeat(3,80px);gap:5px;"></div><div id="tttStatus" style="color:var(--text);">Spieler X</div><button onclick="tttReset()" style="padding:8px 20px;background:var(--accent);border:none;border-radius:4px;color:#000;cursor:pointer;">🔄</button></div>',300,350);
    setTimeout(()=>{let b=Array(9).fill(''),t='X';const s=document.getElementById('tttStatus'),bd=document.getElementById('tttBoard');function r(){bd.innerHTML=b.map((c,i)=>`<div onclick="tttMove(${i})" style="width:80px;height:80px;background:#111;border:1px solid var(--border-dim);display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;color:${c==='X'?'var(--accent)':'#0f0'};">${c}</div>`).join('')}window.tttMove=function(i){if(b[i]||w())return;b[i]=t;t=t==='X'?'O':'X';s.textContent=w()?`${w()} gewinnt!`:`Spieler ${t}`;r()};window.tttReset=function(){b=Array(9).fill('');t='X';s.textContent='Spieler X';r()};function w(){const ws=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,c,d]of ws)if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.every(c=>c)?'Unentschieden':null}r();},100);
}

// ========== WETTER ==========
function openWeather() {
    createWindow('weather','🌤️ Wetter','🌤️','<div style="padding:20px;text-align:center;background:#1a1a1a;height:100%;color:var(--text);"><h3 style="color:var(--accent);">Wetter</h3><input type="text" id="wCity" placeholder="Stadt..." style="padding:8px;background:#111;border:1px solid var(--border-dim);border-radius:4px;color:#fff;margin:10px 0;width:80%;"><button onclick="document.getElementById(\'wResult\').innerHTML=\'🌤️ \'+document.getElementById(\'wCity\').value+\'<br>🌡️ 22°C<br>💨 12 km/h\'" style="padding:8px 16px;background:var(--accent);border:none;border-radius:4px;color:#000;cursor:pointer;">Suchen</button><div id="wResult" style="margin-top:15px;"></div></div>',350,300);
}

// ========== PIANO ==========
function openPiano() {
    const notes=['C','D','E','F','G','A','B','C2'], freqs=[262,294,330,349,392,440,494,523];
    createWindow('piano','🎹 Piano','🎹',`<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1a1a1a;gap:15px;"><h3 style="color:var(--accent);">Mini Piano</h3><div style="display:flex;gap:5px;">${notes.map((n,i)=>`<button onclick="pPlay(${i})" style="width:50px;height:120px;background:linear-gradient(180deg,#fff,#ddd);border:2px solid #333;border-radius:0 0 8px 8px;cursor:pointer;">${n}</button>`).join('')}</div></div>`,480,250);
    window.pPlay=function(i){const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator();o.frequency.value=freqs[i];o.connect(a.destination);o.start();o.stop(a.currentTime+0.3);};
}

// ========== CHAT ==========
function openChat() {
    createWindow('chat','💭 Chat','💭',`<div style="height:100%;display:flex;flex-direction:column;background:#1a1a1a;"><div id="cMessages" style="flex:1;padding:10px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;"><div style="background:var(--surface-light);padding:8px 12px;border-radius:8px;align-self:flex-start;color:var(--text);font-size:12px;">💣 MK: Willkommen!</div></div><div style="display:flex;padding:8px;gap:5px;background:#0d0d0d;"><input type="text" id="cInput" placeholder="Nachricht..." onkeypress="if(event.key==='Enter')cSend()" style="flex:1;padding:8px;background:#111;border:1px solid var(--border-dim);border-radius:4px;color:#fff;"><button onclick="cSend()" style="padding:8px 16px;background:var(--accent);border:none;border-radius:4px;color:#000;cursor:pointer;">Senden</button></div></div>`,400,350);
    window.cSend=function(){const i=document.getElementById('cInput'),m=i.value.trim();if(!m)return;const ms=document.getElementById('cMessages');ms.innerHTML+=`<div style="background:var(--accent);padding:8px 12px;border-radius:8px;align-self:flex-end;color:#000;font-size:12px;">Du: ${m}</div>`;i.value='';setTimeout(()=>{const r=['Interessant! 🤔','😂','💣🔥','Verstehe...','Cool!','Ja!'];ms.innerHTML+=`<div style="background:var(--surface-light);padding:8px 12px;border-radius:8px;align-self:flex-start;color:var(--text);font-size:12px;">💣 MK: ${r[Math.floor(Math.random()*r.length)]}</div>`;ms.scrollTop=ms.scrollHeight;},500+Math.random()*1000);ms.scrollTop=ms.scrollHeight;};
}

function needsProxy(url){const d=['youtube.com','youtu.be','netflix.com','twitch.tv','disneyplus.com','tiktok.com','instagram.com','reddit.com','twitter.com','discord.com','open.spotify.com','chat.openai.com','claude.ai','chat.deepseek.com','desertorder.com','1v1.lol','krunker.io','slope.game'];return d.some(x=>url.includes(x));}

console.log('📱 Apps geladen – Opera GX × Linux Style 🐧💚');
