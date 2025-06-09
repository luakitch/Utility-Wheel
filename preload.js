const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    hideWheel: () => ipcRenderer.send('hide-wheel'),
    // subscribe to toggle events
    onToggle: (cb) => ipcRenderer.on('toggle-wheel', cb)
});
