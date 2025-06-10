const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    thickFrame: false,
    type: 'toolbar',
    focusable: false,         // never gains focus → no blur flash
    alwaysOnTop: true,
    skipTaskbar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load your HTML file
  win.loadFile('index.html');

  // Ensure window is ready before showing
  win.once('ready-to-show', () => {
    win.show();
  });

  // When the window loses focus (e.g., clicking on another monitor)
  win.on('blur', () => {
    // Some OS versions might still try to paint a background. This prevents it.
    win.setBackgroundColor('#00000000');
  });

  // When the window gains focus
  win.on('focus', () => {
    // Allow mouse events and re-assert that there's no shadow.
    win.setIgnoreMouseEvents(false);
    win.setHasShadow(false);
  });

  // You can keep these as they are harmless and can help in some edge cases
  win.on('moved', () => {
    win.setHasShadow(false);
  });
  // Optional: Handle multi-monitor display changes
  const { screen } = require('electron');
  screen.on('display-metrics-changed', () => {
    win.setHasShadow(false);
  });
}

app.whenReady().then(() => {
  createWindow();

  // Register F4 to toggle the widget
  const ok = globalShortcut.register('F4', () => {
    if (!win) return; // Guard against null window
    if (!win.isVisible()) {
      win.show();
    }
    win.webContents.send('toggle-wheel');
  });

  if (!ok) console.error('F4 registration failed');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Ensure only one instance (optional, prevents multiple windows)
app.on('second-instance', () => {
  if (win) {
    if (!win.isVisible()) win.show();
    win.focus();
  }
});