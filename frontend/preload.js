const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any Electron-specific APIs here if needed
});

