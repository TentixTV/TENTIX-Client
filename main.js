const { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { Client } = require('minecraft-launcher-core');
const msmc = require('msmc');
const DiscordRPC = require('discord-rpc');
const { autoUpdater } = require('electron-updater');

// Single Instance Lock
let mainWindow;
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            if (!mainWindow.isVisible()) mainWindow.show();
            mainWindow.focus();
        }
    });
}

let tray = null;
let rpc = null;
let discordEnabled = true;
let discordHideAway = false;
let currentClientId = '405441217766359051';
let customDetailsFormat = '';
let customStateFormat = '';
let lastUsername = 'GUEST';
const launcher = new Client();

let retryTimeout = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1350,
        height: 750,
        minWidth: 1100,
        minHeight: 600,
        frame: false,
        transparent: true,
        icon: path.join(__dirname, 'build', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false
        }
    });

    const indexPath = path.join(__dirname, 'src', 'index.html');
    if (fs.existsSync(indexPath)) {
        mainWindow.loadFile(indexPath);
    } else {
        mainWindow.loadFile('index.html');
    }

    mainWindow.on('maximize', () => mainWindow.webContents.send('window-maximized', true));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-maximized', false));

    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });

    mainWindow.on('show', updateActivity);
    mainWindow.on('hide', updateActivity);
}

function createTray() {
    try {
        let iconPath = path.join(__dirname, 'assets', 'icon-game.png');
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(__dirname, 'build', 'icon.png');
        }
        if (fs.existsSync(iconPath)) {
            const image = nativeImage.createFromPath(iconPath);
            tray = new Tray(image);
            const contextMenu = Menu.buildFromTemplate([
                { label: 'TENTIX Öffnen', click: () => {
                    if (mainWindow) {
                        if (mainWindow.isMinimized()) mainWindow.restore();
                        mainWindow.show();
                        mainWindow.focus();
                    }
                }},
                { type: 'separator' },
                { label: 'Beenden', click: () => { app.isQuitting = true; app.quit(); } }
            ]);
            tray.setToolTip('TENTIX Client');
            tray.setContextMenu(contextMenu);
            tray.on('click', () => {
                if (mainWindow) {
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.show();
                    mainWindow.focus();
                }
            });
        }
    } catch (e) {
        console.error("Failed to create tray:", e);
    }
}

app.on('before-quit', () => {
    app.isQuitting = true;
});
let connectingClient = null;
let isConnecting = false;

async function initDiscord(targetClientId) {
    const targetId = targetClientId || currentClientId;
    if (isConnecting && targetId === currentClientId) return;
    isConnecting = true;
    currentClientId = targetId;

    if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
    }

    const clientsToDestroy = [];
    if (rpc) {
        clientsToDestroy.push(rpc);
        rpc = null;
    }
    if (connectingClient) {
        clientsToDestroy.push(connectingClient);
        connectingClient = null;
    }

    for (const c of clientsToDestroy) {
        try {
            c.removeAllListeners();
            await c.destroy().catch(() => {});
        } catch (e) {}
    }

    const scheduleRetry = () => {
        isConnecting = false;
        if (!retryTimeout) {
            retryTimeout = setTimeout(() => {
                retryTimeout = null;
                initDiscord(currentClientId);
            }, 15000);
        }
    };

    try {
        DiscordRPC.register(currentClientId);
        const client = new DiscordRPC.Client({ transport: 'ipc' });
        connectingClient = client;

        client.on('ready', () => {
            console.log("Discord RPC connected with Client ID:", currentClientId);
            if (connectingClient === client) {
                connectingClient = null;
            }
            rpc = client;
            isConnecting = false;
            updateActivity();
        });

        const handleFailure = (err) => {
            if (err && err !== "Disconnected" && err.message !== "Disconnected") {
                console.error("Discord RPC failure:", err ? (err.message || err) : "unknown error");
            }
            if (rpc === client) rpc = null;
            if (connectingClient === client) connectingClient = null;
            try {
                client.removeAllListeners();
                client.destroy().catch(() => {});
            } catch (e) {}
            scheduleRetry();
        };

        client.on('disconnected', () => handleFailure("Disconnected"));
        client.on('error', handleFailure);

        client.login({ clientId: currentClientId }).catch(handleFailure);
    } catch (e) {
        if (e && e.message !== "Could not connect") {
            console.error("Failed to initialize Discord RPC:", e);
        }
        scheduleRetry();
    }
}

let currentActivity = {
    details: 'Im Launcher',
    state: 'Bereitet sich vor...',
    startTimestamp: new Date()
};

function updateActivity() {
    if (!rpc) return;
    if (!discordEnabled || (discordHideAway && mainWindow && !mainWindow.isVisible())) {
        rpc.clearActivity().catch(()=>{});
        return;
    }

    let details = currentActivity.details;
    let state = currentActivity.state;

    if (customDetailsFormat) {
        details = customDetailsFormat.replace(/{username}/g, lastUsername);
    }
    if (customStateFormat) {
        state = customStateFormat.replace(/{username}/g, lastUsername);
    }

    rpc.setActivity({
        details: details,
        state: state,
        startTimestamp: currentActivity.startTimestamp,
        largeImageKey: 'tentix_logo',
        largeImageText: 'TENTIX Client',
        instance: false,
    }).catch(()=>{});
}

app.whenReady().then(() => {
    createWindow();
    createTray();
    initDiscord();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (!tray) app.quit();
    }
});

ipcMain.on('window-close', () => {
    if (tray) {
        mainWindow.hide();
    } else {
        app.quit();
    }
});

ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
});

ipcMain.on('window-drag', (event, data) => {
    if (mainWindow && !mainWindow.isMaximized()) {
        const { deltaX, deltaY } = data;
        const [x, y] = mainWindow.getPosition();
        mainWindow.setPosition(x + deltaX, y + deltaY);
    }
});

ipcMain.on('open-external', (event, url) => shell.openExternal(url));

ipcMain.on('set-autostart', (event, isEnabled) => {
    app.setLoginItemSettings({
        openAtLogin: isEnabled,
        path: app.getPath('exe')
    });
});

ipcMain.on('update-discord-rp', (event, data) => {
    discordEnabled = data.enabled;
    discordHideAway = data.hideAway;
    
    if (data.clientId && data.clientId !== currentClientId) {
        initDiscord(data.clientId);
    }
    if (data.detailsFormat !== undefined) {
        customDetailsFormat = data.detailsFormat;
    }
    if (data.stateFormat !== undefined) {
        customStateFormat = data.stateFormat;
    }
    
    updateActivity();
});

ipcMain.on('update-drp-status', (event, data) => {
    if (data.username) {
        lastUsername = data.username;
        currentActivity.details = `${data.username} | TENTIX`;
    } else {
        currentActivity.details = `TENTIX Client`;
    }
    if (data.state) {
        currentActivity.state = data.state;
    }
    if (data.startTimestamp) {
        currentActivity.startTimestamp = new Date(data.startTimestamp);
    } else if (data.resetTime) {
        currentActivity.startTimestamp = new Date();
    }
    updateActivity();
});

ipcMain.handle('get-total-ram', () => {
    const rawGb = os.totalmem() / 1024 / 1024 / 1024;
    const standards = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
    for (const std of standards) {
        if (Math.abs(rawGb - std) < 1.5) {
            return std;
        }
    }
    return Math.round(rawGb);
});

ipcMain.handle('download-mod', async (event, args) => {
    try {
        const { url, filename } = args;
        const modsDir = path.join(app.getPath('appData'), '.tentixclient', 'mods');
        if (!fs.existsSync(modsDir)) {
            fs.mkdirSync(modsDir, { recursive: true });
        }
        const filePath = path.join(modsDir, filename);
        
        const https = require('https');
        const fileStream = fs.createWriteStream(filePath);
        
        return new Promise((resolve) => {
            https.get(url, (response) => {
                if (response.statusCode === 302 || response.statusCode === 301) {
                    https.get(response.headers.location, (redirectResponse) => {
                        redirectResponse.pipe(fileStream);
                        fileStream.on('finish', () => {
                            fileStream.close();
                            resolve(true);
                        });
                    }).on('error', (err) => {
                        console.error("Redirect download error:", err);
                        resolve(false);
                    });
                } else {
                    response.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve(true);
                    });
                }
            }).on('error', (err) => {
                console.error("Download error:", err);
                resolve(false);
            });
        });
    } catch (e) {
        console.error("Download mod error:", e);
        return false;
    }
});

ipcMain.handle('uninstall-mod', async (event, filename) => {
    try {
        const modsDir = path.join(app.getPath('appData'), '.tentixclient', 'mods');
        const filePath = path.join(modsDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (e) {
        console.error("Uninstall mod error:", e);
        return false;
    }
});

ipcMain.handle('login-microsoft', async () => {
    try {
        const authManager = new msmc.Auth("select_account");
        const xboxManager = await authManager.launch("raw");
        const token = await xboxManager.getMinecraft();
        return {
            success: true,
            name: token.profile.name,
            uuid: token.profile.id,
            mclc_token: token.mclc()
        };
    } catch (e) {
        return { success: false, error: String(e) };
    }
});

ipcMain.handle('launch-minecraft', async (event, args) => {
    try {
        let opts = {
            clientPackage: null,
            authorization: args.token,
            root: path.join(app.getPath('appData'), '.tentixclient'),
            version: {
                number: args.version,
                type: "release"
            },
            memory: {
                max: args.ram,
                min: "1G"
            },
            window: {
                width: args.resWidth,
                height: args.resHeight,
                fullscreen: false
            }
        };

        if (args.modloader === 'FABRIC') {
            opts.version.custom = `fabric-${args.version}`;
        }

        await launcher.launch(opts);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

launcher.on('debug', (e) => console.log(e));
launcher.on('data', (e) => mainWindow.webContents.send('launch-progress', { type: 'data', data: e }));
launcher.on('progress', (e) => mainWindow.webContents.send('launch-progress', { type: 'progress', task: e.task, total: e.total, taskType: e.type }));
launcher.on('close', (e) => mainWindow.webContents.send('launch-progress', { type: 'close', code: e }));

autoUpdater.autoDownload = false;

autoUpdater.on('checking-for-update', () => mainWindow.webContents.send('update-status', { status: 'checking' }));
autoUpdater.on('update-available', () => mainWindow.webContents.send('update-status', { status: 'available' }));
autoUpdater.on('update-not-available', () => mainWindow.webContents.send('update-status', { status: 'latest' }));
autoUpdater.on('download-progress', (progressObj) => mainWindow.webContents.send('update-progress', progressObj.percent));
autoUpdater.on('update-downloaded', () => mainWindow.webContents.send('update-status', { status: 'downloaded' }));
autoUpdater.on('error', (err) => {
    console.error("AutoUpdater error:", err);
    mainWindow.webContents.send('update-status', { status: 'error', error: err ? err.message : "Unknown error" });
});

ipcMain.on('check-updates', () => {
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    } else {
        mainWindow.webContents.send('update-status', { status: 'checking' });
        setTimeout(() => mainWindow.webContents.send('update-status', { status: 'latest' }), 2000);
    }
});
ipcMain.on('download-update', () => {
    if (app.isPackaged) {
        autoUpdater.downloadUpdate();
    } else {
        // Mock progress for development if requested
        mainWindow.webContents.send('update-status', { status: 'downloading' });
    }
});
ipcMain.on('install-update', () => autoUpdater.quitAndInstall());
ipcMain.handle('get-app-version', () => app.getVersion());