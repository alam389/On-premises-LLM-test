declare global {
  interface ElectronAPI {
    // Add any Electron-specific APIs here if needed
  }

  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};

