const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const { execSync } = require('child_process');
const { Auth } = require('msmc');
const { Client } = require('minecraft-launcher-core');

const launcher = new Client();
let mainWindow;

// PFAD: %appdata%/minecraft.TC (Windows) oder ~/Library/Application Support/minecraft.TC (Mac)
const rootPath = path.join(app.getPath("appData"), "minecraft.TC");
if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 700, frame: false, transparent: true, resizable: true,
        icon: path.join(__dirname, 'assets', 'TENTIX.png'),
        webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
    mainWindow.on('maximize', () => mainWindow.webContents.send('window-maximized', true));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-maximized', false));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// --- FENSTER STEUERUNG & LINKS ---
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => { mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize(); });
ipcMain.on('window-close', () => mainWindow.close());
ipcMain.on('open-link', (event, url) => shell.openExternal(url));

// --- RAM ERKENNUNG ---
ipcMain.handle('get-total-ram', () => { return Math.round(os.totalmem() / (1024 * 1024 * 1024)); });

// --- MICROSOFT LOGIN ---
ipcMain.handle('ms-login', async () => {
    try {
        const authManager = new Auth("select_account");
        const xboxManager = await authManager.launch("electron");
        const token = await xboxManager.getMinecraft();
        return { success: true, name: token.profile.name, uuid: token.profile.id, mclc_token: token.mclc() };
    } catch (error) { return { success: false, error: String(error) }; }
});

// --- ALLGEMEINER DOWNLOADER ---
function downloadFile(url, dest, event, taskType) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) return resolve(downloadFile(res.headers.location, dest, event, taskType));
            const file = fs.createWriteStream(dest);
            const total = parseInt(res.headers['content-length'], 10);
            let downloaded = 0;

            res.on('data', (chunk) => {
                downloaded += chunk.length;
                if (event && total) {
                    event.sender.send('launch-progress', {
                        type: 'progress', task: Math.round(downloaded / 1024 / 1024),
                        total: Math.round(total / 1024 / 1024), taskType: taskType || 'MB'
                    });
                }
            });
            res.pipe(file);
            file.on('finish', () => file.close(() => resolve()));
        }).on('error', (err) => { fs.unlink(dest, () => reject(err)); });
    });
}

// --- JAVA SETUP ---
function getJavaVersionForMC(mcVer) {
    const minor = parseInt(mcVer.split('.')[1]);
    if (minor <= 16) return 8;
    if (minor <= 19) return 17;
    return 21;
}

function findJavaExe(dir) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findJavaExe(fullPath);
            if (res) return res;
        } else if (file === 'java.exe' || (os.platform() !== 'win32' && file === 'java')) {
            return fullPath;
        }
    }
    return null;
}

async function setupJava(mcVersion, event) {
    const javaVer = getJavaVersionForMC(mcVersion);
    const runtimeDir = path.join(rootPath, "runtime", `java${javaVer}`);
    if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });

    let javaExe = findJavaExe(runtimeDir);
    if (javaExe) return javaExe;

    event.sender.send('launch-progress', { type: 'data', text: `DOWNLOADING SYSTEM FILES...` });

    const plat = os.platform() === 'win32' ? 'windows' : (os.platform() === 'darwin' ? 'mac' : 'linux');
    const arch = os.arch() === 'arm64' ? 'aarch64' : 'x64';

    const url = `https://api.adoptium.net/v3/binary/latest/${javaVer}/ga/${plat}/${arch}/jre/hotspot/normal/eclipse`;
    const archivePath = path.join(runtimeDir, `java_archive`);

    await downloadFile(url, archivePath, event, `SYSTEM MODULE MB`);
    event.sender.send('launch-progress', { type: 'progress', task: 1, total: 1, taskType: 'UNPACKING...' });
    try {
        execSync(`tar -xf "${archivePath}" -C "${runtimeDir}"`);
        fs.unlinkSync(archivePath);
    } catch (e) { console.error("Extraction Error:", e); }

    return findJavaExe(runtimeDir);
}

// --- FABRIC SETUP ---
async function setupFabric(mcVer, event) {
    event.sender.send('launch-progress', { type: 'data', text: `VERIFYING ENGINE...` });
    return new Promise((resolve, reject) => {
        https.get(`https://meta.fabricmc.net/v2/versions/loader/${mcVer}`, (res) => {
            let data = ''; res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const loaders = JSON.parse(data);
                    if(!loaders || loaders.length === 0) return resolve(null);
                    const latest = loaders[0].loader.version;
                    const versionName = `fabric-loader-${latest}-${mcVer}`;
                    const versionDir = path.join(rootPath, 'versions', versionName);
                    if(fs.existsSync(versionDir) && fs.existsSync(path.join(versionDir, `${versionName}.json`))) return resolve(versionName);
                    event.sender.send('launch-progress', { type: 'data', text: `INSTALLING ENGINE...` });
                    fs.mkdirSync(versionDir, {recursive: true});
                    const jsonUrl = `https://meta.fabricmc.net/v2/versions/loader/${mcVer}/${latest}/profile/json`;
                    https.get(jsonUrl, (jsonRes) => {
                        let jsonData = ''; jsonRes.on('data', c => jsonData += c);
                        jsonRes.on('end', () => { fs.writeFileSync(path.join(versionDir, `${versionName}.json`), jsonData); resolve(versionName); });
                    }).on('error', reject);
                } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

// --- MODRINTH AUTO-DOWNLOADER ---
function getModrinthVersion(slug, mcVer) {
    return new Promise((resolve) => {
        const req = https.get(`https://api.modrinth.com/v2/project/${slug}/version`, {
            headers: { 'User-Agent': 'TENTIX-Client/1.0' }
        }, (res) => {
            if (res.statusCode !== 200) { res.resume(); return resolve(null); }
            let data = ''; res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const versions = JSON.parse(data);
                    const valid = versions.find(v => v.loaders.includes('fabric') && v.game_versions.includes(mcVer));
                    if(valid && valid.files && valid.files.length > 0) resolve({ url: valid.files[0].url, filename: valid.files[0].filename });
                    else resolve(null);
                } catch(e) { resolve(null); }
            });
        });
        req.on('error', () => resolve(null));
    });
}

async function installMods(mcVer, event) {
    const modsDir = path.join(rootPath, "mods");
    if (fs.existsSync(modsDir)) fs.rmSync(modsDir, { recursive: true, force: true });
    fs.mkdirSync(modsDir, { recursive: true });

    const modsToInstall = ['fabric-api', 'sodium', 'iris', 'entityculling', 'voxy'];
    event.sender.send('launch-progress', { type: 'data', text: 'SYNCING CORE MODULES...' });

    for (let i = 0; i < modsToInstall.length; i++) {
        const slug = modsToInstall[i];
        event.sender.send('launch-progress', { type: 'progress', task: i+1, total: modsToInstall.length, taskType: `CORE MODULE ${i+1}/${modsToInstall.length}` });
        const modInfo = await getModrinthVersion(slug, mcVer);
        if (modInfo) {
            const dest = path.join(modsDir, modInfo.filename);
            await downloadFile(modInfo.url, dest, null, null);
        }
    }
}

function applyDefaultMinecraftSettings() {
    const optionsPath = path.join(rootPath, 'options.txt');
    const bestSettings = { 'enableVsync': 'false', 'guiScale': '2', 'narrator': '0', 'lang': 'en_us' };
    let optionsContent = '';
    if (fs.existsSync(optionsPath)) {
        optionsContent = fs.readFileSync(optionsPath, 'utf8');
        let lines = optionsContent.split('\n');
        for (const [key, value] of Object.entries(bestSettings)) {
            let found = false;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith(key + ':')) { lines[i] = `${key}:${value}`; found = true; break; }
            }
            if (!found) lines.push(`${key}:${value}`);
        }
        optionsContent = lines.join('\n');
    } else {
        optionsContent = Object.entries(bestSettings).map(([k, v]) => `${k}:${v}`).join('\n');
    }
    fs.writeFileSync(optionsPath, optionsContent);
}

// --- MINECRAFT STARTEN ---
ipcMain.handle('launch-minecraft', async (event, options) => {
    try {
        applyDefaultMinecraftSettings();
        const customJavaPath = await setupJava(options.version, event);
        let versionOpt = { number: options.version, type: "release" };

        if (options.modloader === 'FABRIC') {
            const fabricVerName = await setupFabric(options.version, event);
            if (fabricVerName) {
                versionOpt.custom = fabricVerName;
                await installMods(options.version, event);
            } else throw new Error(`Fabric ist für Minecraft ${options.version} nicht verfügbar.`);
        }

        let opts = {
            clientPackage: null, authorization: options.token, root: rootPath, version: versionOpt,
            memory: { max: options.ram, min: "1G" }, window: { width: options.resWidth || 1920, height: options.resHeight || 1080 },
            javaPath: customJavaPath
        };

        launcher.on('download', () => event.sender.send('launch-progress', { type: 'download' }));
        launcher.on('progress', (e) => event.sender.send('launch-progress', { type: 'progress', task: e.task, total: e.total, taskType: e.type }));
        launcher.on('data', (e) => event.sender.send('launch-progress', { type: 'data', text: String(e) }));
        launcher.on('close', () => event.sender.send('launch-progress', { type: 'close' }));

        await launcher.launch(opts);
        return { success: true };
    } catch (error) {
        console.error("Launch Error:", error);
        return { success: false, error: String(error) };
    }
});