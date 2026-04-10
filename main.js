const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { Client } = require('minecraft-launcher-core');
const msmc = require('msmc');
const DiscordRPC = require('discord-rpc');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let tray = null;
let rpc = null;
let discordEnabled = true;
let discordHideAway = false;
const clientId = '1122334455667788990';
const launcher = new Client();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 750,
        minWidth: 1000,
        minHeight: 600,
        frame: false,
        transparent: true,
        icon: path.join(__dirname, 'build', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
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

    mainWindow.on('show', updateActivity);
    mainWindow.on('hide', updateActivity);
}

function createTray() {
    const iconPath = path.join(__dirname, 'build', 'icon.png');
    if (fs.existsSync(iconPath)) {
        tray = new Tray(iconPath);
        const contextMenu = Menu.buildFromTemplate([
            { label: 'TENTIX Öffnen', click: () => mainWindow.show() },
            { type: 'separator' },
            { label: 'Beenden', click: () => { app.isQuitting = true; app.quit(); } }
        ]);
        tray.setToolTip('TENTIX Client');
        tray.setContextMenu(contextMenu);
        tray.on('click', () => mainWindow.show());
    }
}

function initDiscord() {
    DiscordRPC.register(clientId);
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
        updateActivity();
    });

    rpc.login({ clientId }).catch(() => {
        console.log("Discord RPC: Discord läuft nicht oder Client ID ungültig.");
    });
}

function updateActivity() {
    if (!rpc) return;
    if (!discordEnabled || (discordHideAway && mainWindow && !mainWindow.isVisible())) {
        rpc.clearActivity().catch(()=>{});
        return;
    }

    rpc.setActivity({
        details: 'Im Launcher',
        state: 'Bereitet sich vor...',
        startTimestamp: new Date(),
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
    updateActivity();
});

ipcMain.handle('get-total-ram', () => {
    return Math.floor(os.totalmem() / 1024 / 1024 / 1024);
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

autoUpdater.on('checking-for-update', () => mainWindow.webContents.send('update-status', { status: 'checking' }));
autoUpdater.on('update-available', () => mainWindow.webContents.send('update-status', { status: 'available' }));
autoUpdater.on('update-not-available', () => mainWindow.webContents.send('update-status', { status: 'latest' }));
autoUpdater.on('download-progress', (progressObj) => mainWindow.webContents.send('update-progress', progressObj.percent));
autoUpdater.on('update-downloaded', () => mainWindow.webContents.send('update-status', { status: 'downloaded' }));

ipcMain.on('check-updates', () => {
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    } else {
        mainWindow.webContents.send('update-status', { status: 'checking' });
        setTimeout(() => mainWindow.webContents.send('update-status', { status: 'latest' }), 2000);
    }
});
ipcMain.on('install-update', () => autoUpdater.quitAndInstall());