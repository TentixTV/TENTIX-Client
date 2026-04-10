// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    close: () => ipcRenderer.send('window-close'),
    maximize: () => ipcRenderer.send('window-maximize'),
    minimize: () => ipcRenderer.send('window-minimize'),
    openExternalLink: (url) => ipcRenderer.send('open-external', url),
    checkUpdates: () => ipcRenderer.send('check-updates'),
    installUpdate: () => ipcRenderer.send('install-update'),
    updateDiscordRP: (data) => ipcRenderer.send('update-discord-rp', data),
    setAutostart: (isEnabled) => ipcRenderer.send('set-autostart', isEnabled),
    getTotalRam: () => ipcRenderer.invoke('get-total-ram'),
    loginWithMicrosoft: () => ipcRenderer.invoke('login-microsoft'),
    launchMinecraft: (args) => ipcRenderer.invoke('launch-minecraft', args),

    onUpdateStatus: (callback) => ipcRenderer.on('update-status', (e, data) => callback(data)),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (e, percent) => callback(percent)),
    onLaunchProgress: (callback) => ipcRenderer.on('launch-progress', (e, data) => callback(data)),
    onMaximized: (callback) => ipcRenderer.on('window-maximized', (e, isMax) => callback(isMax))
});