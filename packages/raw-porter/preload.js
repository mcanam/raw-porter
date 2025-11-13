import { contextBridge, ipcRenderer, webFrame } from 'electron';

// disable zoom
webFrame.setZoomFactor(1.0);
webFrame.setVisualZoomLevelLimits(1, 1);

contextBridge.exposeInMainWorld('api', {
    appVersion: () => ipcRenderer.invoke('get-app-version'),
    selectFolder: () => ipcRenderer.invoke('show-dialog'),
    processFiles: (payload) => ipcRenderer.invoke('process-files', payload),
    cancelProcessFiles: () => ipcRenderer.invoke('cancel-process-files'),
    onLog: (callback) => ipcRenderer.on('log', (_, data) => callback(data)),
});
