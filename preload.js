const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Fenster-Steuerung
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    onMaximized: (callback) => ipcRenderer.on('window-maximized', (event, isMax) => callback(isMax)),

    // System-Infos (RAM)
    getTotalRam: () => ipcRenderer.invoke('get-total-ram'),

    // Microsoft Login
    loginWithMicrosoft: () => ipcRenderer.invoke('ms-login'),

    // Minecraft Starten & Fortschritt
    launchMinecraft: (options) => ipcRenderer.invoke('launch-minecraft', options),
    onLaunchProgress: (callback) => ipcRenderer.on('launch-progress', (event, data) => callback(data)),

    // NEU: Links im echten Browser öffnen (für Discord, Socials)
    openExternalLink: (url) => ipcRenderer.send('open-link', url)
});