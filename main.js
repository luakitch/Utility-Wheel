const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Start hidden, show only when ready
    frame: false, // Completely removes the native frame
    transparent: true, // Enable transparency
    alwaysOnTop: true, // Keep on top of other windows
    minimizable: false,
    maximizable: false,
    resizable: false, // Prevent resizing, which can trigger title bar on some OS
    titleBarStyle: 'hidden', // macOS-specific, harmless on other platforms
    skipTaskbar: true, // Remove from taskbar
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

  // Handle focus and blur to prevent title bar reappearing
  win.on('focus', () => {
    win.setIgnoreMouseEvents(false); // Ensure interaction is possible
    win.setHasShadow(false); // Remove shadow that might hint at a frame
  });

  // Monitor window movement or display changes
  win.on('moved', () => {
    win.setBackgroundColor('#00000000'); // Force transparent background (ARGB)
    win.setHasShadow(false); // Ensure no frame-like shadow
  });

  // Optional: Handle multi-monitor display changes
  const { screen } = require('electron');
  screen.on('display-metrics-changed', () => {
    win.setBackgroundColor('#00000000'); // Re-apply transparency
    win.setHasShadow(false); // Re-apply no shadow
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