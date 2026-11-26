// LZ-PLUS para Windows: abre la app en su propia ventana y trae adentro
// el intermediario y FFmpeg (ya no hace falta abrir INICIAR-LZ-PLUS.bat).
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');

// Actualización: la app pide abrir "lz-update:<link del instalador>"; se descarga y se ejecuta
function download(u, file, onPct, n = 0) {
  return new Promise((res, rej) => {
    https.get(u, { headers: { 'User-Agent': 'LZ-PLUS' } }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && n < 8) { r.resume(); return download(r.headers.location, file, onPct, n + 1).then(res, rej); }
      if (r.statusCode !== 200) { r.resume(); return rej(new Error('HTTP ' + r.statusCode)); }
      const total = +r.headers['content-length'] || 0; let done = 0, last = -1;
      const out = fs.createWriteStream(file);
      r.on('data', (d) => { done += d.length; const p = total ? Math.floor(done * 100 / total) : -1; if (p !== last && p % 5 === 0) { last = p; onPct(p); } });
      r.pipe(out); out.on('finish', () => out.close(() => res(file))); r.on('error', rej); out.on('error', rej);
    }).on('error', rej);
  });
}
async function selfUpdate(u) {
  const say = (p) => { try { win.webContents.executeJavaScript('window.lzUpdProgress && lzUpdProgress(' + p + ')'); } catch (e) {} };
  try {
    const file = path.join(os.tmpdir(), 'LZ-PLUS-actualizacion.exe');
    await download(u, file, say);
    say(101);
    shell.openPath(file);
    setTimeout(() => app.quit(), 1500);
  } catch (e) { say(-2); }
}

process.env.PORT = process.env.PORT || '8080';
process.env.LZ_EMBEDDED = '1';
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Solo una ventana de LZ-PLUS a la vez
if (!app.requestSingleInstanceLock()) { app.quit(); }

let win;
function createWindow() {
  require('./lz-servidor.js');   // arranca el intermediario dentro de la app
  win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 960, minHeight: 540,
    backgroundColor: '#06080F', title: 'LZ-PLUS', icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true, show: false,
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  const url = 'http://localhost:' + process.env.PORT + '/';
  const load = (n) => win.loadURL(url).catch(() => { if (n < 40) setTimeout(() => load(n + 1), 250); });
  load(0);
  // F11: pantalla completa
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  // Links externos (VLC, páginas) se abren fuera de la app
  win.webContents.setWindowOpenHandler(({ url: u }) => { if (u.startsWith('lz-update:')) selfUpdate(u.slice(10)); else shell.openExternal(u); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, u) => { if (!u.startsWith(url)) { e.preventDefault(); shell.openExternal(u); } });
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
