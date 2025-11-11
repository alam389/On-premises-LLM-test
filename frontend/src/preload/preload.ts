import { contextBridge } from 'electron';

// Define the API interface
interface ElectronAPI {
  // Add any Electron-specific APIs here if needed
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Add any Electron-specific APIs here if needed
} as ElectronAPI);

