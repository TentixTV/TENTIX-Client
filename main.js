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
        let image = null;
        let iconPath = path.join(__dirname, 'assets', 'TENTIX.png');
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(__dirname, 'assets', 'TENTIX2.png');
        }
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(__dirname, 'build', 'icon.png');
        }
        if (!fs.existsSync(iconPath)) {
            iconPath = path.join(__dirname, 'assets', 'icon-game.png'); // Safe default
        }
        
        try {
            if (fs.existsSync(iconPath)) {
                let tempImg = nativeImage.createFromPath(iconPath);
                if (!tempImg.isEmpty()) {
                    image = tempImg.resize({ width: 16, height: 16 });
                }
            }
        } catch (resizeErr) {
            console.error("Resize failed, using original or empty image:", resizeErr);
        }

        if (!image || image.isEmpty()) {
            const backupPath = path.join(__dirname, 'assets', 'icon-game.png');
            if (fs.existsSync(backupPath)) {
                image = nativeImage.createFromPath(backupPath);
            } else {
                image = nativeImage.createEmpty();
            }
        }

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
        console.log("System tray initialized successfully.");
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
            if (client.user && mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('discord-user-info', {
                    username: client.user.username,
                    id: client.user.id
                });
            }
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
        const rankSuffix = (data.rank && data.rank !== 'PLAYER') ? ` ${data.rank}` : '';
        currentActivity.details = `${data.username} | TENTIX${rankSuffix}`;
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
        const rootDir = path.join(app.getPath('appData'), '.tentixclient');
        if (!fs.existsSync(rootDir)) {
            fs.mkdirSync(rootDir, { recursive: true });
        }

        // 1. Enforce default settings in options.txt
        const optionsPath = path.join(rootDir, 'options.txt');
        try {
            let optionsContent = '';
            if (fs.existsSync(optionsPath)) {
                optionsContent = fs.readFileSync(optionsPath, 'utf8');
            }
            let lines = optionsContent.split(/\r?\n/);
            let updatedLines = [];
            let keysToSet = {
                'narrator': '0',
                'soundCategory_music': '0.0',
                'guiScale': '2'
            };
            for (let line of lines) {
                if (!line.trim()) continue;
                let parts = line.split(':');
                if (parts.length >= 2) {
                    let key = parts[0].trim();
                    if (keysToSet.hasOwnProperty(key)) {
                        updatedLines.push(`${key}:${keysToSet[key]}`);
                        delete keysToSet[key];
                        continue;
                    }
                }
                updatedLines.push(line);
            }
            for (let key in keysToSet) {
                updatedLines.push(`${key}:${keysToSet[key]}`);
            }
            fs.writeFileSync(optionsPath, updatedLines.join('\n'), 'utf8');
            console.log("Enforced client options defaults (narrator: 0, music: 0.0, guiScale: 2).");
        } catch (optionsErr) {
            console.error("Failed to write options.txt defaults:", optionsErr);
        }

        // 2. Ensure mods are copied/updated
        const modsDir = path.join(rootDir, 'mods');
        if (!fs.existsSync(modsDir)) {
            fs.mkdirSync(modsDir, { recursive: true });
        }

        // Delete old client JARs to avoid conflicts
        try {
            const files = fs.readdirSync(modsDir);
            for (const file of files) {
                if ((file.startsWith('tentix-client') || file.startsWith('tcm-')) && file.endsWith('.jar')) {
                    fs.unlinkSync(path.join(modsDir, file));
                    console.log(`Cleaned up old client jar: ${file}`);
                }
            }
        } catch (cleanupErr) {
            console.error("Failed to cleanup old client JARs:", cleanupErr);
        }

        const tcmSrc = path.join(__dirname, 'assets', 'mods', 'tcm.jar');
        const kotlinSrc = path.join(__dirname, 'assets', 'mods', 'fabric-language-kotlin.jar');
        const tcmDest = path.join(modsDir, 'tcm.jar');
        const kotlinDest = path.join(modsDir, 'fabric-language-kotlin.jar');

        if (fs.existsSync(tcmSrc)) {
            fs.copyFileSync(tcmSrc, tcmDest);
            console.log("Copied/updated tcm.jar in mods folder.");
        } else {
            console.warn("TCM JAR not found in launcher assets:", tcmSrc);
        }

        if (fs.existsSync(kotlinSrc)) {
            fs.copyFileSync(kotlinSrc, kotlinDest);
            console.log("Copied/updated fabric-language-kotlin.jar in mods folder.");
        } else {
            console.warn("Kotlin language mod JAR not found in launcher assets:", kotlinSrc);
        }

        let opts = {
            clientPackage: null,
            authorization: args.token,
            root: rootDir,
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
            },
            customArgs: [
                `-Dtentix.rank=${args.rank || 'PLAYER'}`
            ]
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

let isManualCheck = false;

autoUpdater.on('checking-for-update', () => {
    if (isManualCheck) {
        mainWindow.webContents.send('update-status', { status: 'checking' });
    }
});
autoUpdater.on('update-available', () => mainWindow.webContents.send('update-status', { status: 'available' }));
autoUpdater.on('update-not-available', () => {
    if (isManualCheck) {
        mainWindow.webContents.send('update-status', { status: 'latest' });
    } else {
        mainWindow.webContents.send('update-status', { status: 'idle' });
    }
});
autoUpdater.on('download-progress', (progressObj) => mainWindow.webContents.send('update-progress', progressObj.percent));
autoUpdater.on('update-downloaded', () => mainWindow.webContents.send('update-status', { status: 'downloaded' }));
autoUpdater.on('error', (err) => {
    console.error("AutoUpdater error:", err);
    if (isManualCheck) {
        mainWindow.webContents.send('update-status', { status: 'error', error: err ? err.message : "Unknown error" });
    } else {
        mainWindow.webContents.send('update-status', { status: 'idle' });
    }
});

let macUpdateDmgUrl = null;
let downloadedMacDmgPath = null;

async function checkMacUpdates(silent) {
    try {
        if (!silent) {
            mainWindow.webContents.send('update-status', { status: 'checking' });
        }
        
        const https = require('https');
        const options = {
            hostname: 'api.github.com',
            path: '/repos/TentixTV/TENTIX-Client/releases/latest',
            headers: { 'User-Agent': 'TentixClient-MacUpdater' }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const release = JSON.parse(data);
                    if (!release.tag_name) {
                        if (!silent) mainWindow.webContents.send('update-status', { status: 'latest' });
                        return;
                    }
                    const latestVersion = release.tag_name.replace('v', '');
                    const currentVersion = app.getVersion();
                    
                    if (latestVersion !== currentVersion) {
                        const dmgAsset = release.assets.find(a => a.name.endsWith('.dmg'));
                        if (dmgAsset) {
                            macUpdateDmgUrl = dmgAsset.browser_download_url;
                            mainWindow.webContents.send('update-status', { status: 'available' });
                            return;
                        }
                    }
                    
                    if (!silent) {
                        mainWindow.webContents.send('update-status', { status: 'latest' });
                    } else {
                        mainWindow.webContents.send('update-status', { status: 'idle' });
                    }
                } catch (e) {
                    console.error("Failed to parse Mac release info:", e);
                    if (!silent) mainWindow.webContents.send('update-status', { status: 'latest' });
                }
            });
        }).on('error', (err) => {
            console.error("Failed to fetch Mac updates:", err);
            if (!silent) mainWindow.webContents.send('update-status', { status: 'latest' });
        });
    } catch (e) {
        console.error("Error checking Mac updates:", e);
    }
}

function downloadMacUpdate() {
    if (!macUpdateDmgUrl) {
        mainWindow.webContents.send('update-status', { status: 'error', error: "No download URL available" });
        return;
    }
    
    mainWindow.webContents.send('update-status', { status: 'downloading' });
    
    const https = require('https');
    const tempDir = app.getPath('temp');
    downloadedMacDmgPath = path.join(tempDir, `TENTIX_Client_Setup_${Date.now()}.dmg`);
    
    const fileStream = fs.createWriteStream(downloadedMacDmgPath);
    
    const request = (url) => {
        https.get(url, { headers: { 'User-Agent': 'TentixClient-MacUpdater' } }, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                request(res.headers.location);
                return;
            }
            
            const totalBytes = parseInt(res.headers['content-length'] || 0);
            let downloadedBytes = 0;
            
            res.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                if (totalBytes > 0) {
                    const percent = Math.round((downloadedBytes / totalBytes) * 100);
                    mainWindow.webContents.send('update-progress', percent);
                }
            });
            
            res.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                mainWindow.webContents.send('update-status', { status: 'downloaded' });
            });
        }).on('error', (err) => {
            console.error("Mac download request error:", err);
            mainWindow.webContents.send('update-status', { status: 'error', error: err.message });
        });
    };
    
    request(macUpdateDmgUrl);
}

ipcMain.on('check-updates', (event, opts) => {
    const silent = opts && opts.silent;
    isManualCheck = !silent;
    if (app.isPackaged) {
        if (process.platform === 'darwin') {
            checkMacUpdates(silent);
        } else {
            autoUpdater.checkForUpdates();
        }
    } else {
        if (!silent) {
            mainWindow.webContents.send('update-status', { status: 'checking' });
        }
        const { exec } = require('child_process');
        exec('git pull', (err, stdout, stderr) => {
            if (err) {
                console.error("Git pull error:", err);
                if (!silent) {
                    mainWindow.webContents.send('update-status', { status: 'latest' });
                }
                return;
            }
            console.log("Git pull output:", stdout);
            if (stdout.includes('Already up to date.') || stdout.includes('Bereits auf dem neuesten Stand.')) {
                if (!silent) {
                    mainWindow.webContents.send('update-status', { status: 'latest' });
                }
            } else {
                mainWindow.webContents.send('update-status', { status: 'downloaded' });
            }
        });
    }
});

ipcMain.on('download-update', () => {
    if (app.isPackaged) {
        if (process.platform === 'darwin') {
            downloadMacUpdate();
        } else {
            autoUpdater.downloadUpdate();
        }
    } else {
        mainWindow.webContents.send('update-status', { status: 'downloading' });
        setTimeout(() => {
            mainWindow.webContents.send('update-status', { status: 'downloaded' });
        }, 1000);
    }
});

ipcMain.on('install-update', () => {
    if (app.isPackaged) {
        if (process.platform === 'darwin') {
            if (downloadedMacDmgPath && fs.existsSync(downloadedMacDmgPath)) {
                shell.openPath(downloadedMacDmgPath).then(() => {
                    app.isQuitting = true;
                    app.quit();
                }).catch((err) => {
                    console.error("Failed to open DMG:", err);
                    shell.openExternal('file://' + downloadedMacDmgPath);
                    app.isQuitting = true;
                    app.quit();
                });
            } else {
                app.isQuitting = true;
                app.quit();
            }
        } else {
            app.isQuitting = true;
            autoUpdater.quitAndInstall(true, true);
        }
    } else {
        if (mainWindow) {
            mainWindow.reload();
        }
    }
});
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-platform', () => process.platform);
ipcMain.handle('get-discord-user', () => {
    if (rpc && rpc.user) {
        return { username: rpc.user.username, id: rpc.user.id };
    }
    return null;
});