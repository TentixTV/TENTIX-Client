
    let dashUsername = '';
    let latestRelease = '1.21.11';
    let latestSnapshot = '';
    let fabricSupportedVersions = [];
    let skinChangerViewer = null;
    let uploadedSkinDataUrl = null;
    let pendingModInstall = null;
    let pendingDependency = null;
    let systemMonInterval = null;
    let maintenanceModeActive = false;
    let isClientSimulated = localStorage.getItem('tentix_is_client_simulated') === 'true';
    const API_BASE_URL = 'http://uilkgyp2338kaq7hgyj5pqwt.159.195.44.117.sslip.io';
    let eventTimerInterval = null;
    let isAppReady = false;
    let currentUserRoles = ['PLAYER'];

    let modrinthOffset = 0;
    let isFetchingMods = false;
    let isShowingInstalledModsOnly = false;
    let activeCats = [];
    let activeEnvs = [];
    let activeLoaders = [];

    function setElText(id, text) { const el = document.getElementById(id); if(el) el.innerText = text; }

    const translations = {
        en: {
            latest: "Latest Version", ready: "READY", welcome: "WELCOME, ", player: "PLAYER", play: "PLAY", loginReq: "PLEASE LOGIN!",
            settings: "Settings", logout: "Logout", reg: "REGISTERED: ", copied: "COPIED!", navStart: "START", navCosmetics: "COSMETICS", navShop: "SHOP", navExplore: "EXPLORE", online: "PLAYERS ONLINE: ",
            skinBtn: "Skin Changer", loginBtn: "Log In", userId: "USER ID: #", guest: "GUEST", ttSkin: "Coming Soon", inbox: "Inbox", setT: "Game Settings", setRam: "Allocated Memory", setRamD: "Choose how much memory should be allocated to the game instance",
            setRes: "Game Resolution", setResD: "Set the resolution of the game instance", setVis: "Launcher Visibility on Start", setVisD: "Choose what the launcher should do when the game starts",
            csTitle: "COMING SOON", csBack: "BACK", tGame: "Game", tDisc: "Discord", tPriv: "Privacy", tPriv1: "Analytics", tPrivD1: "TENTIX Client collects analytics and usage data to improve the user experience",
            tPriv2: "Optimized Ads", tPrivD2: "Whether cookies and similar technologies should be used to personalize ads based on your interests.",
            tDban1: "Join the Official TENTIX Discord", tDban2: "Get support, updates & chat with the community!", tMoj: "Not affiliated with Mojang or Microsoft", search: "Search...", keep: "Keep Open", keepD: "Launcher stays open in background", hide: "Hide", hideD: "Launcher hides once the instance appears", rec: "Recommended", high: "High Usage!", over: "Overridden",
            da: "🇩🇪 Automatic - German", de: "🇬🇧 English", free1: "You have ", free2: " GB free to allocate.", newsHeader: "News", newsEmpty: "Stay tuned for updates...",
            settingsTitle: "Client Settings", setAdsTt: "Disable this to receive no targeted advertising.\nWe are an ad-free client and value your right to shape your experience freely.",
            dcHideVisible: "Visible", dcHideHidden: "Hidden",
            discHeader: "Discord Settings", discRp: "Discord Rich Presence", discRpDesc: "Whether your game status should be displayed on Discord",
            discHide: "Hide Discord Rich Presence when away", discHideDesc: "Whether your game status should be hidden when you are away",
            discLang: "Discord Rich Presence Language", discLangDesc: "Select the language for Discord Rich Presence",
            discJoin: "Join the Official TENTIX Discord Server", discJoinDesc: "Get support, news & chat with the community!",
            loginErrTitle: "LOGIN FAILED", loginErrDesc: "We couldn't log you in to Microsoft. The process was canceled or an error occurred.", btnOk: "UNDERSTOOD", errVerTitle: "VERSION ERROR", errVerDesc: "Fabric is not available for this version.",
            updTab: "Updater", updHeader: "Client Updater", updStatTitle: "Status", updStatDesc: "Version 0.1.0 BETA is installed", updBtn: "Check for updates",
            updIdle: "Update the Launcher", updCheck: "Checking for updates...", updDl: "Downloading update...", updReady: "Update ready! Click to install.", updLatest: "You are up to date!", updLatestToast: "You are on the latest version! (v0.1.0)",
            offTitle: "NO INTERNET CONNECTION", offDesc: "Please connect to the internet or LAN to continue.",
            setRedTitle: "Redeem Code", setRedDesc: "Redeem a TENTIX code for exclusive badges or cosmetics.", setRedBtn: "ENTER CODE",
            redTitle: "REDEEM CODE", redDesc: "Enter your TENTIX code here", redBtn: "REDEEM", redChecked: "CODE REDEEMED!", redFail: "INVALID CODE!", redShort: "CODE TOO SHORT!",
            dashTitle: "Dashboard Overview", dashUsers: "User Management", dashCodes: "Code Management", dashNews: "News Editor", dashEvents: "Events", dashGen: "Generate", dashPub: "Publish News", dashUpImg: "Upload Image", dashNoCode: "No active codes.", dashTot: "Total Users", dashAct: "Active Codes", dashBan: "Banned Users", dashEdit: "Edit",
            dashAssign: "Assign Roles & Badges", dashBanSet: "Ban Settings", dashBanBtn: "BAN PLAYER", bannedTitle: "BANNED!", bannedDesc: "You have been banned from using TENTIX.", bannedReasonLbl: "Reason:", bannedUntilLbl: "Banned until:", dashStats: "Player Online Statistics", dashRev: "Cosmetic Revenue", awaitData: "Awaiting data",
            dashMsgTab: "Messages", dashMsgTitle: "Send Message", dashMsgBtn: "Send Message", notLogged: "You are not logged in.", noMessages: "No new messages.",
            noEvent: "No current events",
            modSearch: "Search Modrinth...", modSortRel: "Sort by: Relevance", modSortDl: "Sort by: Downloads", modSortNew: "Sort by: Newest", modSortUpd: "Sort by: Recently Updated", modCatTitle: "Categories", modEnvTitle: "Environment", modBtnView: "View", modBtnInstall: "Install", modStandard: "Standard in Client", modLoading: "Loading Mods...", modNoFound: "No Mods found.", modError: "Error loading Modrinth.",
            ramReset: "Restore default value",
            cosTitle: "No cosmetics available yet",
            cosDesc: "In the current beta version, no cosmetics are available. Check back soon!",
            tPlusTitle: "TENTIX <span style=\"background: linear-gradient(135deg, var(--accent-blue) 0%, #0072ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">PLUS</span>",
            tPlusDesc: "You do not have TENTIX+ to choose your extras here.<br><br>Get TENTIX+ for exclusive cosmetics, profile effects, and beta access!",
            btnBack: "BACK",
            maintText: "We are currently in maintenance mode",
            maintTooltip: "As long as the client is in maintenance mode, some functions are disabled, or those that are also affected",
            creatorCodeTooltip: "Use a Creator Code to save money and support creators!"
        },
        de: {
            latest: "Neueste Version", ready: "BEREIT", welcome: "WILLKOMMEN, ", player: "SPIELER", play: "SPIELEN", loginReq: "BITTE EINLOGGEN!",
            settings: "Einstellungen", logout: "Abmelden", reg: "REGISTRIERT: ", copied: "KOPIERT!", navStart: "START", navCosmetics: "COSMETICS", navShop: "SHOP", navExplore: "ERKUNDEN", online: "SPIELER ONLINE: ",
            skinBtn: "Skin Changer", loginBtn: "Anmelden", userId: "NUTZER ID: #", guest: "GAST", ttSkin: "Bald verfügbar", inbox: "Posteingang", setT: "Spieleinstellungen", setRam: "Zugewiesener Arbeitsspeicher", setRamD: "Wähle aus wie viel Arbeitsspeicher der Spielinstanz zugewiesen werden soll",
            setRes: "Spielauflösung", setResD: "Stelle die Auflösung der Spielinstanz ein", setVis: "Sichtbarkeit des Launchers beim Start", setVisD: "Wähle aus, welche Option der Launcher übernehmen soll",
            csTitle: "BALD VERFÜGBAR", csBack: "ZURÜCK", tGame: "Spiel", tDisc: "Discord", tPriv: "Privatsphäre", tPriv1: "Analytik", tPrivD1: "TENTIX sammelt Analyse- und Nutzungsdaten, um die Erfahrung zu verbessern",
            tPriv2: "Optimierte Werbeanzeigen", tPrivD2: "Ob Cookies verwendet werden sollen, um Werbeanzeigen to personalisieren.",
            tDban1: "Tritt dem TENTIX Discord bei", tDban2: "Erhalte Support, Updates & chatte mit der Community!", tMoj: "Not affiliated with Mojang or Microsoft", search: "Suchen...", keep: "Geöffnet lassen", keepD: "Launcher bleibt im Hintergrund geöffnet", hide: "Ausblenden", hideD: "Der Launcher wird ausgeblendet, sobald die Spielinstanz erscheint", rec: "Empfohlen", high: "Hohe Auslastung!", over: "Überschrieben",
            da: "🇩🇪 Automatisch - Deutsch", de: "🇬🇧 English", free1: "Du hast ", free2: " GB frei zum Zuweisen.", newsHeader: "Neuigkeiten", newsEmpty: "Bleib dran für Updates...",
            settingsTitle: "Client Einstellungen", setAdsTt: "Deaktiviere das um keine Werbung zu erhalten.\nWir sind ein werbefreier Client und legen Wert darauf, dass jeder sein Spielerlebnis frei gestalten kann.",
            dcHideVisible: "Sichtbar", dcHideHidden: "Versteckt",
            discHeader: "Discordeinstellungen", discRp: "Discord Rich Presence", discRpDesc: "Ob dein Spielstatus auf Discord angezeigt werden soll",
            discHide: "Discord Rich Presence bei Abwesenheit ausblenden", discHideDesc: "Ob dein Spielstatus ausgeblendet werden soll, wenn du abwesend bist",
            discLang: "Discord Rich Presence-Sprache", discLangDesc: "Wähle die Sprache für Discord Rich Presence aus",
            discJoin: "Tritt dem Offiziellen TENTIX Discord bei", discJoinDesc: "Erhalte Support, Updates & chatte mit der Community!",
            loginErrTitle: "LOGIN FEHLGESCHLAGEN", loginErrDesc: "Wir konnten dich nicht bei Microsoft einloggen. Der Vorgang wurde abgebrochen oder es trat ein Fehler auf.", btnOk: "VERSTANDEN", errVerTitle: "VERSION FEHLER", errVerDesc: "Fabric ist für diese Version nicht verfügbar.",
            updTab: "Updater", updHeader: "Client Updater", updStatTitle: "Status", updStatDesc: "Version 0.1.0 BETA installiert", updBtn: "Nach Updates suchen",
            updIdle: "Update den Launcher", updCheck: "Suche nach Updates...", updDl: "Update wird heruntergeladen...", updReady: "Update bereit! Klicken zum Installieren.", updLatest: "Du bist auf der neuesten Version!", updLatestToast: "Du bist auf der aktuellsten Version! (v0.1.0)",
            offTitle: "KEINE INTERNETVERBINDUNG", offDesc: "Bitte stelle eine Verbindung zum Internet oder LAN her, um fortzufahren.",
            setRedTitle: "Code Einlösen", setRedDesc: "Löse einen TENTIX Code für exklusive Badges oder Cosmetics ein.", setRedBtn: "CODE EINGEBEN",
            redTitle: "CODE EINLÖSEN", redDesc: "Gib deinen TENTIX Code hier ein", redBtn: "EINLÖSEN", redChecked: "CODE EINGELÖST!", redFail: "UNGÜLTIGER CODE!", redShort: "CODE ZU KURZ!",
            dashTitle: "Dashboard Übersicht", dashUsers: "Nutzerverwaltung", dashCodes: "Code-Verwaltung", dashNews: "News Editor", dashEvents: "Events", dashGen: "Erstellen", dashPub: "News Veröffentlichen", dashUpImg: "Bild Hochladen", dashNoCode: "Keine aktiven Codes.", dashTot: "Gesamte Nutzer", dashAct: "Aktive Codes", dashBan: "Gebannte Nutzer", dashEdit: "Bearbeiten",
            dashAssign: "Rollen & Badges zuweisen", dashBanSet: "Ban Einstellungen", dashBanBtn: "SPIELER BANNEN", bannedTitle: "GEBANNT!", bannedDesc: "Du wurdest von TENTIX gebannt.", bannedReasonLbl: "Grund:", bannedUntilLbl: "Gebanned bis:", dashStats: "Spieler Online Statistiken", dashRev: "Cosmetics Einnahmen", awaitData: "Erwartet Daten",
            dashMsgTab: "Nachrichten", dashMsgTitle: "Nachricht Senden", dashMsgBtn: "Senden", notLogged: "Du bist nicht angemeldet.", noMessages: "Keine neuen Nachrichten.",
            noEvent: "Derzeit keine Aktionen",
            modSearch: "Modrinth durchsuchen...", modSortRel: "Sortieren nach: Relevanz", modSortDl: "Sortieren nach: Downloads", modSortNew: "Sortieren nach: Neueste", modSortUpd: "Sortieren nach: Zuletzt aktualisiert", modCatTitle: "Kategorien", modEnvTitle: "Umgebung", modBtnView: "Ansehen", modBtnInstall: "Installieren", modStandard: "Standard im Client", modLoading: "Lade Mods...", modNoFound: "Keine Mods gefunden.", modError: "Fehler beim Laden von Modrinth.",
            ramReset: "Standard-Wert wiederherstellen",
            cosTitle: "Es gibt noch keine Cosmetics",
            cosDesc: "In der aktuellen Beta-Version stehen noch keine Cosmetics zur Verfügung. Schau bald wieder vorbei!",
            tPlusTitle: "TENTIX <span style=\"background: linear-gradient(135deg, var(--accent-blue) 0%, #0072ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">PLUS</span>",
            tPlusDesc: "Du hast kein TENTIX+ um hier deine Extras auszuwählen.<br><br>Hol dir TENTIX+ für exklusive Kosmetika, Profileffekte und Beta-Zugang!",
            btnBack: "ZURÜCK",
            maintText: "Wir sind aktuell im Wartungsmodus",
            maintTooltip: "Solange der Client im Wartungsmodus ist sind manche Funktionen deaktiviert, bzw. die auch davon betroffen sind",
            creatorCodeTooltip: "Mit einem Creator Code kannst du sparen und Creator unterstützen!"
        }
    };

    let currentLang = localStorage.getItem('tentix_lang') || 'en';
    let isLoggedIn = false;
    let savedName = 'GUEST';
    let uuidValue = 'NOT LOGGED IN';
    let regDate = '--';
    let deterministicId = '----';

    let lastVer = localStorage.getItem('tentix_last_ver') || '1.21.11';
    let currentModloader = localStorage.getItem('tentix_modloader') || 'VANILLA';
    let systemTotalRam = 8;
    let isBanned = false;
    let currentDashRole = 'GUEST';

    function initMockDB() {
        let currentAdmins = localStorage.getItem('tentix_admin_accounts');
        if (currentAdmins && (currentAdmins.includes('lok04789510') || currentAdmins.includes('sandro') || !localStorage.getItem('tentix_admin_reset_done_v2'))) {
            localStorage.removeItem('tentix_admin_accounts');
            localStorage.removeItem('tentix_last_admin_user');
            localStorage.setItem('tentix_admin_reset_done_v2', 'true');
        }
        if(!localStorage.getItem('tentix_admin_accounts')) {
            localStorage.setItem('tentix_admin_accounts', JSON.stringify([]));
        }
        if(!localStorage.getItem('tentix_pending_invites')) localStorage.setItem('tentix_pending_invites', JSON.stringify([]));

        // Load tentix_sim_users. If empty or contains old dummy users, initialize with only TN3X as owner.
        let simUsers = localStorage.getItem('tentix_sim_users');
        if (!simUsers || simUsers.includes('LukasLp')) {
            let initialUsers = [
                { username: 'TN3X', uuid: 'TN3X-uuid', roles: ['OWNER', 'DEV', 'ADMIN', 'PLAYER'], is_banned: false, ban_reason: '' }
            ];
            localStorage.setItem('tentix_sim_users', JSON.stringify(initialUsers));
        } else {
            let users = JSON.parse(simUsers);
            let tn3xExists = users.some(u => u.username === 'TN3X');
            if (!tn3xExists) {
                users.unshift({ username: 'TN3X', uuid: 'TN3X-uuid', roles: ['OWNER', 'DEV', 'ADMIN', 'PLAYER'], is_banned: false, ban_reason: '' });
            }
            localStorage.setItem('tentix_sim_users', JSON.stringify(users));
        }
    }
    initMockDB();

    async function fetchFabricVersions() {
        try {
            const res = await fetch('https://meta.fabricmc.net/v2/versions/game');
            const data = await res.json();
            if (Array.isArray(data)) {
                fabricSupportedVersions = data.map(item => item.version);
            }
        } catch(e) {
            console.error("Failed to load Fabric supported versions:", e);
            fabricSupportedVersions = ['1.14', '1.14.1', '1.14.2', '1.14.3', '1.14.4', '1.15', '1.15.1', '1.15.2', '1.16', '1.16.1', '1.16.2', '1.16.3', '1.16.4', '1.16.5', '1.17', '1.17.1', '1.18', '1.18.1', '1.18.2', '1.19', '1.19.1', '1.19.2', '1.19.3', '1.19.4', '1.20', '1.20.1', '1.20.2', '1.20.3', '1.20.4', '1.20.5', '1.20.6', '1.21', '1.21.1'];
        }
    }

    async function loadMinecraftVersions() {
        try {
            const res = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json');
            const data = await res.json();
            if (data && data.latest) {
                latestRelease = data.latest.release;
                latestSnapshot = data.latest.snapshot;
                
                // Get the first 10 releases
                const releases = data.versions
                    .filter(v => v.type === 'release')
                    .map(v => v.id)
                    .slice(0, 10);
                
                const container = document.getElementById('version-overlay');
                if (container) {
                    container.innerHTML = '';
                    
                    // Add Latest Release
                    container.innerHTML += `
                        <div class="v-item" onclick="selectVer('${latestRelease}', event)">
                            <span class="latest-text" style="color:var(--accent-blue); font-size:10px;">LATEST RELEASE</span>
                            <span>${latestRelease}</span>
                        </div>
                    `;
                    
                    // Add Latest Snapshot
                    if (latestSnapshot) {
                        container.innerHTML += `
                            <div class="v-item" onclick="selectVer('${latestSnapshot}', event)">
                                <span class="latest-text" style="color:#ffb84d; font-size:10px;">LATEST SNAPSHOT</span>
                                <span>${latestSnapshot}</span>
                            </div>
                        `;
                    }
                    
                    // Add other releases
                    releases.forEach(ver => {
                        if (ver !== latestRelease) {
                            container.innerHTML += `
                                <div class="v-item" onclick="selectVer('${ver}', event)">${ver}</div>
                            `;
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Failed to load Minecraft versions:", e);
            const container = document.getElementById('version-overlay');
            if (container) {
                container.innerHTML = `
                    <div class="v-item" onclick="selectVer('1.21.1', event)"><span class="latest-text" style="color:var(--accent-blue); font-size:10px;">LATEST RELEASE</span><span>1.21.1</span></div>
                    <div class="v-item" onclick="selectVer('1.20.4', event)">1.20.4</div>
                    <div class="v-item" onclick="selectVer('1.19.4', event)">1.19.4</div>
                    <div class="v-item" onclick="selectVer('1.18.2', event)">1.18.2</div>
                    <div class="v-item" onclick="selectVer('1.16.5', event)">1.16.5</div>
                    <div class="v-item" onclick="selectVer('1.8.9', event)">1.8.9</div>
                `;
            }
        }
    }

    function showToast(msg, type = 'success') {
        if(!isAppReady && type !== 'error') return;
        const toast = document.getElementById('toast');
        if(!toast) return;
        toast.innerText = msg;
        toast.className = 'show';
        let color = type === 'success' ? '#00ff80' : type === 'error' ? '#ff4b4b' : '#ffb84d';
        toast.style.color = color;
        toast.style.borderColor = color;
        toast.style.boxShadow = `0 0 20px ${color}40`;
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.color = "var(--accent-blue)";
                toast.style.borderColor = "var(--accent-blue)";
                toast.style.boxShadow = "0 0 20px rgba(var(--accent-blue-rgb), 0.2)";
            }, 400);
        }, 3000);
    }

    function checkBanStatus() {
        if(localStorage.getItem('tentix_ban_status') === 'true') {
            isBanned = true;
            document.getElementById('banned-overlay').classList.add('show');
            document.getElementById('ui-ban-reason').innerText = localStorage.getItem('tentix_ban_reason') || 'Regelverstoß';
        }
    }

    function sendHeartbeatPing() {
        let activeUser = null;
        if (isLoggedIn && savedName !== 'GUEST') activeUser = savedName;
        else if (currentDashRole !== 'GUEST' && dashUsername !== '') activeUser = dashUsername;

        if (activeUser) {
            fetch(`${API_BASE_URL}/api/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: activeUser })
            }).catch(e => {});
        }
    }

    function startHeartbeat() {
        sendHeartbeatPing();
        setInterval(() => {
            sendHeartbeatPing();
            if(document.getElementById('dashboard-overlay').style.display === 'block') {
                fetchDashboardStats();
            }
        }, 60000);

        setInterval(() => {
            if(document.getElementById('main-menu-wrapper').style.display !== 'none') {
                initOnlineCounter();
                if(isAppReady) fetchEvents();
            }
        }, 10000);
    }

    const ROLE_ORDER = ['OWNER', 'DEV', 'ADMIN', 'MOD', 'SUPP', 'CREATOR', 'TWITCH', 'YT', 'ALPHA', 'BETA', 'DONATOR', 'VIPP', 'VIP', 'PLAYER'];

    const ROLE_MAP = {
        'OWNER': { name: 'Owner', color: '#ffaa00', bg: 'rgba(255,170,0,0.1)', border: 'rgba(255,170,0,0.3)', svg: '<path d="M12 2L16 9L22 4L19 18H5L2 4L8 9L12 2Z M5 20H19V22H5V20Z"/>' },
        'DEV': { name: 'Developer', color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)', svg: '<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>' },
        'ADMIN': { name: 'Admin', color: '#ff4b4b', bg: 'rgba(255,75,75,0.1)', border: 'rgba(255,75,75,0.3)', svg: '<path d="M12 2S3 5 3 12c0 5.25 4.5 9.25 9 10 4.5-.75 9-4.75 9-10 0-7-9-10-9-10zm0 18.4c-3.1-.64-6.4-3.71-6.4-8.4V6.37l6.4-2.13 6.4 2.13v5.63c0 4.69-3.3 7.76-6.4 8.4z"/>' },
        'MOD': { name: 'Moderator', color: '#00ff80', bg: 'rgba(0,255,128,0.1)', border: 'rgba(0,255,128,0.3)', svg: '<path d="M9 22H2v-2h7v2z M5.41 20L2 16.59 12.59 6 16 9.41 5.41 20z M15 3.59L19.41 8 22 5.41 17.59 1 15 3.59z"/>' },
        'SUPP': { name: 'Supporter', color: '#ffb84d', bg: 'rgba(255,184,77,0.1)', border: 'rgba(255,184,77,0.3)', svg: '<path d="M12 2c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>' },
        'CREATOR': { name: 'Content Creator', color: '#ffcc00', bg: 'rgba(255,204,0,0.1)', border: 'rgba(255,204,0,0.3)', svg: '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>' },
        'TWITCH': { name: 'Twitch', color: '#9146FF', bg: 'rgba(145,70,255,0.1)', border: 'rgba(145,70,255,0.3)', svg: '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>' },
        'ALPHA': { name: 'Alpha Tester', color: '#ffb84d', bg: 'rgba(255,184,77,0.1)', border: 'rgba(255,184,77,0.3)', svg: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>' },
        'BETA': { name: 'Beta Tester', color: '#888', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', svg: '<path d="M18.7 15.3L13 7.7V4h1V2H10v2h1v3.7L5.3 15.3c-.6.8-.2 2 .8 2.4.3.1.6.3.9.3h10c1.1 0 2-.9 2-2 0-.3-.1-.6-.3-.7zM7.5 16L11 11.3V4h2v7.3l3.5 4.7H7.5z"/>' },
        'DONATOR': { name: 'Unterstützer', color: '#ff66b2', bg: 'rgba(255,102,178,0.1)', border: 'rgba(255,102,178,0.3)', svg: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' },
        'YT': { name: 'YouTuber', color: '#ff0000', bg: 'rgba(255,0,0,0.1)', border: 'rgba(255,0,0,0.3)', svg: '<path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>' },
        'VIPP': { name: 'VIP+', color: '#ff9d00', bg: 'rgba(255, 157, 0, 0.1)', border: 'rgba(255, 157, 0, 0.3)', svg: '<path d="M6 2L2 8l10 14 10-14-4-6H6zm1.36 2h9.28L18.3 6H5.7l1.66-2zM12 19L5.3 8h13.4L12 19z"/>' },
        'VIP': { name: 'VIP', color: '#00e1ff', bg: 'rgba(0, 225, 255, 0.1)', border: 'rgba(0, 225, 255, 0.3)', svg: '<path d="M6 2L2 8l10 14 10-14-4-6H6zm1.36 2h9.28L18.3 6H5.7l1.66-2zM12 19L5.3 8h13.4L12 19z"/>' },
        'PLAYER': { name: 'Spieler', color: '#fff', bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.2)', svg: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>' }
    };

    function toggleInstalledFilter(element) {
        if (!element) return;
        isShowingInstalledModsOnly = !isShowingInstalledModsOnly;
        
        element.classList.toggle('active', isShowingInstalledModsOnly);
        
        if (isShowingInstalledModsOnly) {
            // Reset active categories to make it clean
            document.querySelectorAll('#cat-filters .filter-btn').forEach(btn => {
                if (btn.id !== 'installed-filter-tab') {
                    btn.classList.remove('active');
                    btn.setAttribute('data-state', '0');
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }
            });
            activeCats = [];
        }
        
        modrinthOffset = 0;
        triggerModSearch(false);
    }

    function toggleCat(el) {
        if (isShowingInstalledModsOnly) {
            isShowingInstalledModsOnly = false;
            const installedBtn = document.getElementById('installed-filter-tab');
            if (installedBtn) installedBtn.classList.remove('active');
        }

        const state = el.getAttribute('data-state');
        const val = el.getAttribute('data-val');
        const parentId = el.parentNode.id;

        if (state === "0") {
            el.setAttribute('data-state', "1");
            if (parentId === 'cat-filters') activeCats.push(val);
            if (parentId === 'env-filters') activeEnvs.push(val);
            if (parentId === 'loader-filters') activeLoaders.push(val);
        } else if (state === "1") {
            el.setAttribute('data-state', "2");
        } else {
            el.setAttribute('data-state', "0");
            if (parentId === 'cat-filters') activeCats = activeCats.filter(i => i !== val);
            if (parentId === 'env-filters') activeEnvs = activeEnvs.filter(i => i !== val);
            if (parentId === 'loader-filters') activeLoaders = activeLoaders.filter(i => i !== val);
        }
        modrinthOffset = 0;
        triggerModSearch(false);
    }

    function expandCats(btn) {
        const catButtons = Array.from(document.querySelectorAll('#cat-filters .filter-btn:not(#expand-cats-btn)'));
        const hasHidden = catButtons.some(b => b.style.display === 'none');
        if (hasHidden) {
            catButtons.forEach(b => b.style.display = 'flex');
            btn.innerText = currentLang === 'de' ? "Weniger anzeigen ▲" : "Show Less ▲";
        } else {
            catButtons.forEach((b, idx) => {
                if (idx >= 6) b.style.display = 'none';
            });
            btn.innerText = currentLang === 'de' ? "Weitere anzeigen ▼" : "Show More ▼";
        }
    }

    async function triggerModSearch(isLoadMore = false) {
        const query = document.getElementById('mod-search-input').value;
        const sort = document.getElementById('mod-sort-select').value;
        const versionFilter = document.getElementById('mod-ver-select').value;
        const box = document.getElementById('explore-results-box');

        if(!isLoadMore) {
            box.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modLoading}</div>`;
            modrinthOffset = 0;
        }

        isFetchingMods = true;

        if (isShowingInstalledModsOnly) {
            if (isLoadMore) {
                isFetchingMods = false;
                return;
            }
            const installed = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
            if (installed.length === 0) {
                box.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">${currentLang === 'de' ? 'Keine installierten Mods gefunden.' : 'No installed mods found.'}</div>`;
                isFetchingMods = false;
                return;
            }
            try {
                const res = await fetch(`https://api.modrinth.com/v2/projects?ids=${encodeURIComponent(JSON.stringify(installed))}`);
                const data = await res.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    let hits = data.map(mod => ({
                        slug: mod.slug,
                        project_id: mod.id,
                        id: mod.id,
                        title: mod.title,
                        description: mod.description,
                        icon_url: mod.icon_url,
                        downloads: mod.downloads || 0,
                        categories: mod.categories || [],
                        date_modified: mod.updated || mod.published || new Date().toISOString(),
                        client_side: mod.client_side,
                        server_side: mod.server_side,
                        author: 'Modrinth'
                    }));

                    const searchVal = query.toLowerCase().trim();
                    if (searchVal) {
                        hits = hits.filter(mod => mod.title.toLowerCase().includes(searchVal) || mod.description.toLowerCase().includes(searchVal));
                    }

                    if (hits.length === 0) {
                        box.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modNoFound}</div>`;
                        isFetchingMods = false;
                        return;
                    }

                    let html = '';
                    const standardMods = ['fabric-api', 'sodium', 'iris', 'lithium', 'modmenu'];
                    hits.forEach(mod => {
                        let tagsHtml = mod.categories.slice(0, 3).map(c => `<span class="mod-tag">${c}</span>`).join('');
                        let dlCount = (mod.downloads / 1000000).toFixed(2) + "M";
                        let date = new Date(mod.date_modified).toLocaleDateString();

                        let isStandard = standardMods.includes(mod.slug);
                        let installBtnHtml = '';
                        const dataInstalled = currentLang === 'de' ? '✓ Installiert' : '✓ Installed';
                        const dataUninstall = currentLang === 'de' ? 'Deinstallieren' : 'Uninstall';
                        installBtnHtml = `<div class="mod-btn installed-btn" data-installed="${dataInstalled}" data-uninstall="${dataUninstall}" onclick="uninstallMod('${mod.id}', '${mod.title.replace(/'/g, "\\'")}', this)"></div>`;

                        let envTags = '';
                        if(mod.client_side !== 'unsupported') envTags += `<span class="mod-env-badge"><svg viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg> Client</span>`;
                        if(mod.server_side !== 'unsupported') envTags += `<span class="mod-env-badge"><svg viewBox="0 0 24 24"><path d="M20 3H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 5H5V5h14v3zm1 5H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-1 5H5v-3h14v3z"/></svg> Server</span>`;

                        html += `
                            <div class="mod-card">
                                <img src="${mod.icon_url || '../assets/TENTIX.png'}" class="mod-icon" onerror="this.src='../assets/TENTIX.png'">
                                <div class="mod-info">
                                    <div class="mod-title-row">
                                        <div class="mod-title">${mod.title}</div>
                                    </div>
                                    <div class="mod-desc">${mod.description}</div>
                                    <div class="mod-meta">
                                        <div class="mod-author"><img src="${mod.icon_url || '../assets/TENTIX.png'}" onerror="this.src='../assets/TENTIX.png'"> ${mod.author || 'Unbekannt'}</div>
                                        ${tagsHtml}
                                        ${envTags}
                                    </div>
                                </div>
                                <div class="mod-actions">
                                    <div class="mod-stats-install-wrap">
                                        <div class="mod-stats">⬇ ${dlCount} • ${date}</div>
                                        <div style="display:flex; gap:10px;">
                                            <div class="mod-btn btn-view" onclick="if(window.api) window.api.openExternalLink('https://modrinth.com/mod/${mod.slug}')">${translations[currentLang].modBtnView}</div>
                                            ${installBtnHtml}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    box.innerHTML = html;
                } else {
                    box.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modNoFound}</div>`;
                }
            } catch (e) {
                box.innerHTML = `<div style="color: #ff4b4b; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modError}</div>`;
            }
            isFetchingMods = false;
            return;
        }

        let url = `https://api.modrinth.com/v2/search?limit=15&offset=${modrinthOffset}&query=${encodeURIComponent(query)}&index=${sort}`;

        let facets = [];
        if (activeLoaders.length > 0) {
            facets.push(activeLoaders.map(l => `categories:${l}`));
        } else {
            facets.push(['categories:fabric', 'categories:forge', 'categories:quilt', 'categories:neoforge']);
        }
        if(versionFilter) facets.push([`versions:${versionFilter}`]);
        if (activeCats.length > 0) facets.push(activeCats.map(c => `categories:${c}`));

        if (activeEnvs.length > 0) {
            let envFacets = [];
            activeEnvs.forEach(e => {
                document.querySelectorAll(`#env-filters .filter-btn[data-val="${e}"]`).forEach(btn => {
                    const state = btn.getAttribute('data-state');
                    if(state === "1") envFacets.push(`${e}_side:required`);
                    if(state === "2") envFacets.push(`${e}_side:unsupported`);
                });
            });
            if(envFacets.length > 0) facets.push(envFacets);
        }

        if (facets.length > 0) url += `&facets=${encodeURIComponent(JSON.stringify(facets))}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.hits && data.hits.length > 0) {
                let html = '';
                const standardMods = ['fabric-api', 'sodium', 'iris', 'lithium', 'modmenu'];

                data.hits.forEach(mod => {
                    let tagsHtml = mod.categories.slice(0, 3).map(c => `<span class="mod-tag">${c}</span>`).join('');
                    let dlCount = (mod.downloads / 1000000).toFixed(2) + "M";
                    let date = new Date(mod.date_modified).toLocaleDateString();

                    let isStandard = standardMods.includes(mod.slug);
                    const installed = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
                    let isInstalled = installed.includes(mod.project_id || mod.id || mod.slug);

                    let installBtnHtml = '';
                    if (isStandard) {
                        installBtnHtml = `<div class="mod-btn btn-install disabled" title="${translations[currentLang].modStandard}">✓ ${translations[currentLang].modStandard}</div>`;
                    } else if (isInstalled) {
                        const dataInstalled = currentLang === 'de' ? '✓ Installiert' : '✓ Installed';
                        const dataUninstall = currentLang === 'de' ? 'Deinstallieren' : 'Uninstall';
                        installBtnHtml = `<div class="mod-btn installed-btn" data-installed="${dataInstalled}" data-uninstall="${dataUninstall}" onclick="uninstallMod('${mod.project_id || mod.id || mod.slug}', '${mod.title.replace(/'/g, "\\'")}', this)"></div>`;
                    } else {
                        installBtnHtml = `<div class="mod-btn btn-install" onclick="installMod('${mod.project_id || mod.id || mod.slug}', '${mod.title.replace(/'/g, "\\'")}', this)"><svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> ${translations[currentLang].modBtnInstall}</div>`;
                    }

                    let envTags = '';
                    if(mod.client_side !== 'unsupported') envTags += `<span class="mod-env-badge"><svg viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg> Client</span>`;
                    if(mod.server_side !== 'unsupported') envTags += `<span class="mod-env-badge"><svg viewBox="0 0 24 24"><path d="M20 3H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 5H5V5h14v3zm1 5H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-1 5H5v-3h14v3z"/></svg> Server</span>`;

                    html += `
                        <div class="mod-card">
                            <img src="${mod.icon_url || '../assets/TENTIX.png'}" class="mod-icon" onerror="this.src='../assets/TENTIX.png'">
                            <div class="mod-info">
                                <div class="mod-title-row">
                                    <div class="mod-title">${mod.title}</div>
                                </div>
                                <div class="mod-desc">${mod.description}</div>
                                <div class="mod-meta">
                                    <div class="mod-author"><img src="${mod.icon_url || '../assets/TENTIX.png'}" onerror="this.src='../assets/TENTIX.png'"> ${mod.author || 'Unbekannt'}</div>
                                    ${tagsHtml}
                                    ${envTags}
                                </div>
                            </div>
                            <div class="mod-actions">
                                <div class="mod-stats-install-wrap">
                                    <div class="mod-stats">⬇ ${dlCount} • ${date}</div>
                                    <div style="display:flex; gap:10px;">
                                        <div class="mod-btn btn-view" onclick="if(window.api) window.api.openExternalLink('https://modrinth.com/mod/${mod.slug}')">${translations[currentLang].modBtnView}</div>
                                        ${installBtnHtml}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                if(isLoadMore) box.innerHTML += html;
                else box.innerHTML = html;
            } else {
                if(!isLoadMore) box.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modNoFound}</div>`;
            }
        } catch (e) {
            if(!isLoadMore) box.innerHTML = `<div style="color: #ff4b4b; font-style: italic; text-align: center; margin-top: 50px;">${translations[currentLang].modError}</div>`;
        }
        isFetchingMods = false;
    }

    function handleExploreScroll() {
        const box = document.getElementById('explore-results-box');
        if (box && box.scrollTop + box.clientHeight >= box.scrollHeight - 100) {
            if (!isFetchingMods) {
                modrinthOffset += 15;
                triggerModSearch(true);
            }
        }
    }

    async function loadBadges() {
        const container = document.getElementById('ui-badges-container');
        if(!container) return;
        if(!isLoggedIn) { container.style.display = 'none'; return; }

        let rolesToUse = [];
        regDate = '--';

        const cleanName = (savedName || '').trim().toUpperCase();

        // Check local override first so TN3X always gets badges immediately if not yet in database
        if (cleanName === 'TN3X') {
            rolesToUse = ['OWNER', 'PLAYER'];
        } else {
            rolesToUse = ['PLAYER'];
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users`);
            const data = await res.json();
            if(data.success) {
                let userObj = data.users.find(u => {
                    const dbUuid = (u.uuid || '').trim().toLowerCase();
                    const clientUuid = (uuidValue || '').trim().toLowerCase();
                    const dbUser = (u.username || '').trim().toUpperCase();
                    return dbUuid === clientUuid || (dbUser && cleanName && dbUser === cleanName);
                });
                
                // Real-time Database Ban Enforcement
                if(userObj) {
                    if (userObj.is_banned) {
                        localStorage.setItem('tentix_ban_status', 'true');
                        localStorage.setItem('tentix_ban_reason', userObj.ban_reason || 'Regelverstoß');
                        checkBanStatus();
                    } else {
                        localStorage.removeItem('tentix_ban_status');
                        localStorage.removeItem('tentix_ban_reason');
                    }
                }

                if(userObj && userObj.roles) {
                    let dbRoles = typeof userObj.roles === 'string' ? JSON.parse(userObj.roles) : userObj.roles;
                    if (cleanName === 'TN3X') {
                        rolesToUse = dbRoles;
                        if (!rolesToUse.includes('OWNER')) rolesToUse.push('OWNER');
                    } else {
                        rolesToUse = dbRoles;
                    }
                }

                if(userObj && userObj.created_at) {
                    regDate = new Date(userObj.created_at).toLocaleDateString();
                }
            }
        } catch(e) {
            console.error("loadBadges API error:", e);
            // If offline/error, check localStorage database users cache as a secondary fallback
            let users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
            let userObj = users.find(u => {
                const dbUuid = (u.uuid || '').trim().toLowerCase();
                const clientUuid = (uuidValue || '').trim().toLowerCase();
                const dbUser = (u.username || '').trim().toUpperCase();
                return dbUuid === clientUuid || (dbUser && cleanName && dbUser === cleanName);
            });
            if (userObj && userObj.roles) {
                if (cleanName === 'TN3X') {
                    rolesToUse = userObj.roles;
                    if (!rolesToUse.includes('OWNER')) rolesToUse.push('OWNER');
                } else {
                    rolesToUse = userObj.roles;
                }
            }
            if (userObj && userObj.created_at) {
                regDate = new Date(userObj.created_at).toLocaleDateString();
            }
        }

        if(document.getElementById('ui-card-reg')) {
            document.getElementById('ui-card-reg').innerText = (currentLang === 'de' ? "REGISTRIERT: " : "REGISTERED: ") + regDate;
        }

        rolesToUse.sort((a, b) => {
            let indexA = ROLE_ORDER.indexOf(a);
            let indexB = ROLE_ORDER.indexOf(b);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
        });

        currentUserRoles = rolesToUse;
        
        const activeCape = equippedCosmetic || localStorage.getItem('tentix_equipped_cosmetic');
        if (activeCape && activeCape !== 'none') {
            const capeObj = COSMETICS_LIST.find(c => c.id === activeCape);
            if (capeObj) {
                const hasAccess = rolesToUse.some(r => capeObj.roles.includes(r));
                if (!hasAccess) {
                    equippedCosmetic = null;
                    localStorage.removeItem('tentix_equipped_cosmetic');
                    if (cosmeticsViewer) {
                        cosmeticsViewer.loadCape(null);
                    }
                    showToast(currentLang === 'de' ? "Dein ausgerüstetes Cape wurde entfernt, da du die benötigte Rolle nicht mehr besitzt." : "Your equipped cape was removed because you no longer hold the required role.", "warning");
                }
            }
        }

        updateCosmeticsLocks();

        const rolesToDisplay = rolesToUse.filter(role => role !== 'PLAYER');

        if(rolesToDisplay.length > 0) {
            container.style.display = 'flex';
            container.innerHTML = '';
            rolesToDisplay.forEach(role => {
                let rData = ROLE_MAP[role];
                if(rData) {
                    let onclickEvent = '';
                    if (role === 'DEV' || role === 'ADMIN' || role === 'OWNER') {
                        onclickEvent = `onclick="secretAdminBypass('${role}', event)"`;
                    }
                    container.innerHTML += `
                        <div class="tooltip tooltip-up" style="display:flex; align-items:center; justify-content:center; width: 18px; height: 18px; border-radius: 4px; background: ${rData.bg}; border: 1px solid ${rData.border}; color: ${rData.color}; cursor: pointer;" ${onclickEvent}>
                            <svg viewBox="0 0 24 24" style="width: 10px; height: 10px; fill: currentColor;">${rData.svg}</svg>
                            <span class="tooltiptext">${rData.name}</span>
                        </div>
                    `;
                }
            });
        } else {
            container.style.display = 'none';
        }
    }

    function loadInbox() {
        const content = document.getElementById('inbox-content');
        const t = translations[currentLang];
        if(!content) return;

        if(!isLoggedIn) {
            content.innerHTML = `<div style="padding: 20px; text-align: center; color: #888; font-style: italic;">${t.notLogged}</div>`;
            return;
        }

        let msgs = JSON.parse(localStorage.getItem('tentix_db_messages') || '[]');
        let myMsgs = msgs.filter(m => m.to === '@everyone' || m.to.toUpperCase() === '@' + savedName.toUpperCase());

        if(myMsgs.length === 0) {
            content.innerHTML = `<div style="padding: 20px; text-align: center; color: #888; font-style: italic;">${t.noMessages}</div>`;
            const badge = document.getElementById('bell-badge');
            if(badge) { badge.classList.add('empty'); badge.classList.remove('show'); }
            return;
        }

        let html = '';
        myMsgs.slice().reverse().forEach((m, displayIndex) => {
            let realIndex = msgs.indexOf(m);
            let escapedText = m.text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            let imgBg = (m.img && m.img !== '') ? m.img : '../assets/TENTIX.png';

            html += `
                <div class="inbox-item">
                    <div class="inbox-box" style="background-image: url('${imgBg}');"></div>
                    <div class="inbox-lines" onclick="openMsgModal('${m.img}', '${escapedText}')">
                        <div style="font-size: 10px; color: #fff; font-weight: 800; margin-bottom: 2px;">TENTIX TEAM</div>
                        <div style="font-size: 10px; color: #888; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.text}</div>
                    </div>
                    <div class="inbox-delete" onclick="deleteMessage(${realIndex}, event)"><svg viewBox="0 0 24 24" style="width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
                </div>
            `;
        });
        content.innerHTML = html;

        const badge = document.getElementById('bell-badge');
        if(badge) {
            if(myMsgs.length > 0) {
                badge.innerText = myMsgs.length;
                badge.classList.remove('empty');
                badge.classList.add('show');
            } else {
                badge.classList.add('empty');
                badge.classList.remove('show');
            }
        }
    }

    function deleteMessage(realIndex, event) {
        if(event) event.stopPropagation();
        let msgs = JSON.parse(localStorage.getItem('tentix_db_messages') || '[]');
        msgs.splice(realIndex, 1);
        localStorage.setItem('tentix_db_messages', JSON.stringify(msgs));
        loadInbox();
    }

    function openMsgModal(imgSrc, text) {
        closeAllPopups();
        const modal = document.getElementById('msg-read-modal');
        const imgEl = document.getElementById('msg-read-img');
        const textEl = document.getElementById('msg-read-text');

        if(imgSrc && imgSrc !== '' && imgSrc !== 'undefined') {
            imgEl.src = imgSrc;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
        textEl.innerText = text;

        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; modal.classList.add('show'); }, 10);
        }
    }

    function closeMsgModal() {
        const modal = document.getElementById('msg-read-modal');
        if(modal) {
            modal.style.opacity = '0';
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
    }

    function filterUsers(val) {
        const box = document.getElementById('dash-msg-autocomplete');
        if(!val.startsWith('@') || val.length < 2) { box.style.display = 'none'; return; }

        let search = val.substring(1).toUpperCase();

        fetch(`${API_BASE_URL}/api/users`).then(res => res.json()).then(data => {
            if(data.success) {
                let html = `<div class="search-result-item" onclick="selectUser('@everyone')" style="font-weight: 800; color: var(--accent-blue);">@everyone</div>`;
                data.users.filter(u => u.username.toUpperCase().includes(search)).forEach(u => {
                    let badgesHtml = '';
                    let roles = u.roles || ['PLAYER'];
                    if(typeof roles === 'string') roles = JSON.parse(roles);

                    roles.forEach(r => {
                        if (r === 'PLAYER') return;
                        if(ROLE_MAP[r]) badgesHtml += `<svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: ${ROLE_MAP[r].color}; margin-left: 2px;">${ROLE_MAP[r].svg}</svg>`;
                    });

                    html += `
                        <div class="search-result-item" style="display:flex; align-items:center; gap:10px;" onclick="selectUser('@${u.username}')">
                            <img src="https://minotar.net/avatar/${u.username}/20" style="border-radius:4px; width: 20px; height: 20px;">
                            <span style="font-weight: 700; color: #fff;">@${u.username}</span>
                            <div style="display: flex;">${badgesHtml}</div>
                        </div>
                    `;
                });
                box.innerHTML = html;
                box.style.display = 'block';
            }
        });
    }

    function selectUser(name) {
        if(document.getElementById('dash-msg-rec')) document.getElementById('dash-msg-rec').value = name;
        if(document.getElementById('dash-msg-autocomplete')) document.getElementById('dash-msg-autocomplete').style.display = 'none';
    }

    function sendDashMessage() {
        const to = document.getElementById('dash-msg-rec').value;
        const text = document.getElementById('dash-msg-txt').value;
        const imgName = document.getElementById('msg-file-name').innerText;
        if(!to || !text) return;

        let mockImgPath = imgName !== 'Kein Bild ausgewählt' ? '../assets/TENTIX.png' : '';
        let msgs = JSON.parse(localStorage.getItem('tentix_db_messages') || '[]');
        msgs.push({
            to: to,
            text: text,
            img: mockImgPath
        });
        localStorage.setItem('tentix_db_messages', JSON.stringify(msgs));

        document.getElementById('dash-msg-rec').value = '';
        document.getElementById('dash-msg-txt').value = '';
        document.getElementById('msg-file-name').innerText = 'Kein Bild ausgewählt';

        showToast("NACHRICHT GESENDET", "success");
        loadInbox();
    }

    const SHOP_PRODUCTS = [];

    let currentShopCategory = 'all';

    function updateShopBalanceDisplay() {
        const balanceEl = document.getElementById('shop-user-balance');
        if (balanceEl) {
            const coins = parseInt(localStorage.getItem('tentix_coins') || '500', 10);
            balanceEl.innerText = `${coins} Coins`;
        }
    }

    async function syncCreatorCodes() {
        if (isClientSimulated) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/creator-codes`);
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('tentix_creator_codes', JSON.stringify(data.codes));
            }
        } catch (e) {}
    }

    function loadShop() {
        syncCreatorCodes();
        const grid = document.getElementById('shop-products-grid');
        if (!grid) return;

        updateShopBalanceDisplay();

        let html = '';
        const filtered = SHOP_PRODUCTS.filter(p => currentShopCategory === 'all' || p.category === currentShopCategory);

        if (filtered.length === 0) {
            const noItemsText = currentLang === 'de' ? 'Derzeit sind keine Artikel verfügbar.' : 'No items are currently available.';
            html = `
                <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--text-gray); text-align: center; gap: 15px; width: 100%;">
                    <svg viewBox="0 0 24 24" style="width: 64px; height: 64px; fill: rgba(255,255,255,0.15);">
                        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
                    </svg>
                    <div style="font-size: 15px; font-weight: 700; color: #fff; letter-spacing: 0.5px;">${noItemsText}</div>
                </div>
            `;
        } else {
            filtered.forEach(p => {
                const description = currentLang === 'de' ? p.desc_de : p.desc_en;
                const badgeHtml = p.badge ? `<div class="shop-product-badge">${p.badge}</div>` : '';
                
                let priceHtml = '';
                if (p.priceType === 'coins') {
                    priceHtml = `
                        <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: #ffd700; filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                        </svg>
                        <span>${p.price} Coins</span>
                    `;
                } else {
                    priceHtml = `<span>€${p.price.toFixed(2)}</span>`;
                }

                const buyText = currentLang === 'de' ? 'Hinzufügen' : 'Add to Cart';
                const previewBtnHtml = p.cosmeticId ? `<button class="shop-product-preview" onclick="previewCosmeticInShop('${p.cosmeticId}', event)">Vorschau</button>` : '';

                html += `
                    <div class="shop-product-card" id="shop-card-${p.id}">
                        ${badgeHtml}
                        <div class="shop-product-icon">
                            ${p.icon}
                        </div>
                        <div class="shop-product-title">${p.title}</div>
                        <div class="shop-product-desc" title="${description}">${description}</div>
                        <div class="shop-product-price">
                            ${priceHtml}
                        </div>
                        <div style="display: flex; gap: 8px; width: 100%; margin-top: auto; align-items: center; justify-content: center;">
                            ${previewBtnHtml}
                            <button class="shop-product-buy" style="flex: 1;" onclick="addToCart('${p.id}')">${buyText}</button>
                        </div>
                    </div>
                `;
            });
        }

        grid.innerHTML = html;
    }

    function filterShop(category, btn) {
        currentShopCategory = category;
        const parent = document.getElementById('shop-category-filters');
        if (parent) {
            parent.querySelectorAll('.shop-cat-btn').forEach(b => b.classList.remove('active'));
        }
        if (btn) btn.classList.add('active');
        loadShop();
    }

    function buyProduct(id) {
        const product = SHOP_PRODUCTS.find(p => p.id === id);
        if (!product) return;

        if (product.priceType === 'coins') {
            const currentCoins = parseInt(localStorage.getItem('tentix_coins') || '500', 10);
            if (currentCoins < product.price) {
                showToast(currentLang === 'de' ? 'Nicht genügend Coins!' : 'Not enough coins!', 'error');
                return;
            }

            const title = currentLang === 'de' ? 'Kauf bestätigen' : 'Confirm Purchase';
            const message = currentLang === 'de' 
                ? `Möchtest du "${product.title}" für ${product.price} Coins kaufen?`
                : `Do you want to buy "${product.title}" for ${product.price} Coins?`;
            
            showCustomConfirm(title, message, '', 'var(--accent-blue)', () => {
                const newBalance = currentCoins - product.price;
                localStorage.setItem('tentix_coins', newBalance);
                
                // Grant features
                if (id === 'tentix_plus_pass') {
                    if (!currentUserRoles.includes('VIP')) {
                        currentUserRoles.push('VIP');
                    }
                    if (!currentUserRoles.includes('BETA')) {
                        currentUserRoles.push('BETA');
                    }
                    localStorage.setItem('tentix_current_user_roles', JSON.stringify(currentUserRoles));
                    updateCosmeticsLocks();
                } else if (id === 'elite_cape') {
                    if (!currentUserRoles.includes('VIP')) {
                        currentUserRoles.push('VIP');
                        localStorage.setItem('tentix_current_user_roles', JSON.stringify(currentUserRoles));
                    }
                    localStorage.setItem('tentix_unlocked_elite_cape', 'true');
                    updateCosmeticsLocks();
                } else if (id === 'neon_wings') {
                    localStorage.setItem('tentix_unlocked_neon_wings', 'true');
                } else if (id === 'premium_chest') {
                    localStorage.setItem('tentix_unlocked_premium_chest', 'true');
                }

                updateShopBalanceDisplay();
                loadShop();
                showToast(currentLang === 'de' ? 'Kauf erfolgreich!' : 'Purchase successful!', 'success');
            });
        } else {
            // EUR purchase simulation
            const title = currentLang === 'de' ? 'Coins aufladen' : 'Buy Coins';
            const message = currentLang === 'de'
                ? `Möchtest du "${product.title}" für €${product.price.toFixed(2)} erwerben? (Simulation)`
                : `Would you like to purchase "${product.title}" for €${product.price.toFixed(2)}? (Simulation)`;
            
            showCustomConfirm(title, message, currentLang === 'de' ? 'Zahlungsmethode: Simulation' : 'Payment Method: Simulation', '#00ff80', () => {
                const currentCoins = parseInt(localStorage.getItem('tentix_coins') || '500', 10);
                let coinsToAdd = 250;
                if (id === 'coins_pack_medium') coinsToAdd = 1100; // 1000 + 100 bonus
                else if (id === 'coins_pack_large') coinsToAdd = 2850; // 2500 + 350 bonus
                
                const newBalance = currentCoins + coinsToAdd;
                localStorage.setItem('tentix_coins', newBalance);
                
                updateShopBalanceDisplay();
                loadShop();
                showToast(currentLang === 'de' ? `${coinsToAdd} Coins erhalten!` : `Received ${coinsToAdd} coins!`, 'success');
            });
        }
    }

    async function loadNews() {
        try {
            const content = document.getElementById('ui-news-content');
            const dashList = document.getElementById('dash-news-list');
            if(!content || !dashList) return;

            let news = [];
            if (isClientSimulated) {
                news = JSON.parse(localStorage.getItem('tentix_sim_news') || '[]');
                if (news.length === 0) {
                    news = [
                        {
                            id: 1,
                            title: "Willkommen im Tentix Client!",
                            content: "Viel Spaß beim Spielen auf unserem Server. Wir arbeiten stetig an neuen Updates.\n\nHave fun playing on our server. We are constantly working on new updates.",
                            image_url: "",
                            created_at: new Date().toISOString()
                        }
                    ];
                    localStorage.setItem('tentix_sim_news', JSON.stringify(news));
                }
            } else {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/news`);
                    const data = await res.json();
                    if (data.success) {
                        news = data.news;
                        localStorage.setItem('tentix_db_news', JSON.stringify(news));
                    }
                } catch (err) {
                    news = JSON.parse(localStorage.getItem('tentix_db_news') || '[]');
                }
            }

            let maintenanceCardHtml = '';
            if (maintenanceModeActive) {
                const deactivatedList = [];
                const deactivatedListEn = [];
                if (isFeatureDeactivated('play')) { deactivatedList.push('Spielen'); deactivatedListEn.push('Playing'); }
                if (isFeatureDeactivated('explore')) { deactivatedList.push('Erkunden'); deactivatedListEn.push('Explore'); }
                if (isFeatureDeactivated('cosmetics')) { deactivatedList.push('Cosmetics'); deactivatedListEn.push('Cosmetics'); }
                if (isFeatureDeactivated('shop')) { deactivatedList.push('Shop'); deactivatedListEn.push('Shop'); }
                if (isFeatureDeactivated('tentixplus')) { deactivatedList.push('TENTIX+'); deactivatedListEn.push('TENTIX+'); }

                let detailsTextDe = 'Derzeit finden Wartungsarbeiten am System statt. Einige Funktionen stehen vorübergehend nicht zur Verfügung. Vielen Dank für dein Verständnis!';
                let detailsTextEn = 'System maintenance is currently in progress. Some features may be temporarily unavailable. Thank you for your patience!';

                if (deactivatedList.length > 0) {
                    if (deactivatedList.length === 1) {
                        detailsTextDe = `Wir arbeiten gerade an: ${deactivatedList[0]}. Diese Funktion steht vorübergehend nicht zur Verfügung.`;
                        detailsTextEn = `We are currently working on: ${deactivatedListEn[0]}. This feature is temporarily unavailable.`;
                    } else {
                        detailsTextDe = `Wir arbeiten gerade an: ${deactivatedList.join(', ')}. Diese Funktionen stehen vorübergehend nicht zur Verfügung.`;
                        detailsTextEn = `We are currently working on: ${deactivatedListEn.join(', ')}. These features are temporarily unavailable.`;
                    }
                }

                maintenanceCardHtml = `
                    <div style="background: rgba(255, 75, 75, 0.08); border: 1px solid rgba(255, 75, 75, 0.35); padding: 30px 24px 45px 24px; border-radius: 12px; width: 100%; box-shadow: 0 0 20px rgba(255, 75, 75, 0.15); margin-bottom: 15px; position: relative; overflow: hidden; box-sizing: border-box;">
                        <div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 75, 75, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <div style="position: relative; width: 7px; height: 7px; display: flex; align-items: center; justify-content: center;">
                                <div style="position: absolute; width: 7px; height: 7px; background-color: #ff4b4b; border-radius: 50%;"></div>
                                <div style="position: absolute; width: 16px; height: 16px; border: 1.5px solid #ff4b4b; border-radius: 50%; animation: maintPulse 1.8s infinite;"></div>
                            </div>
                            <span style="font-weight: 900; font-size: 10px; color: #ff4b4b; letter-spacing: 2px; text-transform: uppercase;">SYSTEM STATUS</span>
                        </div>
                        <div class="gradient-text-red" style="font-weight: 800; font-size: 13px; margin-bottom: 8px; text-transform: uppercase;">
                            ${currentLang === 'de' ? 'WARTUNGSARBEITEN AKTIV' : 'MAINTENANCE ACTIVE'}
                        </div>
                        <div style="font-size: 12px; color: #eee; line-height: 1.6; text-align: left; margin-bottom: 12px;">
                            ${currentLang === 'de' ? detailsTextDe : detailsTextEn}
                        </div>
                    </div>
                `;
            } else {
                const lastMaint = localStorage.getItem('tentix_last_maintenance');
                let lastMaintText = '--';
                if (lastMaint) {
                    try {
                        const dateObj = new Date(lastMaint);
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const year = dateObj.getFullYear();
                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        lastMaintText = `${day}.${month}.${year}, ${hours}:${minutes}`;
                    } catch (e) {
                        lastMaintText = lastMaint;
                    }
                }
                const systemStatusText = currentLang === 'de' ? 'Alle Systeme laufen normal' : 'All systems operational';
                const lastMaintLabel = currentLang === 'de' ? `Letzte Wartung: ${lastMaintText}` : `Last Maintenance: ${lastMaintText}`;

                maintenanceCardHtml = `
                    <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); padding: 28px 24px 34px 24px; border-radius: 12px; width: 100%; box-shadow: 0 0 15px rgba(0, 212, 255, 0.08); margin-bottom: 15px; position: relative; overflow: hidden; box-sizing: border-box;">
                        <div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%); pointer-events: none;"></div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <div style="position: relative; width: 7px; height: 7px; display: flex; align-items: center; justify-content: center;">
                                <div style="position: absolute; width: 7px; height: 7px; background-color: #00ff80; border-radius: 50%;"></div>
                                <div style="position: absolute; width: 16px; height: 16px; border: 1.5px solid #00ff80; border-radius: 50%; animation: healthyPulse 1.8s infinite;"></div>
                            </div>
                            <span style="font-weight: 900; font-size: 10px; color: #00ff80; letter-spacing: 2px; text-transform: uppercase;">SYSTEM STATUS</span>
                        </div>
                        <div style="font-weight: 800; font-size: 13px; color: #fff; margin-bottom: 8px;">
                            ${systemStatusText}
                        </div>
                        <div style="font-size: 11px; color: var(--text-gray); text-align: left; margin-top: 2px;">
                            ${lastMaintLabel}
                        </div>
                    </div>
                `;
            }

            const statusContainer = document.getElementById('news-status-container');
            if (statusContainer) {
                statusContainer.innerHTML = maintenanceCardHtml;
            }
            let html = '';
            let dashHtml = '';

            if(news.length > 0) {
                news.forEach(n => {
                    let imgHtml = '';
                    let cardStyle = 'background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; width: 100%; margin-bottom: 15px; box-sizing: border-box;';
                    let titleColor = 'var(--accent-blue)';

                    if (n.image_url === 'MAINTENANCE_RED') {
                        if (!maintenanceModeActive) return;
                        imgHtml = `
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100px; background: rgba(255, 75, 75, 0.1); border: 1px dashed rgba(255, 75, 75, 0.3); border-radius: 8px; margin-bottom: 10px;">
                                <svg viewBox="0 0 24 24" style="width: 40px; height: 40px; fill: none; stroke: #ff4b4b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 0 10px rgba(255,75,75,0.4));">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
                                </svg>
                            </div>
                        `;
                        cardStyle = 'background: rgba(255, 75, 75, 0.05); border: 1px solid rgba(255, 75, 75, 0.2); padding: 20px; border-radius: 12px; width: 100%; box-shadow: 0 0 15px rgba(255, 75, 75, 0.1); margin-bottom: 15px; box-sizing: border-box;';
                        titleColor = '#ff4b4b';
                    } else if (n.image_url) {
                        imgHtml = `<div style="width:100%; height:120px; background:url('${n.image_url}') center/cover no-repeat; border-radius:8px; margin-bottom:10px;"></div>`;
                    }

                    html += `
                        <div style="${cardStyle}">
                            ${imgHtml}
                            <div style="font-weight: 800; font-size: 14px; color: ${titleColor}; margin-bottom: 8px; text-transform: uppercase;">${n.title}</div>
                            <div style="font-size: 12px; color: #ccc; line-height: 1.5; white-space: pre-line; text-align: left;">${n.content}</div>
                        </div>
                    `;

                    dashHtml += `
                        <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); padding: 12px 18px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
                            <div>
                                <div style="font-weight: 800; color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">${n.title}</div>
                                <div style="font-size: 10px; color: #555; font-weight: 600; margin-top: 2px;">ID: ${n.id}</div>
                            </div>
                            <div class="dash-btn" style="background: rgba(255, 75, 75, 0.1); border: 1px solid #ff4b4b; color: #ff4b4b; padding: 6px 12px; margin: 0; font-size: 10px; font-weight: 800;" onclick="deleteNews(${n.id})">Löschen</div>
                        </div>
                    `;
                });
                content.innerHTML = html;
                dashList.innerHTML = dashHtml;
            } else {
                content.innerHTML = `<div class="news-empty-card" id="t-news-empty">${translations[currentLang].newsEmpty || "Stay tuned for updates..."}</div>`;
                dashList.innerHTML = `<div style="color:#888; font-style:italic; font-size:12px;">Keine News veröffentlicht.</div>`;
            }
        } catch(e) {
            console.error("loadNews error:", e);
        }
    }

    async function publishNews() {
        const title = document.getElementById('dash-news-title').value;
        const content = document.getElementById('dash-news-content').value;
        const imgName = document.getElementById('news-file-name').innerText;

        if(!title || !content) return;
        let mockImgPath = imgName !== 'Kein Bild ausgewählt' ? '../assets/TENTIX.png' : '';

        if (isClientSimulated) {
            let news = JSON.parse(localStorage.getItem('tentix_sim_news') || '[]');
            news.unshift({
                id: Date.now(),
                title,
                content,
                image_url: mockImgPath,
                created_at: new Date().toISOString()
            });
            localStorage.setItem('tentix_sim_news', JSON.stringify(news));
            document.getElementById('dash-news-title').value = '';
            document.getElementById('dash-news-content').value = '';
            document.getElementById('news-file-name').innerText = 'Kein Bild ausgewählt';
            showToast("NEWS VERÖFFENTLICHT! (Simulation)", "success");
            loadNews();
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/api/news/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, image_url: mockImgPath })
            });
            document.getElementById('dash-news-title').value = '';
            document.getElementById('dash-news-content').value = '';
            document.getElementById('news-file-name').innerText = 'Kein Bild ausgewählt';
            showToast("NEWS VERÖFFENTLICHT", "success");
            loadNews();
        } catch(e) {
            showToast("FEHLER BEIM PUBLISHEN", "error");
        }
    }

    async function deleteNews(id) {
        if (isClientSimulated) {
            let news = JSON.parse(localStorage.getItem('tentix_sim_news') || '[]');
            news = news.filter(n => n.id !== id);
            localStorage.setItem('tentix_sim_news', JSON.stringify(news));
            showToast("NEWS GELÖSCHT (Simulation)", "warning");
            loadNews();
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/api/news/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            showToast("NEWS GELÖSCHT", "warning");
            loadNews();
        } catch(e) {}
    }

    function updateEventPreview() {
        let txt = document.getElementById('dash-event-de').value;
        if(txt.includes('{time}')) txt = txt.replace('{time}', '<span id="ann-countdown">00:00:00</span>');
        if(document.getElementById('dash-event-preview')) document.getElementById('dash-event-preview').innerHTML = txt || "Dein Text hier...";
    }

    let currentEventData = null;

    function renderEventCountdown() {
        if(!currentEventData) return;
        const txtEl = document.getElementById('announcement-text');
        if(!txtEl) return;

        let txt = currentLang === 'de' ? currentEventData.message_de : currentEventData.message_en;

        if(currentEventData.expires_at) {
            const exp = new Date(currentEventData.expires_at).getTime();
            const now = Date.now();
            const diff = exp - now;

            if(diff <= 0) {
                deleteEvent();
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

            const timeStr = `<span id="ann-countdown">${h}:${m}:${s}</span>`;
            if(txt.includes('{time}')) {
                txtEl.innerHTML = txt.replace('{time}', timeStr);
            } else {
                txtEl.innerHTML = txt;
            }
        } else {
            txtEl.innerHTML = txt.replace('{time}', '');
        }
    }

    async function fetchEvents() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/events`);
            const data = await res.json();
            const bar = document.getElementById('announcement-bar');

            if(data.success && data.event) {
                currentEventData = data.event;
                renderEventCountdown();

                if(eventTimerInterval) clearInterval(eventTimerInterval);
                if(data.event.expires_at) {
                    eventTimerInterval = setInterval(renderEventCountdown, 1000);
                }

                if(document.getElementById('main-menu-wrapper').style.display !== 'none' && !document.getElementById('play-container-wrapper').classList.contains('news-open')) {
                    if(bar) bar.classList.add('show');
                }
            } else {
                currentEventData = null;
                const t = translations[currentLang];
                if(document.getElementById('announcement-text')) document.getElementById('announcement-text').innerText = t.noEvent;

                if(!sessionStorage.getItem('tentix_no_event_shown') && isAppReady && document.getElementById('main-menu-wrapper').style.display !== 'none') {
                    if(bar) bar.classList.add('show');
                    sessionStorage.setItem('tentix_no_event_shown', 'true');
                    setTimeout(() => {
                        if(!currentEventData && bar) bar.classList.remove('show');
                    }, 5000);
                } else if(!currentEventData) {
                    if(bar) bar.classList.remove('show');
                }

                if(eventTimerInterval) clearInterval(eventTimerInterval);
            }
        } catch(e) {}
    }

    async function publishEvent() {
        const msg = document.getElementById('dash-event-de').value;
        const dur = parseInt(document.getElementById('dash-event-dur').value) || 0;
        if(!msg) return;

        try {
            await fetch(`${API_BASE_URL}/api/events/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message_de: msg, duration_hours: dur })
            });
            showToast("EVENT GESTARTET", "success");
            document.getElementById('dash-event-de').value = '';
            updateEventPreview();
            fetchEvents();
        } catch(e) {}
    }

    async function deleteEvent() {
        try {
            await fetch(`${API_BASE_URL}/api/events/delete`, { method: 'POST' });
            if(isAppReady) showToast("EVENT BEENDET", "warning");
            fetchEvents();
        } catch(e) {}
    }

    if(document.getElementById('redeem-input-field')) {
        document.getElementById('redeem-input-field').addEventListener('input', function (e) {
            let target = e.target;
            let val = target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            let formatted = val.match(/.{1,4}/g)?.join('-') || val;
            target.value = formatted.substring(0, 14);
        });
    }

    if(document.getElementById('dash-new-code')) {
        document.getElementById('dash-new-code').addEventListener('input', function (e) {
            let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            let formatted = val.match(/.{1,4}/g)?.join('-') || val;
            e.target.value = formatted.substring(0, 14);
        });
    }

    function secretAdminBypass(role, e) {
        if(e) e.stopPropagation();
        closeAllPopups();
        
        if (sessionStorage.getItem('tentix_admin_logged_in') !== 'true') {
            openDashLogin(role);
            return;
        }

        closeDashLogin();

        currentDashRole = sessionStorage.getItem('tentix_current_dash_role') || role || 'DEV';
        dashUsername = sessionStorage.getItem('tentix_dash_username') || 'TN3X';
        sendHeartbeatPing();

        const dbRevCard = document.getElementById('db-rev-card');
        if (dbRevCard) {
            if (dashUsername === 'TN3X') {
                dbRevCard.style.display = 'block';
            } else {
                dbRevCard.style.display = 'none';
            }
        }

        const adminsTabBtn = document.getElementById('t-dash-admins-tab');
        if(adminsTabBtn) {
            if(currentDashRole === 'DEV' || currentDashRole === 'OWNER') adminsTabBtn.style.display = 'block';
            else adminsTabBtn.style.display = 'none';
        }

        const simClientBtn = document.getElementById('dash-sim-client-btn');
        if(simClientBtn) {
            if(currentDashRole === 'DEV' || currentDashRole === 'OWNER') {
                simClientBtn.style.display = 'block';
                updateSimulationButtonText();
            } else {
                simClientBtn.style.display = 'none';
            }
        }

        const dash = document.getElementById('dashboard-overlay');
        if(dash) {
            dash.style.display = 'block';
            setTimeout(() => {
                dash.style.opacity = '1';
                switchDashTab('dash-tab-home', document.getElementById('t-dash-home'));
                fetchDashboardStats();
                renderDashboardChart();
                renderCodesTable();
                renderUsersTable();
                loadNews();
            }, 10);
        }
    }

    let pendingBypassRole = null;

    function openDashLogin(role) {
        closeAllPopups();
        if(role) pendingBypassRole = role;

        // Check if already logged in
        if (sessionStorage.getItem('tentix_admin_logged_in') === 'true') {
            secretAdminBypass(sessionStorage.getItem('tentix_current_dash_role') || pendingBypassRole);
            return;
        }

        const modal = document.getElementById('dash-login-modal');
        if(modal) {
            const regForm = document.getElementById('dash-reg-form');
            const loginForm = document.getElementById('dash-login-form');

            if (regForm && loginForm) {
                regForm.style.display = 'none';
                loginForm.style.display = 'none';

                fetch(`${API_BASE_URL}/api/admins/count`)
                    .then(res => res.json())
                    .then(data => {
                        const isRegistered = data.success && data.count > 0;
                        if (isRegistered) {
                            regForm.style.display = 'none';
                            loginForm.style.display = 'block';
                            
                            const lastUser = localStorage.getItem('tentix_last_admin_user') || '';
                            if (document.getElementById('dash-user')) {
                                document.getElementById('dash-user').value = lastUser;
                                setTimeout(() => {
                                    if (lastUser && document.getElementById('dash-pass')) {
                                        document.getElementById('dash-pass').focus();
                                    }
                                }, 50);
                            }
                        } else {
                            regForm.style.display = 'block';
                            loginForm.style.display = 'none';
                        }
                    })
                    .catch(() => {
                        // Fallback to localStorage accounts if offline
                        let admins = JSON.parse(localStorage.getItem('tentix_admin_accounts') || '[]');
                        const isRegistered = admins.length > 0;
                        if (isRegistered) {
                            regForm.style.display = 'none';
                            loginForm.style.display = 'block';
                        } else {
                            regForm.style.display = 'block';
                            loginForm.style.display = 'none';
                        }
                    });
            }

            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; modal.classList.add('show'); }, 10);
        }
    }

    function closeDashLogin() {
        const modal = document.getElementById('dash-login-modal');
        if(modal) {
            modal.style.opacity = '0';
            modal.classList.remove('show');
            setTimeout(() => { 
                modal.style.display = 'none'; 
                if(document.getElementById('dash-user')) document.getElementById('dash-user').value=''; 
                if(document.getElementById('dash-pass')) document.getElementById('dash-pass').value=''; 
                if(document.getElementById('dash-reg-email')) document.getElementById('dash-reg-email').value='';
                if(document.getElementById('dash-reg-user')) document.getElementById('dash-reg-user').value='';
                if(document.getElementById('dash-reg-pass')) document.getElementById('dash-reg-pass').value='';
                if(document.getElementById('dash-reg-pass-confirm')) document.getElementById('dash-reg-pass-confirm').value='';
            }, 300);
        }
    }

    function submitDashRegister() {
        const email = document.getElementById('dash-reg-email').value.trim();
        const user = document.getElementById('dash-reg-user').value.trim();
        const pass = document.getElementById('dash-reg-pass').value;
        const passConfirm = document.getElementById('dash-reg-pass-confirm').value;

        if (!email || !user || !pass || !passConfirm) {
            showToast("BITTE ALLE FELDER AUSFÜLLEN", "error");
            return;
        }
        if (pass !== passConfirm) {
            showToast("PASSWÖRTER STIMMEN NICHT ÜBEREIN", "error");
            return;
        }
        if (pass.length < 4) {
            showToast("PASSWORT ZU KURZ (MIN. 4 ZEICHEN)", "error");
            return;
        }

        const assignedRole = pendingBypassRole || 'DEV';

        fetch(`${API_BASE_URL}/api/admins/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username: user, password: pass, role: assignedRole })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('tentix_last_admin_user', user);
                sessionStorage.setItem('tentix_admin_logged_in', 'true');
                sessionStorage.setItem('tentix_current_dash_role', assignedRole);
                sessionStorage.setItem('tentix_dash_username', user);
                showToast("ADMIN KONTO ERFOLGREICH ERSTELLT", "success");
                secretAdminBypass(assignedRole);
            } else {
                showToast(data.error || "FEHLER BEIM ERSTELLEN DES KONTOS", "error");
            }
        })
        .catch(() => {
            showToast("VERBINDUNGSFEHLER ZUM BACKEND", "error");
        });
    }

    function submitDashLogin() {
        const userOrEmail = document.getElementById('dash-user').value.trim();
        const pass = document.getElementById('dash-pass').value;

        if (!userOrEmail || !pass) {
            showToast("BITTE BENUTZERNAME UND PASSWORT EINGEBEN", "error");
            return;
        }

        fetch(`${API_BASE_URL}/api/admins/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userOrEmail, password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.needsPasswordSetup) {
                    const newPass = prompt(currentLang === 'de' ? "Ein Passwort-Setup ist erforderlich. Bitte gib dein neues Passwort ein (mind. 4 Zeichen):" : "Password setup required. Please enter your new password (min. 4 chars):");
                    if (newPass && newPass.length >= 4) {
                        fetch(`${API_BASE_URL}/api/admins/setup-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: data.username, password: newPass })
                        })
                        .then(r => r.json())
                        .then(setupData => {
                            if (setupData.success) {
                                showToast(currentLang === 'de' ? "Passwort erfolgreich eingerichtet! Logge dich erneut ein." : "Password setup successful! Please log in again.", "success");
                            } else {
                                showToast(setupData.error || "Setup fehlgeschlagen", "error");
                            }
                        })
                        .catch(() => showToast("Verbindungsfehler", "error"));
                    } else {
                        showToast(currentLang === 'de' ? "Ungültiges Passwort!" : "Invalid password!", "error");
                    }
                    return;
                }
                localStorage.setItem('tentix_last_admin_user', data.username);
                sessionStorage.setItem('tentix_admin_logged_in', 'true');
                sessionStorage.setItem('tentix_current_dash_role', data.role);
                sessionStorage.setItem('tentix_dash_username', data.username);
                showToast("ERFOLGREICH ANGEMELDET", "success");
                secretAdminBypass(data.role);
            } else {
                showToast(data.error || "ZUGRIFF VERWEIGERT", "error");
            }
        })
        .catch(() => {
            showToast("VERBINDUNGSFEHLER ZUM BACKEND", "error");
        });
    }

    function dashLogout() {
        sessionStorage.removeItem('tentix_admin_logged_in');
        sessionStorage.removeItem('tentix_current_dash_role');
        sessionStorage.removeItem('tentix_dash_username');
        closeDashboard();
        showToast("ERFOLGREICH ABGEMELDET", "info");
    }

    function animateCounters() {
        document.querySelectorAll('.dash-counter').forEach(el => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0');
            const duration = 1000; // 1s
            const start = 0;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress * (2 - progress); // Ease out quad
                const currentVal = start + (target - start) * easeProgress;
                
                if (decimals > 0 || prefix === '$') {
                    el.innerText = prefix + currentVal.toFixed(decimals) + suffix;
                } else {
                    el.innerText = prefix + Math.floor(currentVal) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
    }

    async function fetchDashboardStats() {
        if (isClientSimulated) {
            const totEl = document.getElementById('db-total-users');
            const actEl = document.getElementById('db-active-codes');
            const banEl = document.getElementById('db-banned-users');
            const revEl = document.getElementById('db-cosmetic-rev');

            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            let simCodes = JSON.parse(localStorage.getItem('tentix_sim_codes') || '[]');

            let totalUsers = 1284 + simUsers.length;
            let activeCodes = simCodes.length;
            let bannedUsers = simUsers.filter(u => u.is_banned).length;
            let cosmeticRev = 0.00;

            if(totEl) totEl.setAttribute('data-target', totalUsers);
            if(actEl) actEl.setAttribute('data-target', activeCodes);
            if(banEl) banEl.setAttribute('data-target', bannedUsers);
            if(revEl) revEl.setAttribute('data-target', cosmeticRev);

            animateCounters();

            const onlineCountEl = document.getElementById('online-count');
            const simulatedOnlinePlayers = Math.floor(Math.random() * 251) + 1400; // 1400-1650
            if(onlineCountEl) onlineCountEl.innerText = simulatedOnlinePlayers;
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/stats`);
            const data = await res.json();
            if(data.success) {
                const totEl = document.getElementById('db-total-users');
                const actEl = document.getElementById('db-active-codes');
                const banEl = document.getElementById('db-banned-users');
                const revEl = document.getElementById('db-cosmetic-rev');

                if(totEl) totEl.setAttribute('data-target', data.totalUsers);
                if(actEl) actEl.setAttribute('data-target', data.activeCodes);
                if(banEl) banEl.setAttribute('data-target', data.bannedUsers);
                if(revEl) revEl.setAttribute('data-target', data.cosmeticRev || 0);

                animateCounters();

                const onlineCountEl = document.getElementById('online-count');
                if(onlineCountEl) onlineCountEl.innerText = data.onlinePlayers;
            }
        } catch(e) {}
    }

    async function renderDashboardChart() {
        const filter = document.getElementById('dash-chart-filter').value;
        const container = document.getElementById('main-chart-container');
        if(!container) return;
        try {
            let dataList = [];
            if (isClientSimulated) {
                dataList = getSimulatedChartData(filter);
            } else {
                const res = await fetch(`${API_BASE_URL}/api/chart?filter=${filter}`);
                const data = await res.json();
                if (data.success) {
                    dataList = data.data;
                }
            }

            if(dataList.length > 0) {
                let html = '';
                let maxVal = Math.max(...dataList.map(d => Math.max(d.avg, d.peak, d.bans, 1)));
                dataList.forEach(d => {
                    let h1 = (d.avg / maxVal) * 100;
                    let h2 = (d.peak / maxVal) * 100;
                    let h3 = (d.bans / maxVal) * 100;

                    let style1 = h1 > 0 ? `height:${h1}%;` : 'height:3px; background:rgba(255,255,255,0.05);';
                    let style2 = h2 > 0 ? `height:${h2}%;` : 'height:3px; background:rgba(255,255,255,0.05);';
                    let style3 = h3 > 0 ? `height:${h3}%;` : 'height:3px; background:rgba(255,255,255,0.05);';

                    html += `
                    <div class="chart-group">
                        <div class="chart-bar bar-1" style="${style1}" title="Avg: ${d.avg}"></div>
                        <div class="chart-bar bar-2" style="${style2}" title="Peak: ${d.peak}"></div>
                        <div class="chart-bar bar-3" style="${style3}" title="Bans: ${d.bans}"></div>
                        <div class="chart-lbl">${d.label}</div>
                    </div>`;
                });
                container.innerHTML = html;
            } else {
                container.innerHTML = '<div style="color:#888; font-style:italic; width:100%; text-align:center; padding-top:50px;">Keine Chart-Daten verfügbar.</div>';
            }
        } catch(e) {
            container.innerHTML = '<div style="color:#ff4b4b; font-style:italic; width:100%; text-align:center; padding-top:50px;">Fehler beim Laden der Chart-Daten.</div>';
        }
    }

    function switchDashTab(tabId, el) {
        document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
        if(document.getElementById(tabId)) document.getElementById(tabId).classList.add('active');
        if(el) el.classList.add('active');
        if(tabId === 'dash-tab-home') { fetchDashboardStats(); renderDashboardChart(); }
        else if(tabId === 'dash-tab-codes') { renderCodesTable(); renderCreatorCodesTable(); }
        else if(tabId === 'dash-tab-users') { renderUsersTable(); }
        else if(tabId === 'dash-tab-admins') { renderInvitesTable(); renderTeamTable(); }
        else if(tabId === 'dash-tab-news') { loadNews(); }
        else if(tabId === 'dash-tab-system') { startSystemMonitoring(); }
        else if(tabId === 'dash-tab-bans') { renderBansTable(); }
        else if(tabId === 'dash-tab-permissions') { loadRolePermissions(); }
        else if(tabId === 'dash-tab-maintenance') { loadMaintenanceTab(); }
    }

    function closeDashboard() {
        const dash = document.getElementById('dashboard-overlay');
        if(dash) {
            dash.style.opacity = '0';
            setTimeout(() => { dash.style.display = 'none'; if(document.getElementById('dash-pass')) document.getElementById('dash-pass').value = ''; currentDashRole = 'GUEST'; dashUsername = ''; }, 400);
        }
    }

    async function renderUsersTable() {
        const tbody = document.getElementById('dash-users-tbody');
        if(!tbody) return;

        let users = [];
        if (isClientSimulated) {
            users = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            if (users.length === 0 || users.some(u => u.username === 'LukasLp')) {
                users = [
                    { username: 'TN3X', uuid: 'TN3X-uuid', roles: ['OWNER', 'DEV', 'ADMIN', 'PLAYER'], is_banned: false, ban_reason: '' }
                ];
                localStorage.setItem('tentix_sim_users', JSON.stringify(users));
            }
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users`);
                if(!res.ok) throw new Error();
                const data = await res.json();
                if(data.success) {
                    users = data.users;
                    localStorage.setItem('tentix_db_users', JSON.stringify(users));
                }
            } catch(e) {
                users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
            }
        }

        if(users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic; padding:20px;">Keine Benutzer gefunden.</td></tr>`;
            return;
        }

        let html = '';
        users.forEach(u => {
            let roles = u.roles || ['PLAYER'];
            if(typeof roles === 'string') roles = JSON.parse(roles);

            roles.sort((a, b) => {
                let indexA = ROLE_ORDER.indexOf(a);
                let indexB = ROLE_ORDER.indexOf(b);
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });

            let roleHtml = roles.map(r => `<span style="background:${ROLE_MAP[r]?.bg||'#333'}; color:${ROLE_MAP[r]?.color||'#fff'}; padding:2px 6px; border-radius:4px; font-size:9px; font-weight:800; margin-right:4px;">${r}</span>`).join('');
            html += `<tr>
                <td style="color:#fff; font-weight:700;">${u.username}</td>
                <td class="copy-hover" style="font-family:monospace; font-size:10px; cursor:pointer;" onclick="copyDashUUID('${u.uuid}')" title="Click to copy">${u.uuid}</td>
                <td>${roleHtml}</td>
                <td><div class="dash-action-btn" onclick="openUserEditModal('${u.username}', '${u.uuid}')">Bearbeiten</div></td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    function copyDashUUID(uuidText) {
        navigator.clipboard.writeText(uuidText).then(() => {
            showToast("UUID KOPIERT!", "success");
        });
    }

    let editUserTarget = null;
    let editUserUuid = null;
    async function openUserEditModal(username, uuid) {
        editUserTarget = username;
        editUserUuid = uuid;
        if(document.getElementById('edit-modal-name')) document.getElementById('edit-modal-name').innerText = username;
        if(document.getElementById('edit-modal-uuid')) document.getElementById('edit-modal-uuid').innerText = 'UUID: ' + uuid;
        const modal = document.getElementById('dash-edit-modal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; modal.classList.add('show'); }, 10);
        }

        let userObj = {roles: [], is_banned: false, ban_reason: ''};
        if (isClientSimulated) {
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            userObj = simUsers.find(u => u.uuid === uuid) || {roles:[], is_banned: false, ban_reason: ''};
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users`);
                if(!res.ok) throw new Error();
                const data = await res.json();
                if(data.success) {
                    userObj = data.users.find(u => u.uuid === uuid) || {roles:[], is_banned: false, ban_reason: ''};
                }
            } catch(e) {
                let users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
                userObj = users.find(u => u.uuid === uuid) || {roles:[], is_banned: false, ban_reason: ''};
            }
        }

        let roles = userObj.roles || [];
        if(typeof roles === 'string') roles = JSON.parse(roles);

        document.querySelectorAll('.role-check-row').forEach(row => {
            const r = row.getAttribute('data-role');
            if(roles.includes(r)) row.classList.add('active');
            else row.classList.remove('active');
            row.onclick = function() {
                if (editUserTarget && editUserTarget.trim().toUpperCase() === 'TN3X' && r === 'OWNER') {
                    showToast(currentLang === 'de' ? "Owner-Rolle kann von TN3X nicht entfernt werden!" : "Owner role cannot be removed from TN3X!", "warning");
                    return;
                }
                this.classList.toggle('active');
            };
        });

        // Set Ban Input & Button dynamically
        if(document.getElementById('t-dash-banreason')) {
            document.getElementById('t-dash-banreason').value = userObj.ban_reason || '';
        }
        const banBtn = document.getElementById('t-dash-banbtn');
        if(banBtn) {
            if (userObj.is_banned) {
                banBtn.innerText = currentLang === 'de' ? "SPIELER ENTBANNEN" : "UNBAN PLAYER";
                banBtn.style.background = "#00ff80";
                banBtn.style.color = "#000";
                banBtn.onclick = function() { unbanUser(username, uuid); };
            } else {
                banBtn.innerText = currentLang === 'de' ? "SPIELER BANNEN" : "BAN PLAYER";
                banBtn.style.background = "#ff4b4b";
                banBtn.style.color = "#fff";
                banBtn.onclick = function() { mockBanUser(); };
            }
        }
    }

    function closeUserEditModal() {
        const modal = document.getElementById('dash-edit-modal');
        if(modal) {
            modal.style.opacity = '0';
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; editUserTarget = null; editUserUuid = null;}, 300);
        }
    }

    async function saveUserEditModal() {
        if(!editUserUuid) return;

        // 1. Permission check
        if (!hasPermission('CanEditRoles')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zum Bearbeiten von Rollen!" : "No permission to edit roles!", "error");
            return;
        }

        // 2. Rank priority security check (cannot edit users with equal or higher rank priorities)
        const operatorIdx = ROLE_ORDER.indexOf(currentDashRole);
        let storedUsers = [];
        if (isClientSimulated) {
            storedUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
        } else {
            storedUsers = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
        }

        const targetUserObj = storedUsers.find(u => u.uuid === editUserUuid);
        if (targetUserObj) {
            let targetRoles = targetUserObj.roles || ['PLAYER'];
            if (typeof targetRoles === 'string') targetRoles = JSON.parse(targetRoles);

            const getHighestRolePriority = (roles) => {
                let minIdx = ROLE_ORDER.length;
                roles.forEach(r => {
                    const idx = ROLE_ORDER.indexOf(r);
                    if (idx !== -1 && idx < minIdx) minIdx = idx;
                });
                return minIdx;
            };

            const targetIdx = getHighestRolePriority(targetRoles);
            const isTN3X = (savedName || '').trim().toUpperCase() === 'TN3X';
            if (operatorIdx >= targetIdx && !isTN3X) {
                showToast(currentLang === 'de' ? "Du kannst keine Benutzer mit gleichem oder höherem Rang bearbeiten!" : "You cannot edit users with equal or higher rank priority!", "error");
                return;
            }
        }

        let selectedRoles = [];
        document.querySelectorAll('.role-check-row.active').forEach(row => { selectedRoles.push(row.getAttribute('data-role')); });

        if (editUserTarget && editUserTarget.trim().toUpperCase() === 'TN3X') {
            if (!selectedRoles.includes('OWNER')) {
                selectedRoles.push('OWNER');
            }
        }

        if (isClientSimulated) {
            let users = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            let userIdx = users.findIndex(u => u.uuid === editUserUuid);
            if(userIdx > -1) { users[userIdx].roles = selectedRoles; users[userIdx].username = editUserTarget; }
            else { users.push({username: editUserTarget, uuid: editUserUuid || 'unknown', roles: selectedRoles, is_banned: false, ban_reason: ''}); }
            localStorage.setItem('tentix_sim_users', JSON.stringify(users));

            if(editUserUuid === uuidValue) loadBadges();
            closeUserEditModal();
            renderUsersTable();
            return;
        }

        closeUserEditModal();
        
        try {
            await fetch(`${API_BASE_URL}/api/users/update-roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: editUserUuid, username: editUserTarget, roles: selectedRoles })
            });
        } catch(e) {}

        let users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
        let userIdx = users.findIndex(u => u.uuid === editUserUuid);
        if(userIdx > -1) { users[userIdx].roles = selectedRoles; users[userIdx].username = editUserTarget; }
        else { users.push({username: editUserTarget, uuid: editUserUuid || 'unknown', roles: selectedRoles}); }
        localStorage.setItem('tentix_db_users', JSON.stringify(users));

        if(editUserUuid === uuidValue) {
            await loadBadges();
        }
        renderUsersTable();
    }

    let customConfirmCallback = null;
    function showCustomConfirm(title, message, details, okBgColor, callback) {
        customConfirmCallback = callback;
        if(document.getElementById('custom-confirm-title')) document.getElementById('custom-confirm-title').innerText = title;
        if(document.getElementById('custom-confirm-msg')) document.getElementById('custom-confirm-msg').innerText = message;
        
        const detailsEl = document.getElementById('custom-confirm-details');
        if (detailsEl) {
            if (details) {
                detailsEl.innerText = details;
                detailsEl.style.display = 'block';
            } else {
                detailsEl.style.display = 'none';
            }
        }

        const okBtn = document.getElementById('custom-confirm-ok-btn');
        if (okBtn) {
            okBtn.style.background = okBgColor || 'var(--accent-blue)';
            okBtn.style.color = (okBgColor === '#ff4b4b' || okBgColor === 'red') ? '#fff' : '#000';
            okBtn.innerText = currentLang === 'de' ? 'Bestätigen' : 'Confirm';
        }
        
        const cancelBtn = document.getElementById('custom-confirm-cancel-btn');
        if (cancelBtn) {
            cancelBtn.innerText = currentLang === 'de' ? 'Abbrechen' : 'Cancel';
        }

        const modal = document.getElementById('custom-confirm-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; modal.classList.add('show'); }, 10);
        }
    }

    function closeCustomConfirm(approved) {
        const modal = document.getElementById('custom-confirm-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }
        if (customConfirmCallback) {
            const cb = customConfirmCallback;
            customConfirmCallback = null;
            cb(approved);
        }
    }

    async function deleteUserFromDashboard() {
        if(!editUserUuid) return;
        
        // 1. Permission check
        if (!hasPermission('CanDeleteUsers')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zum Löschen von Benutzern!" : "No permission to delete users!", "error");
            return;
        }
        
        // 2. Rank priority security check (lower rank cannot delete higher rank)
        const operatorIdx = ROLE_ORDER.indexOf(currentDashRole);
        let storedUsers = [];
        if (isClientSimulated) {
            storedUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
        } else {
            storedUsers = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
        }
        
        const targetUserObj = storedUsers.find(u => u.uuid === editUserUuid);
        if (targetUserObj) {
            let targetRoles = targetUserObj.roles || ['PLAYER'];
            if (typeof targetRoles === 'string') targetRoles = JSON.parse(targetRoles);
            
            const getHighestRolePriority = (roles) => {
                let minIdx = ROLE_ORDER.length;
                roles.forEach(r => {
                    const idx = ROLE_ORDER.indexOf(r);
                    if (idx !== -1 && idx < minIdx) minIdx = idx;
                });
                return minIdx;
            };
            
            const targetIdx = getHighestRolePriority(targetRoles);
            const isTN3X = (savedName || '').trim().toUpperCase() === 'TN3X';
            if (operatorIdx > targetIdx && !isTN3X) {
                showToast(currentLang === 'de' ? "Niedrigere Ränge können keine höheren Ränge löschen!" : "Lower ranks cannot delete higher ranks!", "error");
                return;
            }
        }

        const isTN3X = (savedName || '').trim().toUpperCase() === 'TN3X';
        const isSelf = editUserUuid === uuidValue;
        if (isSelf && isTN3X) {
            showToast(currentLang === 'de' ? "Du kannst dich nicht selbst löschen!" : "You cannot delete yourself!", "error");
            return;
        }

        if (editUserTarget && (editUserTarget.trim().toUpperCase() === 'TN3X')) {
            showToast(currentLang === 'de' ? "Der Besitzer kann nicht gelöscht werden!" : "The owner cannot be deleted!", "error");
            return;
        }

        showCustomConfirm(
            currentLang === 'de' ? "Spieler löschen?" : "Delete Player?",
            currentLang === 'de' ? `Bist du sicher, dass du den Spieler ${editUserTarget} löschen willst?` : `Are you sure you want to delete player ${editUserTarget}?`,
            "UUID: " + editUserUuid,
            "#ff4b4b",
            (approved) => {
                if (approved) confirmDeleteUserAction();
            }
        );
    }

    async function confirmDeleteUserAction() {
        let uuid = editUserUuid;
        let target = editUserTarget;

        if (isClientSimulated) {
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            simUsers = simUsers.filter(u => u.uuid !== uuid);
            localStorage.setItem('tentix_sim_users', JSON.stringify(simUsers));
            closeUserEditModal();
            renderUsersTable();
            showToast(currentLang === 'de' ? "Spieler gelöscht! (Simulation)" : "Player deleted! (Simulation)", "success");
            return;
        }

        let users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
        users = users.filter(u => u.uuid !== uuid);
        localStorage.setItem('tentix_db_users', JSON.stringify(users));

        closeUserEditModal();
        renderUsersTable();

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: uuid, username: target })
            });
            const data = await res.json();
            if(data.success) {
                showToast(currentLang === 'de' ? "Spieler gelöscht!" : "Player deleted!", "success");
            } else {
                showToast(data.error || "Fehler beim Löschen", "error");
            }
        } catch(e) {
            console.error("Delete player failed:", e);
            showToast(currentLang === 'de' ? "Offline: Spieler lokal gelöscht" : "Offline: Player deleted locally", "info");
        }
    }

    async function mockBanUser() {
        if (!hasPermission('CanBanUsers')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zum Bannen von Benutzern!" : "No permission to ban users!", "error");
            return;
        }
        const reason = document.getElementById('t-dash-banreason') ? document.getElementById('t-dash-banreason').value : 'Regelverstoß';
        
        if (editUserUuid === uuidValue) {
            localStorage.setItem('tentix_ban_status', 'true');
            localStorage.setItem('tentix_ban_reason', reason || 'Regelverstoß');
        }

        if (isClientSimulated) {
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            let userIdx = simUsers.findIndex(u => u.uuid === editUserUuid);
            if (userIdx > -1) {
                simUsers[userIdx].is_banned = true;
                simUsers[userIdx].ban_reason = reason;
                localStorage.setItem('tentix_sim_users', JSON.stringify(simUsers));
            }
            closeUserEditModal();
            if (editUserUuid === uuidValue) {
                closeDashboard();
                checkBanStatus();
            }
            renderUsersTable();
            renderBansTable();
            fetchDashboardStats();
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/api/users/update-ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: editUserTarget, is_banned: true, ban_reason: reason })
            });
        } catch(e) {}

        closeUserEditModal();
        if (editUserUuid === uuidValue) {
            closeDashboard();
            checkBanStatus();
        }
        renderUsersTable();
        renderBansTable();
        fetchDashboardStats();
    }

    async function unbanUser(username, uuid) {
        if (!hasPermission('CanBanUsers')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zum Entbannen von Benutzern!" : "No permission to unban users!", "error");
            return;
        }
        if (uuid === uuidValue) {
            localStorage.removeItem('tentix_ban_status');
            localStorage.removeItem('tentix_ban_reason');
        }

        if (isClientSimulated) {
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            let userIdx = simUsers.findIndex(u => u.uuid === uuid);
            if (userIdx > -1) {
                simUsers[userIdx].is_banned = false;
                simUsers[userIdx].ban_reason = '';
                localStorage.setItem('tentix_sim_users', JSON.stringify(simUsers));
            }
            closeUserEditModal();
            renderUsersTable();
            renderBansTable();
            fetchDashboardStats();
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/api/users/update-ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, is_banned: false, ban_reason: '' })
            });
        } catch(e) {}

        closeUserEditModal();
        renderUsersTable();
        renderBansTable();
        fetchDashboardStats();
    }

    async function renderBansTable() {
        const tbody = document.getElementById('dash-bans-tbody');
        if(!tbody) return;

        let users = [];
        if (isClientSimulated) {
            users = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/users`);
                if(res.ok) {
                    const data = await res.json();
                    if(data.success) {
                        users = data.users;
                        localStorage.setItem('tentix_db_users', JSON.stringify(users));
                    }
                }
            } catch(e) {
                users = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
            }
        }

        const bannedUsers = users.filter(u => u.is_banned);

        if(bannedUsers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic; padding:20px; color:#555;">Keine gesperrten Benutzer vorhanden.</td></tr>`;
            return;
        }

        let html = '';
        bannedUsers.forEach(u => {
            const reason = u.ban_reason || 'Regelverstoß';
            html += `
                <tr>
                    <td>${u.username}</td>
                    <td class="copy-hover" onclick="navigator.clipboard.writeText('${u.uuid}'); showToast('${currentLang === 'de' ? 'UUID kopiert!' : 'UUID copied!'}', 'success')">${u.uuid}</td>
                    <td>${reason}</td>
                    <td style="text-align: right;">
                        <span class="dash-action-btn" style="background:#ff4b4b; color:#fff;" onclick="unbanUserFromList('${u.username}', '${u.uuid}')">ENTSPERREN</span>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    async function unbanUserFromList(username, uuid) {
        if (uuid === uuidValue) {
            localStorage.removeItem('tentix_ban_status');
            localStorage.removeItem('tentix_ban_reason');
        }

        if (isClientSimulated) {
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            let userIdx = simUsers.findIndex(u => u.uuid === uuid);
            if (userIdx > -1) {
                simUsers[userIdx].is_banned = false;
                simUsers[userIdx].ban_reason = '';
                localStorage.setItem('tentix_sim_users', JSON.stringify(simUsers));
            }
            renderBansTable();
            renderUsersTable();
            fetchDashboardStats();
            showToast(currentLang === 'de' ? "Spieler entsperrt!" : "Player unbanned!", "success");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/update-ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, is_banned: false, ban_reason: '' })
            });
            const data = await res.json();
            if(data.success) {
                showToast(currentLang === 'de' ? "Spieler entsperrt!" : "Player unbanned!", "success");
            }
        } catch(e) {
            showToast("Fehler beim Entsperren", "error");
        }
        
        let dbUsers = JSON.parse(localStorage.getItem('tentix_db_users') || '[]');
        let dbIdx = dbUsers.findIndex(u => u.uuid === uuid);
        if (dbIdx > -1) {
            dbUsers[dbIdx].is_banned = false;
            dbUsers[dbIdx].ban_reason = '';
            localStorage.setItem('tentix_db_users', JSON.stringify(dbUsers));
        }
        renderBansTable();
        renderUsersTable();
        fetchDashboardStats();
    }

    async function inviteToTeam() {
        const uuid = document.getElementById('dash-inv-uuid').value.trim();
        const role = document.getElementById('dash-inv-role').value;
        if(!uuid) return;

        try {
            await fetch(`${API_BASE_URL}/api/team/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid, role })
            });
            if(document.getElementById('dash-inv-uuid')) document.getElementById('dash-inv-uuid').value = '';
            renderInvitesTable();
            showToast(currentLang === 'de' ? "Einladung gesendet!" : "Invitation sent!", "success");
        } catch(e) {
            showToast("Fehler beim Senden der Einladung", "error");
        }
    }

    async function renderInvitesTable() {
        const tbody = document.getElementById('dash-invites-tbody');
        if(!tbody) return;

        try {
            const resInvites = await fetch(`${API_BASE_URL}/api/team/invites`);
            const dataInvites = await resInvites.json();
            
            if(!dataInvites.success || dataInvites.invites.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic; padding:20px;">Keine ausstehenden Einladungen.</td></tr>`;
                return;
            }

            const resUsers = await fetch(`${API_BASE_URL}/api/users`);
            const dataUsers = await resUsers.json();

            let html = '';
            dataInvites.invites.forEach(i => {
                let usernameDisplay = "Unbekannt";
                if(dataUsers.success) {
                    let foundUser = dataUsers.users.find(u => u.uuid === i.uuid);
                    if(foundUser) usernameDisplay = foundUser.username;
                }

                let statusColor = "#ffb84d";
                let statusText = "Eingeladen";
                if(i.status === 'Abgelehnt') { statusColor = "#ff4b4b"; statusText = "Abgelehnt"; }
                if(i.status === 'Angenommen') { statusColor = "#00ff80"; statusText = "Angenommen"; }

                html += `<tr>
                    <td style="color:#fff; font-weight:700;">${usernameDisplay}</td>
                    <td class="copy-hover" style="font-family:monospace; font-size:10px; cursor:pointer;" onclick="copyDashUUID('${i.uuid}')" title="Click to copy">${i.uuid}</td>
                    <td style="color:var(--accent-blue); font-weight:700;">${i.role}</td>
                    <td style="color:${statusColor}; font-weight:800;">${statusText}</td>
                </tr>`;
            });
            tbody.innerHTML = html;
        } catch(e) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic; padding:20px; color:#ff4b4b;">Fehler beim Laden.</td></tr>`;
        }
    }

    async function renderTeamTable() {
        const tbody = document.getElementById('dash-team-tbody');
        if(!tbody) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admins/list`);
            const data = await res.json();
            if(!data.success || data.admins.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; font-style:italic; padding:20px;">Keine Teammitglieder registriert.</td></tr>`;
                return;
            }

            let html = '';
            data.admins.forEach(admin => {
                const date = new Date(admin.created_at).toLocaleDateString();
                const isTN3X = admin.username.toUpperCase() === 'TN3X';
                
                const actionsHtml = isTN3X
                    ? `<span style="color:#888; font-style:italic;">Hauptinhaber</span>`
                    : `<div style="display:flex; gap:8px; justify-content:center;">
                         <div class="dash-action-btn" style="background:#ff9900; color:#000; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer; font-weight:700;" onclick="resetTeamMember('${admin.username}', 'password')">New Password</div>
                         <div class="dash-action-btn" style="background:#ff4b4b; color:#fff; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer; font-weight:700;" onclick="resetTeamMember('${admin.username}', 'login')">New Login</div>
                       </div>`;

                html += `<tr>
                    <td style="color:#fff; font-weight:700;">${admin.username}</td>
                    <td style="font-family:monospace; font-size:11px;">${admin.email}</td>
                    <td style="color:var(--accent-blue); font-weight:700;">${admin.role}</td>
                    <td style="color:#888;">${date}</td>
                    <td>${actionsHtml}</td>
                </tr>`;
            });
            tbody.innerHTML = html;
        } catch(e) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; font-style:italic; padding:20px; color:#ff4b4b;">Fehler beim Laden.</td></tr>`;
        }
    }

    async function resetTeamMember(username, type) {
        let msg = '';
        if (type === 'login') {
            msg = currentLang === 'de' ? `Bist du sicher, dass du den Login für '${username}' komplett zurücksetzen willst? Der Benutzer muss sich neu registrieren.` : `Are you sure you want to completely reset the login for '${username}'? The user will have to register again.`;
        } else {
            msg = currentLang === 'de' ? `Bist du sicher, dass du das Passwort für '${username}' zurücksetzen willst?` : `Are you sure you want to reset the password for '${username}'?`;
        }
        
        if (!confirm(msg)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admins/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, type })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || "Reset erfolgreich!", "success");
                renderTeamTable();
                renderInvitesTable();
            } else {
                showToast(data.error || "Fehler beim Zurücksetzen", "error");
            }
        } catch (e) {
            showToast("Fehler beim Zurücksetzen", "error");
        }
    }

    async function checkTeamInvites() {
        if(!isLoggedIn || !uuidValue || uuidValue === 'NOT LOGGED IN') return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/team/invites`);
            const data = await res.json();
            if(data.success) {
                const myInvite = data.invites.find(i => i.uuid === uuidValue && i.status === 'Eingeladen');
                if(myInvite) {
                    if(document.getElementById('tj-user')) document.getElementById('tj-user').value = savedName;
                    if(document.getElementById('tj-pass1')) document.getElementById('tj-pass1').value = '';
                    if(document.getElementById('tj-pass2')) document.getElementById('tj-pass2').value = '';
                    if(document.getElementById('tj-agb-check')) document.getElementById('tj-agb-check').classList.remove('active');
                    if(document.getElementById('tj-submit-btn')) document.getElementById('tj-submit-btn').classList.add('disabled');
                    
                    localStorage.setItem('tentix_pending_invite_role', myInvite.role);
                    
                    if(document.getElementById('team-join-overlay')) document.getElementById('team-join-overlay').classList.add('show');
                }
            }
        } catch(e) {}
    }

    function toggleTjCheck() {
        const row = document.getElementById('tj-agb-check');
        if(row) row.classList.toggle('active');
        const btn = document.getElementById('tj-submit-btn');
        if(row && btn) {
            if(row.classList.contains('active')) btn.classList.remove('disabled');
            else btn.classList.add('disabled');
        }
    }

    async function declineTeamJoin() {
        if (!uuidValue) return;
        try {
            await fetch(`${API_BASE_URL}/api/team/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: uuidValue, status: 'Abgelehnt' })
            });
        } catch(e) {}

        const overlay = document.getElementById('team-join-overlay');
        if(overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.classList.remove('show'), 500);
        }
    }

    async function submitTeamJoin() {
        if(document.getElementById('tj-submit-btn') && document.getElementById('tj-submit-btn').classList.contains('disabled')) return;

        const pass1 = document.getElementById('tj-pass1') ? document.getElementById('tj-pass1').value : '';
        const pass2 = document.getElementById('tj-pass2') ? document.getElementById('tj-pass2').value : '';

        if(pass1 !== pass2 || pass1.length < 4) {
            alert("Passwörter stimmen nicht überein oder sind zu kurz!");
            return;
        }

        const roleToAssign = localStorage.getItem('tentix_pending_invite_role') || 'DEV';

        try {
            await fetch(`${API_BASE_URL}/api/admins/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: savedName + '@tentix.net',
                    username: savedName,
                    password: pass1,
                    role: roleToAssign
                })
            });

            await fetch(`${API_BASE_URL}/api/team/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: uuidValue, status: 'Angenommen' })
            });

            await fetch(`${API_BASE_URL}/api/codes/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: "TEAM-JOIN", username: savedName, uuid: uuidValue })
            });

            const res = await fetch(`${API_BASE_URL}/api/users`);
            const data = await res.json();
            if(data.success) {
                let userObj = data.users.find(u => u.uuid === uuidValue);
                let currentRoles = [];
                if(userObj && userObj.roles) {
                    currentRoles = typeof userObj.roles === 'string' ? JSON.parse(userObj.roles) : userObj.roles;
                }
                if(!currentRoles.includes(roleToAssign)) {
                    currentRoles.push(roleToAssign);
                    await fetch(`${API_BASE_URL}/api/users/update-roles`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ uuid: uuidValue, username: savedName, roles: currentRoles })
                    });
                }
            }
        } catch(e) {}

        loadBadges();

        const overlay = document.getElementById('team-join-overlay');
        if(overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.classList.remove('show'), 500);
        }

        showToast("TEAM BEIGETRETEN!", "success");
    }

    async function generateDashCode() {
        let rawVal = document.getElementById('dash-new-code') ? document.getElementById('dash-new-code').value : '';
        let cVal = rawVal.replace(/[- ]/g, '').toUpperCase();
        const expVal = document.getElementById('dash-new-exp') ? document.getElementById('dash-new-exp').value.toUpperCase() : 'P';
        const usesVal = parseInt(document.getElementById('dash-new-uses') ? document.getElementById('dash-new-uses').value : 1) || 1;
        const rewardVal = document.getElementById('dash-new-reward') ? document.getElementById('dash-new-reward').value : 'PLAYER';

        if(cVal.length !== 12) {
            showToast(cVal.length < 12 ? "CODE ZU KURZ (12 ZEICHEN)!" : "CODE ZU LANG!", 'warning');
            return;
        }

        let expiresAt = 'P';
        if(expVal !== 'P') { let h = parseInt(expVal); if(!isNaN(h) && h > 0) expiresAt = Date.now() + (h * 60 * 60 * 1000); }

        if (isClientSimulated) {
            let codes = JSON.parse(localStorage.getItem('tentix_sim_codes') || '[]');
            codes.push({ code: cVal, reward: rewardVal, uses: usesVal, max_uses: usesVal, expires_at: expiresAt });
            localStorage.setItem('tentix_sim_codes', JSON.stringify(codes));
            if(document.getElementById('dash-new-code')) document.getElementById('dash-new-code').value = '';
            showToast("CODE ERSTELLT! (Simulation)", "success");
            renderCodesTable();
            return;
        }

        let codes = JSON.parse(localStorage.getItem('tentix_db_codes') || '[]');
        codes.push({ code: cVal, reward: rewardVal, uses: usesVal, max_uses: usesVal, expires_at: expiresAt });
        localStorage.setItem('tentix_db_codes', JSON.stringify(codes));

        try {
            await fetch(`${API_BASE_URL}/api/codes/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: cVal, reward: rewardVal, uses: usesVal, max_uses: usesVal, expires_at: expiresAt })
            });
        } catch(e) {}

        if(document.getElementById('dash-new-code')) document.getElementById('dash-new-code').value = '';
        showToast("CODE ERSTELLT!", "success");
        renderCodesTable();
    }

    async function deleteDashCode(codeId) {
        if (isClientSimulated) {
            let codes = JSON.parse(localStorage.getItem('tentix_sim_codes') || '[]');
            codes = codes.filter(c => c.code !== codeId);
            localStorage.setItem('tentix_sim_codes', JSON.stringify(codes));
            showToast("CODE GELÖSCHT (Simulation)", "warning");
            renderCodesTable();
            return;
        }

        let codes = JSON.parse(localStorage.getItem('tentix_db_codes') || '[]');
        codes = codes.filter(c => c.code !== codeId);
        localStorage.setItem('tentix_db_codes', JSON.stringify(codes));

        try {
            await fetch(`${API_BASE_URL}/api/codes/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: codeId })
            });
        } catch(e) {}

        showToast("CODE GELÖSCHT", "warning");
        renderCodesTable();
    }

    async function renderCodesTable() {
        const tbody = document.getElementById('dash-codes-tbody');
        if(!tbody) return;

        let codes = [];
        if (isClientSimulated) {
            codes = JSON.parse(localStorage.getItem('tentix_sim_codes') || '[]');
            if (codes.length === 0) {
                codes = [];
                localStorage.setItem('tentix_sim_codes', JSON.stringify(codes));
            }
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/codes`);
                if(!res.ok) throw new Error();
                const data = await res.json();
                if(data.success) {
                    codes = data.codes;
                    localStorage.setItem('tentix_db_codes', JSON.stringify(codes));
                }
            } catch(e) {
                codes = JSON.parse(localStorage.getItem('tentix_db_codes') || '[]');
            }
        }

        if(codes.length > 0) {
            let html = ''; let now = Date.now();
            codes.forEach(c => {
                let statusHtml = '';
                let expiresAtNum = parseInt(c.expires_at);

                if(c.uses <= 0) { statusHtml = '<span style="color:#ff4b4b; font-weight:800;">VERBRAUCHT</span>'; }
                else if (c.expires_at === '-1' || c.expires_at === 'P' || isNaN(expiresAtNum)) { statusHtml = '<span style="color:#00ff80; font-weight:800;">PERMANENT</span>'; }
                else {
                    if (now > expiresAtNum) { statusHtml = '<span style="color:#ff4b4b; font-weight:800;">ABGELAUFEN</span>'; }
                    else {
                        let diffMs = expiresAtNum - now; let h = Math.floor(diffMs / (1000*60*60)); let m = Math.floor((diffMs % (1000*60*60)) / (1000*60));
                        statusHtml = `<span style="color:#00d4ff; font-weight:800; font-family:monospace;">${h}h ${m}m</span>`;
                    }
                }

                let safeCode = c.code || "";
                let displayCode = safeCode.length === 12 ? safeCode.match(/.{1,4}/g).join('-') : safeCode;

                html += `<tr>
                    <td class="copy-hover" style="color:#fff; font-family:monospace; letter-spacing:2px;" onclick="copyDashUUID('${safeCode}')" title="Click to copy">${displayCode}</td>
                    <td style="color:#ffb84d; font-weight:700;">${ROLE_MAP[c.reward]?.name || c.reward}</td>
                    <td style="font-weight:800;">${c.uses} / ${c.max_uses || c.maxUses}</td>
                    <td>${statusHtml}</td>
                    <td style="text-align: center;"><span style="color:#ff4b4b; font-weight:800; display: inline-flex; align-items: center; justify-content: center; cursor:pointer; padding: 5px; vertical-align: middle;" onclick="deleteDashCode('${safeCode}')" title="Code löschen"><svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span></td>
                </tr>`;
            });
            tbody.innerHTML = html;
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; font-style:italic; padding:20px;" id="t-dash-nocode">Keine aktiven Codes.</td></tr>`;
        }
    }

    function updateOnlineStatus() {
        const overlay = document.getElementById('offline-overlay');
        const playBtn = document.getElementById('play-btn');
        if(navigator.onLine) {
            if(overlay) overlay.classList.remove('show');
            if(isLoggedIn && playBtn && !isBanned) playBtn.disabled = false;
        } else {
            if(overlay) overlay.classList.add('show');
            if(playBtn) playBtn.disabled = true;
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    let updateState = 'idle';

    let mockUpdateTimeout = null;
    let mockUpdateInterval = null;

    function handleUpdateClick() {
        if (updateState === 'checking' || updateState === 'downloading') {
            return; // Busy
        }

        if (updateState === 'idle' || updateState === 'latest') {
            updateState = 'checking';
            updateUpdateUI();

            if (window.api && window.api.checkUpdates) {
                window.api.checkUpdates();
            } else {
                if (mockUpdateTimeout) clearTimeout(mockUpdateTimeout);
                if (mockUpdateInterval) clearInterval(mockUpdateInterval);

                mockUpdateTimeout = setTimeout(() => {
                    onUpdateStatusReceived({ status: 'available' });

                    let progress = 0;
                    mockUpdateInterval = setInterval(() => {
                        progress += Math.random() * 12 + 5;
                        if (progress >= 100) {
                            progress = 100;
                            clearInterval(mockUpdateInterval);
                            onUpdateStatusReceived({ status: 'downloaded' });
                        }
                        onUpdateProgressReceived(progress);
                    }, 300);

                }, 1500);
            }
        } else if (updateState === 'ready') {
            const modal = document.getElementById('forced-restart-modal');
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.style.opacity = '1';
                    modal.firstElementChild.style.transform = 'scale(1)';
                }, 10);
            }
        }
    }

    function onUpdateStatusReceived(data) {
        const ping = document.getElementById('update-ping-anim');

        if(data.status === 'checking') {
            updateState = 'checking';
            if(ping) ping.style.display = 'none';
            updateUpdateUI();
        }
        else if(data.status === 'available') {
            updateState = 'downloading';
            if(ping) ping.style.display = 'block';
            updateUpdateUI();
        }
        else if(data.status === 'downloaded') {
            updateState = 'ready';
            if(ping) ping.style.display = 'block';
            updateUpdateUI();

            const modal = document.getElementById('forced-restart-modal');
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.style.opacity = '1';
                    modal.firstElementChild.style.transform = 'scale(1)';
                }, 10);
            }
        }
        else if(data.status === 'latest') {
            updateState = 'latest';
            if(ping) ping.style.display = 'none';
            updateUpdateUI();
            showToast(translations[currentLang].updLatestToast || "Du bist auf der aktuellsten Version! (v0.1.0)", "success");
            setTimeout(() => { updateState = 'idle'; updateUpdateUI(); }, 2000);
        }
    }

    function onUpdateProgressReceived(percent) {
        if(updateState !== 'downloading') {
            updateState = 'downloading';
            updateUpdateUI();
        }
        const fill = document.getElementById('fancy-update-fill');
        const hoverTxt = document.getElementById('dl-hover-percent');
        if(fill) fill.style.height = percent + '%';
        
        let stepText = '';
        if (percent < 25) {
            stepText = currentLang === 'de' ? "Schritt 1/4: Herunterladen..." : "Step 1/4: Downloading...";
        } else if (percent < 50) {
            stepText = currentLang === 'de' ? "Schritt 2/4: Daten abgleichen..." : "Step 2/4: Verifying files...";
        } else if (percent < 75) {
            stepText = currentLang === 'de' ? "Schritt 3/4: Dateien installieren..." : "Step 3/4: Installing files...";
        } else {
            stepText = currentLang === 'de' ? "Schritt 4/4: Bereinigen..." : "Step 4/4: Cleaning up...";
        }
        if(hoverTxt) hoverTxt.innerText = stepText;

        if (percent >= 100) {
            const modal = document.getElementById('forced-restart-modal');
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.style.opacity = '1';
                    modal.firstElementChild.style.transform = 'scale(1)';
                }, 10);
            }
        }
    }

    function updateUpdateUI() {
        const box = document.getElementById('fancy-update-box');
        const icon = document.getElementById('update-icon-svg');
        const tooltip = document.getElementById('t-update-tooltip');
        const setIcon = document.getElementById('settings-updater-icon');
        const t = translations[currentLang];

        if(!box || !icon || !tooltip) return;

        box.className = 'update-box tooltip tooltip-down';
        icon.className = 'update-icon';
        if(setIcon) setIcon.className = '';

        void icon.offsetWidth; // Force layout reflow to restart CSS keyframe animations
        if (setIcon) void setIcon.offsetWidth;

        if(updateState === 'idle') {
            const p = '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>';
            icon.innerHTML = p; if(setIcon) setIcon.innerHTML = p;
            tooltip.innerText = t.updIdle || "Update den Launcher";
        } else if(updateState === 'checking') {
            const p = '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>';
            icon.innerHTML = p; if(setIcon) { setIcon.innerHTML = p; }
            icon.classList.add('spin-anim');
            tooltip.innerText = t.updCheck || "Checking...";
        } else if(updateState === 'downloading') {
            const p = '<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>';
            icon.innerHTML = p; if(setIcon) { setIcon.innerHTML = p; }
            icon.classList.add('bounce-anim');
            box.classList.add('downloading');
            tooltip.innerText = t.updDl || "Downloading...";
        } else if(updateState === 'ready') {
            const p = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
            icon.innerHTML = p; if(setIcon) setIcon.innerHTML = p;
            box.classList.add('ready');
            icon.classList.add('check-pop-anim');
            tooltip.innerText = t.updReady || "Click to restart & install";
        } else if(updateState === 'latest') {
            const p = '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>';
            icon.innerHTML = p; if(setIcon) setIcon.innerHTML = p;
            box.classList.add('latest');
            icon.classList.add('check-pop-anim');
            tooltip.innerText = t.updLatest || "You are up to date!";
        }
    }

    function openRedeemModal() {
        if(!isLoggedIn) return;
        const modal = document.getElementById('redeem-modal');
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.classList.add('show');
            }, 10);
        }
    }

    function closeRedeemModal() {
        const modal = document.getElementById('redeem-modal');
        if(modal) {
            modal.style.opacity = '0';
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                if(document.getElementById('redeem-input-field')) document.getElementById('redeem-input-field').value = '';
            }, 300);
        }
    }

    async function submitRedeem() {
        const rawVal = document.getElementById('redeem-input-field').value;
        if(!rawVal) return;
        const val = rawVal.replace(/[- ]/g, '').toUpperCase();

        if(val.length !== 12) {
            showToast(translations[currentLang].redShort, "error");
            closeRedeemModal();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/codes/redeem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: val, username: savedName, uuid: uuidValue })
            });

            const data = await response.json();

            if (data.success) {
                loadBadges();
                showToast(translations[currentLang].redChecked, "success");
            } else {
                showToast(translations[currentLang].redFail, "error");
            }
        } catch (error) {
            showToast("OFFLINE!", "error");
        }

        closeRedeemModal();
    }

    function generateFakeId(uuid, name) {
        if(name && (name.toUpperCase() === 'TNTIX' || name.toUpperCase() === 'TN3X')) return '0001';
        if(!uuid || uuid === 'NOT LOGGED IN') return '----';
        let hash = 0; for (let i = 0; i < uuid.length; i++) hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
        let id = Math.abs(hash % 9000) + 1000;
        return id.toString().padStart(4, '0');
    }

    function checkAuthState() {
        let tokenStr = localStorage.getItem('tentix_mc_token');
        let user = localStorage.getItem('tentix_user');
        let uuid = localStorage.getItem('tentix_uuid');

        if (tokenStr && tokenStr !== 'undefined' && tokenStr !== 'null' && user && user !== 'GUEST') {
            isLoggedIn = true; savedName = user; uuidValue = uuid; deterministicId = generateFakeId(uuidValue, savedName);

            if (window.api && window.api.updateDiscordRPStatus) {
                window.api.updateDiscordRPStatus({ username: savedName, state: 'Im Menü' });
            }

            // Dynamically register the user in simulated database (tentix_sim_users)
            let simUsers = JSON.parse(localStorage.getItem('tentix_sim_users') || '[]');
            if (!simUsers.some(u => u.username.toUpperCase() === savedName.toUpperCase())) {
                simUsers.push({
                    username: savedName,
                    uuid: uuidValue || `${savedName}-uuid`,
                    roles: ['PLAYER'],
                    is_banned: false,
                    ban_reason: ''
                });
                localStorage.setItem('tentix_sim_users', JSON.stringify(simUsers));
            }

            fetch(`${API_BASE_URL}/api/users/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: savedName, uuid: uuidValue })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.id) {
                    deterministicId = data.id.toString().padStart(4, '0');
                    const useridEl = document.getElementById('ui-card-id');
                    const t = translations[currentLang];
                    if (useridEl && isLoggedIn) {
                        useridEl.innerText = t.userId + deterministicId;
                    }
                }
            })
            .catch(e => {});

            sendHeartbeatPing();
        } else {
            isLoggedIn = false; savedName = 'GUEST'; uuidValue = 'NOT LOGGED IN'; deterministicId = '----'; localStorage.removeItem('tentix_logged');
            if (window.api && window.api.updateDiscordRPStatus) {
                window.api.updateDiscordRPStatus({ username: 'GUEST', state: 'Im Menü' });
            }
            regDate = '--';
            if(document.getElementById('ui-card-reg')) document.getElementById('ui-card-reg').innerText = (currentLang === 'de' ? "REGISTRIERT: " : "REGISTERED: ") + regDate;
        }
        loadBadges();
        loadInbox();
        loadNews();
    }

    function initOnlineCounter() {
        const countEl = document.getElementById('online-count');
        if(countEl) fetchDashboardStats();
    }

    function updateRamTag(val, total) {
        const tag = document.getElementById('ram-dynamic-tag');
        if(!tag) return;
        let recommended = 4;
        if (total >= 32) recommended = 12; else if (total >= 16) recommended = 6; else if (total >= 8) recommended = 3; else recommended = 2;
        const t = translations[currentLang];

        tag.className = "tag-rec tooltip tooltip-down";

        let tooltipText = "";
        if (val <= 2) {
            tooltipText = currentLang === 'de' ? "ACHTUNG! Wenn du so wenig RAM zuweist kann dein Minecraft crashen." : "WARNING! Assigning this little RAM can cause Minecraft to crash.";
            tag.innerHTML = `🚨 ${t.high}<span class="tooltiptext wide-tooltip tooltip-red">${tooltipText}</span>`;
            tag.style.background = "rgba(255, 75, 75, 0.1)"; tag.style.color = "#ff4b4b"; tag.style.borderColor = "rgba(255, 75, 75, 0.3)";
        } else if (val == recommended) {
            tooltipText = currentLang === 'de' ? "Wir empfehlen dir diese Einstellung so zu lassen." : "We recommend leaving this setting as is.";
            tag.innerHTML = `✨ ${t.rec}<span class="tooltiptext wide-tooltip tooltip-blue">${tooltipText}</span>`;
            tag.style.background = "rgba(var(--accent-blue-rgb), 0.1)"; tag.style.color = "var(--accent-blue)"; tag.style.borderColor = "rgba(var(--accent-blue-rgb), 0.3)";
        } else {
            tooltipText = currentLang === 'de' ? "Achtung. Du hast deinen RAM angepasst." : "Attention. You have customized your RAM.";
            tag.innerHTML = `⚠️ ${t.over}<span class="tooltiptext wide-tooltip tooltip-orange">${tooltipText}</span>`;
            tag.style.background = "rgba(255, 184, 77, 0.1)"; tag.style.color = "#ffb84d"; tag.style.borderColor = "rgba(255, 184, 77, 0.3)";
        }
    }

    function updateDiscordHideTag(switchEl) {
        const tag = document.getElementById('ts-discord-hide-tag');
        if(!tag) return;
        const isActive = switchEl.classList.contains('active');
        const t = translations[currentLang];
        if (isActive) {
            tag.innerHTML = "✓ " + t.dcHideVisible;
            tag.style.background = "rgba(var(--accent-blue-rgb), 0.1)"; tag.style.color = "var(--accent-blue)"; tag.style.borderColor = "rgba(var(--accent-blue-rgb), 0.3)";
        } else {
            tag.innerHTML = "✕ " + t.dcHideHidden;
            tag.style.background = "rgba(255,255,255,0.05)"; tag.style.color = "#888"; tag.style.borderColor = "rgba(255,255,255,0.1)";
        }
    }

    function applyLoginState() {
        const topContainer = document.getElementById('top-left-container');
        const navbar = document.getElementById('ui-navbar');
        const socials = document.getElementById('ui-social-container');
        const newsBtn = document.getElementById('news-toggle-btn');
        const redBtn = document.getElementById('t-set-red-btn');

        if(navbar) { navbar.style.display = 'flex'; setTimeout(() => navbar.style.opacity = 1, 50); }
        if(topContainer) { topContainer.style.display = 'flex'; setTimeout(() => topContainer.style.opacity = 1, 50); }

        const menu = document.getElementById('main-menu-wrapper');
        const isOnStartPage = menu && menu.style.display !== 'none';

        if(isLoggedIn) {
            if(document.getElementById('ui-login-btn')) document.getElementById('ui-login-btn').style.display = 'none';
            if(document.getElementById('ui-logout-btn')) document.getElementById('ui-logout-btn').style.display = 'block';
            if(document.getElementById('ui-skin-btn-wrap')) document.getElementById('ui-skin-btn-wrap').style.display = 'block';
            if(document.getElementById('ui-tentixplus-btn')) document.getElementById('ui-tentixplus-btn').style.display = 'block';
            if(document.getElementById('user-avatar')) document.getElementById('user-avatar').src = `https://minotar.net/avatar/${savedName}/40`;
            if(topContainer) topContainer.classList.add('logged-in');

            if(document.getElementById('ui-card-reg')) document.getElementById('ui-card-reg').style.display = 'block';
            if(redBtn) { redBtn.classList.remove('disabled'); redBtn.onclick = openRedeemModal; }

            if(isOnStartPage) {
                if(socials) { socials.style.display = 'flex'; setTimeout(() => socials.style.opacity = 1, 50); }
                if(newsBtn) { newsBtn.style.display = 'flex'; setTimeout(() => newsBtn.style.opacity = 1, 50); }
                if(isAppReady) fetchEvents();
            }
        } else {
            if(document.getElementById('ui-login-btn')) document.getElementById('ui-login-btn').style.display = 'block';
            if(document.getElementById('ui-logout-btn')) document.getElementById('ui-logout-btn').style.display = 'none';
            if(document.getElementById('ui-skin-btn-wrap')) document.getElementById('ui-skin-btn-wrap').style.display = 'none';
            if(document.getElementById('ui-tentixplus-btn')) document.getElementById('ui-tentixplus-btn').style.display = 'none';
            if(document.getElementById('user-avatar')) document.getElementById('user-avatar').src = `https://minotar.net/avatar/MHF_Steve/40`;
            if(topContainer) topContainer.classList.remove('logged-in');

            if(document.getElementById('ui-card-reg')) document.getElementById('ui-card-reg').style.display = 'none';
            if(redBtn) { redBtn.classList.add('disabled'); redBtn.onclick = null; }

            if(socials) { socials.style.opacity = 0; setTimeout(() => socials.style.display = 'none', 300); }
            if(newsBtn) { newsBtn.style.opacity = 0; setTimeout(() => newsBtn.style.display = 'none', 300); }
            if(document.getElementById('announcement-bar')) document.getElementById('announcement-bar').classList.remove('show');
        }
    }

    function updateUI() {
        const t = translations[currentLang];

        updateShopBalanceDisplay();
        setElText('t-maint-text', t.maintText);
        setElText('t-maint-tooltip', t.maintTooltip);

        setElText('ui-welcome-text', t.welcome);
        setElText('display-name', isLoggedIn ? savedName.toUpperCase() : t.guest);

        const playBtn = document.getElementById('play-btn');
        if(playBtn) {
            playBtn.innerText = isLoggedIn ? t.play : t.loginReq;
            playBtn.disabled = !isLoggedIn || !navigator.onLine || isBanned;
        }

        setElText('ui-online-label', t.online);
        initOnlineCounter();

        const modColor = currentModloader === 'FABRIC' ? '#ffb84d' : 'var(--accent-blue)';
        const modShadow = currentModloader === 'FABRIC' ? 'rgba(255, 184, 77, 0.4)' : 'rgba(var(--accent-blue-rgb), 0.4)';
        const modBox = document.getElementById('mod-display');
        if(modBox) {
            modBox.style.borderColor = modColor;
            modBox.style.color = modColor;
            modBox.style.boxShadow = `0 0 15px ${modShadow}`;
            modBox.innerText = currentModloader;
        }

        setElText('ui-card-name', isLoggedIn ? savedName : t.guest);
        const nameEl = document.getElementById('ui-card-name');
        if (nameEl) {
            const cleanName = (savedName || '').trim().toUpperCase();
            if (isLoggedIn && (cleanName === 'TN3X')) {
                nameEl.style.color = 'var(--accent-blue)';
                nameEl.style.textShadow = '0 0 10px rgba(var(--accent-blue-rgb), 0.8), 0 0 20px rgba(var(--accent-blue-rgb), 0.4)';
            } else {
                nameEl.style.color = '#fff';
                nameEl.style.textShadow = 'none';
            }
        }
        setElText('ui-card-uuid', "UUID: " + uuidValue);

        const useridEl = document.getElementById('ui-card-id');
        if(useridEl) { if(isLoggedIn) { useridEl.style.display = 'inline-block'; useridEl.innerText = t.userId + deterministicId; } else { useridEl.style.display = 'none'; } }
        setElText('ui-card-reg', (currentLang === 'de' ? "REGISTRIERT: " : "REGISTERED: ") + regDate);
        setElText('t-ram-reset-tooltip', t.ramReset);
        setElText('t-cosmetics-title', t.cosTitle);
        setElText('t-cosmetics-desc', t.cosDesc);
        setElText('t-cosmetics-back', t.csBack || "ZURÜCK");
        setElText('t-shop-creator-tooltip', t.creatorCodeTooltip);
        setElText('t-cart-creator-tooltip', t.creatorCodeTooltip);
        
        const plusTitleEl = document.getElementById('tentixplus-view-title');
        if(plusTitleEl) plusTitleEl.innerHTML = t.tPlusTitle || 'TENTIX <span style="background: linear-gradient(135deg, var(--accent-blue) 0%, #0072ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PLUS</span>';
        const plusDescEl = document.getElementById('tentixplus-view-desc');
        if(plusDescEl) plusDescEl.innerHTML = t.tPlusDesc || 'Du hast kein TENTIX+ um hier deine Extras auszuwählen.<br><br>Hol dir TENTIX+ für exklusive Kosmetika, Profileffekte und Beta-Zugang!';
        const plusBackEl = document.getElementById('tentixplus-view-back');
        if(plusBackEl) plusBackEl.innerText = t.btnBack || 'ZURÜCK';

        if(document.getElementById('lang-en')) document.getElementById('lang-en').className = (currentLang === 'en' ? 'active-lang' : '');
        if(document.getElementById('lang-de')) document.getElementById('lang-de').className = (currentLang === 'de' ? 'active-lang' : '');

        setElText('t-settings', t.settingsTitle);
        setElText('t-ram', t.setRam);
        setElText('t-ram-desc', t.setRamD);
        setElText('t-res', t.setRes);
        setElText('t-res-desc', t.setResD);
        setElText('t-vis', t.setVis);
        setElText('t-vis-desc', t.setVisD);
        setElText('t-inbox', t.inbox);
        setElText('t-tab-game-text', t.tGame);
        setElText('t-tab-discord-text', t.tDisc);
        setElText('t-priv-title', t.tPriv);
        setElText('t-priv-1', t.tPriv1);
        setElText('t-priv-d1', t.tPrivD1);
        setElText('t-priv-2', t.tPriv2);
        setElText('t-priv-d2', t.tPrivD2);
        setElText('t-ads-tt', t.setAdsTt);

        setElText('t-disc-header', t.discHeader);
        setElText('t-disc-rp', t.discRp);
        setElText('t-disc-rp-desc', t.discRpDesc);
        setElText('t-disc-hide', t.discHide);
        setElText('t-disc-hide-desc', t.discHideDesc);
        setElText('t-disc-lang', t.discLang);
        setElText('t-disc-lang-desc', t.discLangDesc);
        setElText('t-disc-join', t.discJoin);
        setElText('t-disc-join-desc', t.discJoinDesc);

        setElText('ui-err-title', t.loginErrTitle);
        setElText('ui-err-desc', t.loginErrDesc);
        setElText('ui-err-ok', t.btnOk);

        setElText('t-upd-tab', t.updTab);
        setElText('t-upd-header', t.updHeader);
        setElText('t-upd-status-title', t.updStatTitle);
        setElText('t-upd-status-desc', t.updStatDesc);
        setElText('t-upd-btn-txt', t.updBtn);

        setElText('t-offline-title', t.offTitle);
        setElText('t-offline-desc', t.offDesc);

        setElText('t-set-red-title', t.setRedTitle);
        setElText('t-set-red-desc', t.setRedDesc);
        setElText('t-set-red-btn', t.setRedBtn);
        setElText('t-red-title', t.redTitle);
        setElText('t-red-desc', t.redDesc);
        setElText('t-red-btn', t.redBtn);
        if(document.getElementById('redeem-input-field')) {
            document.getElementById('redeem-input-field').placeholder = currentLang === 'de' ? "XXXX-XXXX-XXXX" : "XXXX-XXXX-XXXX";
        }

        setElText('t-dash-home', t.dashTitle);
        setElText('t-dash-users', t.dashUsers);
        setElText('t-dash-codes', t.dashCodes);
        setElText('t-dash-news', t.dashNews);
        setElText('t-dash-events', t.dashEvents);
        setElText('t-dash-overview', t.dashTitle);
        setElText('t-dash-userm', t.dashUsers);
        setElText('t-dash-codem', t.dashCodes);
        setElText('t-dash-newsm', t.dashNews);
        setElText('t-dash-gen', t.dashGen);
        setElText('t-dash-pub', t.dashPub);
        setElText('t-dash-upimg', t.dashUpImg);
        setElText('t-dash-nocode', t.dashNoCode);
        setElText('t-dash-tot', t.dashTot);
        setElText('t-dash-act', t.dashAct);
        setElText('t-dash-ban', t.dashBan);
        setElText('t-dash-edit', t.dashEdit);
        setElText('t-dash-assign', t.dashAssign);
        setElText('t-dash-banset', t.dashBanSet);
        setElText('t-dash-banbtn', t.dashBanBtn);
        setElText('t-dash-stats', t.dashStats);
        setElText('t-dash-rev', t.dashRev);
        setElText('t-dash-msg-tab', t.dashMsgTab);
        setElText('t-dash-msg-title', t.dashMsgTitle);
        setElText('t-dash-msg-btn', t.dashMsgBtn);

        setElText('t-banned-title', t.bannedTitle);
        setElText('t-banned-reason-lbl', t.bannedReasonLbl);
        setElText('t-banned-until-lbl', t.bannedUntilLbl);

        updateUpdateUI();
        loadInbox();
        loadNews();
        if(isAppReady) fetchEvents();

        if(document.getElementById('settings-search')) document.getElementById('settings-search').placeholder = t.search;
        setElText('t-vis-keep', t.keep);
        setElText('t-vis-keep-d', t.keepD);
        setElText('t-vis-hide', t.hide);
        setElText('t-vis-hide-d', t.hideD);
        setElText('t-ram-free-pre', t.free1);
        setElText('t-ram-free-post', t.free2);
        setElText('dl-auto', t.da);
        setElText('dl-en', t.de);
        setElText('t-news-header', t.newsHeader);
        setElText('t-news-empty', t.newsEmpty);
        setElText('ui-open-settings-btn', t.settings);
        setElText('ui-skin-btn', t.skinBtn);
        setElText('t-skin-tt', t.ttSkin);
        setElText('ui-login-btn', t.loginBtn);
        setElText('ui-logout-btn', t.logout);
        setElText('t-nav-start', t.navStart);
        setElText('t-nav-cosmetics', t.navCosmetics);
        setElText('t-nav-shop', t.navShop);
        setElText('ui-cs-title', t.csTitle);
        setElText('ui-cs-back', t.csBack);
        setElText('t-nav-explore', t.navExplore);

        let verText = lastVer === '1.21.11' ? `${t.latest}<br>(1.21.11)` : `Minecraft<br>${lastVer}`;
        const elCurrentVer = document.getElementById('current-ver-text'); if(elCurrentVer) elCurrentVer.innerHTML = verText;
        document.querySelectorAll('.latest-text').forEach(el => el.innerText = t.latest);

        const slider = document.getElementById('ram-slider');
        if(slider) {
            updateRamTag(parseInt(slider.value), systemTotalRam);
        }

        if(!localStorage.getItem('tentix_ads_enabled')) localStorage.setItem('tentix_ads_enabled', 'true');
        const adsToggle = document.getElementById('ts-ads');
        if(adsToggle) {
            if(localStorage.getItem('tentix_ads_enabled') === 'true') adsToggle.classList.add('active');
            else adsToggle.classList.remove('active');
        }

        const hideToggle = document.getElementById('ts-discord-hide');
        if(hideToggle) updateDiscordHideTag(hideToggle);

        if(!localStorage.getItem('tentix_autostart')) localStorage.setItem('tentix_autostart', 'false');
        const autostartToggle = document.getElementById('ts-autostart');
        if(autostartToggle) {
            if(localStorage.getItem('tentix_autostart') === 'true') autostartToggle.classList.add('active');
            else autostartToggle.classList.remove('active');
        }

        const searchInput = document.getElementById('mod-search-input');
        if(searchInput) searchInput.placeholder = t.modSearch;
        const sortSelect = document.getElementById('mod-sort-select');
        if(sortSelect) {
            sortSelect.options[0].text = t.modSortRel;
            sortSelect.options[1].text = t.modSortDl;
            sortSelect.options[2].text = t.modSortNew;
            sortSelect.options[3].text = t.modSortUpd;
        }
        document.querySelectorAll('.filter-title').forEach(el => {
            if(el.innerText.includes("Kategorien") || el.innerText.includes("Categories")) el.innerText = t.modCatTitle;
            if(el.innerText.includes("Umgebung") || el.innerText.includes("Environment")) el.innerText = t.modEnvTitle;
        });
        
        const paymentTitle = document.getElementById('ui-payment-drawer-title');
        if (paymentTitle) {
            paymentTitle.innerText = currentLang === 'de' ? 'Zahlungsmethoden' : 'Payment Methods';
        }
        const paymentLegal = document.getElementById('ui-payment-legal-text');
        if (paymentLegal) {
            paymentLegal.innerText = currentLang === 'de' 
                ? 'Wichtiger Hinweis: Alle Käufe sind endgültig. Es besteht kein Anspruch auf Rückerstattung (No Refund). Mit dem Kauf akzeptierst du unsere Nutzungsbedingungen und Datenschutzbestimmungen.'
                : 'Important Notice: All purchases are final. There is no right to refund (No Refund). By purchasing, you accept our Terms of Service and Privacy Policy.';
        }

        updateSimulationButtonText();
    }

    let paymentMethodsExpanded = false;
    function togglePaymentMethods() {
        const container = document.getElementById('shop-payment-container');
        const arrow = document.getElementById('payment-drawer-arrow');
        if (!container || !arrow) return;
        
        paymentMethodsExpanded = !paymentMethodsExpanded;
        if (paymentMethodsExpanded) {
            container.classList.add('expanded');
            arrow.style.transform = 'rotate(0deg)';
            document.body.classList.add('payment-drawer-expanded');
        } else {
            container.classList.remove('expanded');
            arrow.style.transform = 'rotate(180deg)';
            document.body.classList.remove('payment-drawer-expanded');
        }
        updateMaintenanceBannerVisibility();
    }

    function openPaymentTerms(method) {
        const modal = document.getElementById('payment-terms-modal');
        const logo = document.getElementById('payment-terms-logo');
        const title = document.getElementById('payment-terms-title');
        const refundTxt = document.getElementById('txt-refund-policy');
        const rightsTxt = document.getElementById('txt-buyer-rights');
        
        if (!modal) return;
        
        const info = {
            paypal: {
                logo: '../assets/PayPal.png',
                title: 'PayPal',
                de: {
                    refund: 'Da es sich um digitale, kosmetische Spielinhalte handelt, erlöschen die regulären Rückgaberechte sofort nach Erhalt der Ware. Eine Rückerstattung via PayPal ist nur unter besonderen Umständen (z.B. technischer Fehler) nach Prüfung durch unseren Support möglich.',
                    rights: 'Du bist durch den PayPal-Käuferschutz abgesichert. Ungerechtfertigte Konflikte oder Rückbuchungen verstoßen jedoch gegen unsere Richtlinien und führen zur dauerhaften Sperrung deines Accounts.'
                },
                en: {
                    refund: 'Since the purchase involves digital, cosmetic items, standard return rights expire immediately upon delivery. A refund via PayPal is only granted under special circumstances (e.g., technical failure) after manual support review.',
                    rights: 'You are protected by PayPal Buyer Protection. However, opening unjustified disputes or chargebacks violates our terms and will result in a permanent ban of your account.'
                }
            },
            bitcoin: {
                logo: '../assets/Bitcoin.png',
                title: 'Bitcoin (Crypto)',
                de: {
                    refund: 'Krypto-Transaktionen sind technisch unumkehrbar. Rückerstattungen sind ausgeschlossen, es sei denn, es liegt ein nachweisbarer Fehler unsererseits vor. In diesem Fall erstatten wir den Euro-Wert zum Kaufzeitpunkt.',
                    rights: 'Es gelten keine klassischen Käuferrechte. Die Zahlung erfolgt pseudonymisiert und direkt über die Blockchain. Eventuelle Netzwerkgebühren werden vom Käufer getragen.'
                },
                en: {
                    refund: 'Cryptocurrency transactions are technically irreversible. Refunds are excluded unless there is a verifiable error on our part. If approved, we refund the Euro value at the time of purchase.',
                    rights: 'No classic consumer protection rights apply. The payment is pseudonymous and handled directly via the blockchain. Any network transaction fees must be paid by the buyer.'
                }
            },
            skrill: {
                logo: '../assets/Skrill.png',
                title: 'Skrill',
                de: {
                    refund: 'Es gelten die gesetzlichen Bestimmungen für digitale Güter. Keine Rückerstattungen möglich, außer unter besonderen Umständen nach Ermessen unseres Supports.',
                    rights: 'Zahlungen werden sofort abgewickelt. Es fallen für dich keine zusätzlichen Gebühren an. Dein Skrill-Käuferschutz bleibt unberührt.'
                },
                en: {
                    refund: 'Legal regulations for digital goods apply. Refunds are not possible except under special circumstances at the sole discretion of our support team.',
                    rights: 'Payments are processed immediately. No additional transaction fees will be charged to you. Your Skrill protection remains unaffected.'
                }
            },
            giropay: {
                logo: '../assets/Giropay.png',
                title: 'Giropay',
                de: {
                    refund: 'Rückerstattungen bei Giropay-Zahlungen sind ausgeschlossen, da es sich um virtuelle Güter handelt. Bei Fehlfunktionen wende dich bitte an unseren Support.',
                    rights: 'Die Zahlung erfolgt direkt und sicher über das Online-Banking deiner Bank. Es gelten die Datenschutz- und Sicherheitsstandards der deutschen Kreditwirtschaft.'
                },
                en: {
                    refund: 'Refunds for Giropay payments are excluded as they concern virtual goods. In case of delivery failure, please contact our support team.',
                    rights: 'The payment is processed directly and securely via your bank\'s online banking. The privacy and security standards of the German banking industry apply.'
                }
            },
            visa: {
                logo: '../assets/Visa.png',
                title: 'Visa Kreditkarte',
                de: {
                    refund: 'Käufe mit Visa-Kreditkarten sind endgültig. Rückerstattungen für kosmetische Artikel sind ausgeschlossen, außer unter besonderen Umständen (z. B. fehlerhafte Bereitstellung).',
                    rights: 'Zahlungen werden über ein sicheres 3D-Secure-Verfahren abgewickelt. Betrügerische Chargebacks (Rückbuchungen) führen zum sofortigen und dauerhaften Ausschluss.'
                },
                en: {
                    refund: 'Purchases with Visa credit cards are final. Refunds for cosmetic items are excluded, except under special circumstances (e.g., failed delivery).',
                    rights: 'Payments are processed securely via 3D-Secure. Fraudulent chargebacks will result in an immediate and permanent ban from our network.'
                }
            },
            mastercard: {
                logo: '../assets/Mastercard.png',
                title: 'Mastercard Kreditkarte',
                de: {
                    refund: 'Mastercard-Zahlungen sind endgültig und nicht erstattungsfähig. Ausnahmen gelten nur bei nachweisbaren Auslieferungsfehlern durch unser System.',
                    rights: 'Sichere Zahlung via Mastercard Identity Check. Unbefugte Rückbuchungsversuche verstoßen gegen unsere Nutzungsbedingungen und führen zum permanenten Bann.'
                },
                en: {
                    refund: 'Mastercard payments are final and non-refundable. Exceptions only apply in case of verifiable delivery errors caused by our system.',
                    rights: 'Secure payment via Mastercard Identity Check. Unauthorized chargeback attempts violate our terms of service and lead to a permanent ban.'
                }
            },
            sofort: {
                logo: '../assets/Sofort.png',
                title: 'Sofortüberweisung',
                de: {
                    refund: 'Da die Überweisung direkt ausgeführt wird und es sich um digitale Güter handelt, erlöschen die Rückgaberechte. Erstattungen erfolgen nur in begründeten Ausnahmefällen.',
                    rights: 'Die Belastung erfolgt direkt von deinem Bankkonto. Es ist keine Registrierung beim Zahlungsdienstleister erforderlich. Deine Bankdaten werden verschlüsselt übertragen.'
                },
                en: {
                    refund: 'Since the transfer is executed instantly and concerns digital goods, return rights expire. Refunds are only granted in justified exceptional cases.',
                    rights: 'The amount is debited directly from your bank account. No registration with the payment provider is required. Your bank details are transmitted securely.'
                }
            }
        };
        
        const mInfo = info[method];
        if (mInfo) {
            logo.src = mInfo.logo;
            title.innerText = mInfo.title;
            const lang = currentLang === 'de' ? 'de' : 'en';
            refundTxt.innerText = mInfo[lang].refund;
            rightsTxt.innerText = mInfo[lang].rights;
            
            document.getElementById('lbl-refund-policy').innerText = currentLang === 'de' ? 'Rückerstattungsrichtlinie (Refund Policy)' : 'Refund Policy';
            document.getElementById('lbl-buyer-rights').innerText = currentLang === 'de' ? 'Käuferrechte & Gebühren' : 'Buyer Rights & Fees';
        }
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 50);
    }
    
    function closePaymentTerms() {
        const modal = document.getElementById('payment-terms-modal');
        if (!modal) return;
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    function toggleModloader(e) {
        if(e) e.stopPropagation();
        const prev = currentModloader;
        currentModloader = currentModloader === 'VANILLA' ? 'FABRIC' : 'VANILLA';

        const isSnapshot = lastVer.includes('w') || lastVer.includes('pre') || lastVer.includes('rc') || lastVer.toLowerCase().includes('snapshot');
        let isSupported = true;
        if (fabricSupportedVersions && fabricSupportedVersions.length > 0) {
            isSupported = fabricSupportedVersions.includes(lastVer);
        } else {
            isSupported = !['1.7.10', '1.8.9', '1.12.2'].includes(lastVer) && !isSnapshot;
        }

        if (currentModloader === 'FABRIC' && !isSupported) {
            currentModloader = prev;
            showVersionError();
            return;
        }

        localStorage.setItem('tentix_modloader', currentModloader);

        const modColor = currentModloader === 'FABRIC' ? '#ffb84d' : 'var(--accent-blue)';
        const modShadow = currentModloader === 'FABRIC' ? 'rgba(255, 184, 77, 0.4)' : 'rgba(var(--accent-blue-rgb), 0.4)';
        const modBox = document.getElementById('mod-display');
        if(modBox) {
            modBox.style.borderColor = modColor;
            modBox.style.color = modColor;
            modBox.style.boxShadow = `0 0 15px ${modShadow}`;
            modBox.innerText = currentModloader;
        }
    }

    function toggleDropdown(id) {
        if(document.getElementById(id)) document.getElementById(id).parentNode.classList.toggle('open');
    }

    function selectLangOpt(val, text, flagSrc) {
        if(document.getElementById('disc-lang-sel-text')) document.getElementById('disc-lang-sel-text').innerText = text;
        if(document.getElementById('disc-lang-sel-img')) document.getElementById('disc-lang-sel-img').src = flagSrc;
        if(document.getElementById('discord-lang-dropdown')) document.getElementById('discord-lang-dropdown').classList.remove('open');
    }

    document.addEventListener('click', (e) => {
        if(!e.target.closest('.fancy-dropdown')) {
            document.querySelectorAll('.fancy-dropdown').forEach(el => el.classList.remove('open'));
        }
        if(!e.target.closest('.sidebar-search')) {
            const res = document.getElementById('search-results');
            if(res) res.style.display = 'none';
        }
    });

    function onSearchChange(el) {
        const val = el.value.toLowerCase().trim();
        const resContainer = document.getElementById('search-results');

        document.querySelectorAll('.setting-block').forEach(b => b.style.display = 'block');

        if (val === "") {
            resContainer.style.display = 'none';
            return;
        }

        const t = translations[currentLang];
        const searchableItems = [
            { id: 'block-ram', tabId: 'tab-spiel', sideId: 't-tab-game', title: t.setRam || "Zugewiesener Arbeitsspeicher", desc: t.setRamD || "Wie viel Arbeitsspeicher der Spielinstanz zugewiesen werden soll" },
            { id: 'block-res', tabId: 'tab-spiel', sideId: 't-tab-game', title: t.setRes || "Spielauflösung", desc: t.setResD || "Stelle die Auflösung ein" },
            { id: 'block-vis', tabId: 'tab-spiel', sideId: 't-tab-game', title: t.setVis || "Sichtbarkeit beim Start", desc: t.setVisD || "Verhalten nach Spielstart" },
            { id: 'block-redeem', tabId: 'tab-spiel', sideId: 't-tab-game', title: t.setRedTitle || "Code Einlösen", desc: t.setRedDesc || "Code für Badges" },
            { id: 'block-discord-rp', tabId: 'tab-discord', sideId: 't-tab-discord', title: t.discRp || "Discord Rich Presence", desc: t.discRpDesc || "Spielstatus anzeigen" },
            { id: 'block-discord-hide', tabId: 'tab-discord', sideId: 't-tab-discord', title: t.discHide || "Bei Abwesenheit ausblenden", desc: t.discHideDesc || "Spielstatus verbergen" },
            { id: 'block-discord-lang', tabId: 'tab-discord', sideId: 't-tab-discord', title: t.discLang || "Discord Sprache", desc: t.discLangDesc || "Sprache für Discord" },
            { id: 'block-discord-join', tabId: 'tab-discord', sideId: 't-tab-discord', title: t.discJoin || "TENTIX Discord", desc: t.discJoinDesc || "Trete uns bei!" },
            { id: 'block-analytics', tabId: 'tab-privacy', sideId: 't-tab-priv', title: t.tPriv1 || "Analytik", desc: t.tPrivD1 || "Nutzererfahrung verbessern" },
            { id: 'block-ads', tabId: 'tab-privacy', sideId: 't-tab-priv', title: t.tPriv2 || "Optimierte Werbeanzeigen", desc: t.tPrivD2 || "Interessenbasierte Werbung" },
            { id: 'block-autostart', tabId: 'tab-updater', sideId: 't-tab-updater', title: "Autostart & Hintergrund", desc: "Starte TENTIX automatisch mit Windows" }
        ];

        let html = '';
        searchableItems.forEach(item => {
            if(item.title.toLowerCase().includes(val) || item.desc.toLowerCase().includes(val)) {
                html += `<div class="search-result-item" onclick="jumpToSetting('${item.tabId}', '${item.sideId}', '${item.id}')">
                            <span class="search-result-title">${item.title}</span>
                            <span class="search-result-desc">${item.desc}</span>
                         </div>`;
            }
        });

        if (html === '') {
            html = `<div style="padding: 15px; color: #666; font-size: 12px; text-align: center; font-style: italic;">Keine Ergebnisse gefunden</div>`;
        }
        resContainer.innerHTML = html;
        resContainer.style.display = 'block';
    }

    function jumpToSetting(tabId, sideId, blockId) {
        if(document.getElementById('search-results')) document.getElementById('search-results').style.display = 'none';
        if(document.getElementById('settings-search')) document.getElementById('settings-search').value = "";

        switchSettingsTab(tabId, document.getElementById(sideId));

        const targetBlock = document.getElementById(blockId);
        if(targetBlock) {
            targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetBlock.classList.remove('fancy-result-pulse');
            void targetBlock.offsetWidth;
            targetBlock.classList.add('fancy-result-pulse');
            setTimeout(() => targetBlock.classList.remove('fancy-result-pulse'), 1500);
        }
    }

    const COSMETICS_LIST = [
        {
            id: 'alpha',
            name: 'Alpha Cape',
            desc_de: 'Alpha Tester Umhang',
            desc_en: 'Alpha Tester Cape',
            gradient: ['#e65c00', '#f9d423'],
            roles: ['ALPHA'],
            roleName: 'Alpha Tester',
            badgeText: 'Alpha',
            badgeBg: 'linear-gradient(135deg, #e65c00 0%, #f9d423 100%)',
            badgeShadow: 'rgba(230, 92, 0, 0.4)',
            category: 'capes'
        },
        {
            id: 'beta',
            name: 'Beta Cape',
            desc_de: 'Beta Tester Umhang',
            desc_en: 'Beta Tester Cape',
            gradient: ['#11998e', '#38ef7d'],
            roles: ['BETA'],
            roleName: 'Beta Tester',
            badgeText: 'Beta',
            badgeBg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            badgeShadow: 'rgba(17, 153, 142, 0.4)',
            category: 'capes'
        },
        {
            id: 'tentix',
            name: 'TENTIX Cape',
            desc_de: 'Creator Umhang',
            desc_en: 'Creator Cape',
            gradient: ['#00d4ff', '#0072ff'],
            roles: ['OWNER', 'ADMIN', 'MOD', 'SUPP'],
            roleName: 'Owner / Team',
            badgeText: 'TENTIX',
            badgeBg: 'linear-gradient(135deg, #00d4ff 0%, #0072ff 100%)',
            badgeShadow: 'rgba(0, 212, 255, 0.4)',
            category: 'special'
        },
        {
            id: 'dev',
            name: 'Developer Cape',
            desc_de: 'Developer Umhang',
            desc_en: 'Developer Cape',
            gradient: ['#d53369', '#daae51'],
            roles: ['DEV'],
            roleName: 'Developer',
            badgeText: 'Developer',
            badgeBg: 'linear-gradient(135deg, #d53369 0%, #daae51 100%)',
            badgeShadow: 'rgba(213, 51, 105, 0.4)',
            category: 'special'
        },
        {
            id: 'twitch',
            name: 'Twitch Cape',
            desc_de: 'Twitch Creator Umhang',
            desc_en: 'Twitch Creator Cape',
            gradient: ['#9146FF', '#6441a5'],
            roles: ['TWITCH', 'CREATOR'],
            roleName: 'Twitch Creator',
            badgeText: 'Twitch',
            badgeBg: 'linear-gradient(135deg, #9146FF 0%, #6441a5 100%)',
            badgeShadow: 'rgba(145, 70, 255, 0.4)',
            category: 'special'
        },
        {
            id: 'yt',
            name: 'YouTube Cape',
            desc_de: 'YouTube Creator Umhang',
            desc_en: 'YouTube Creator Cape',
            gradient: ['#ff0000', '#cc0000'],
            roles: ['YT', 'CREATOR'],
            roleName: 'YouTube Creator',
            badgeText: 'YouTuber',
            badgeBg: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
            badgeShadow: 'rgba(255, 0, 0, 0.4)',
            category: 'special'
        }
    ];

    let activeCosmeticCategory = 'all';

    function filterCosmetics(category, element) {
        activeCosmeticCategory = category;
        document.querySelectorAll('#cosmetics-view .shop-cat-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (element) {
            element.classList.add('active');
        }
        renderCosmetics();
    }

    function renderCosmetics() {
        const grid = document.getElementById('cosmetics-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const checkRole = (allowedRoles) => {
            return (currentUserRoles || []).some(r => allowedRoles.includes(r));
        };
        
        let filteredCapes = COSMETICS_LIST;
        if (activeCosmeticCategory !== 'all') {
            filteredCapes = COSMETICS_LIST.filter(cape => cape.category === activeCosmeticCategory);
        }
        
        const ownedCapes = filteredCapes.filter(cape => checkRole(cape.roles));
        ownedCapes.sort((a, b) => a.name.localeCompare(b.name));
        
        const reorderedCapes = [];
        const numRows = Math.ceil(ownedCapes.length / 2);
        for (let r = 0; r < numRows; r++) {
            if (r < ownedCapes.length) {
                reorderedCapes.push(ownedCapes[r]);
            }
            const rightIndex = r + numRows;
            if (rightIndex < ownedCapes.length) {
                reorderedCapes.push(ownedCapes[rightIndex]);
            }
        }
        
        reorderedCapes.forEach(cape => {
            const description = currentLang === 'de' ? cape.desc_de : cape.desc_en;
            const isActive = equippedCosmetic === cape.id ? 'active' : '';
            
            grid.innerHTML += `
                <div class="cosmetic-card ${isActive}" id="cosmetic-card-${cape.id}" onclick="selectCosmetic('${cape.id}', this)" style="position: relative; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 25px 15px 15px 15px; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="position: absolute; top: 8px; right: 8px; font-size: 8px; padding: 2px 6px; border-radius: 4px; font-weight: 800; color: #fff; background: ${cape.badgeBg}; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 2px 8px ${cape.badgeShadow || 'rgba(0,0,0,0.3)'};">${cape.badgeText}</div>
                    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: center; height: 60px;">
                        <svg viewBox="0 0 40 80" style="width: 30px; height: 60px; filter: drop-shadow(0 4px 6px ${cape.gradient[0]}60);">
                            <defs>
                                <linearGradient id="gradient-${cape.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="${cape.gradient[0]}" />
                                    <stop offset="100%" stop-color="${cape.gradient[1]}" />
                                </linearGradient>
                            </defs>
                            <path d="M15,5 C25,5 30,12 30,25 L25,75 C25,77 22,77 20,75 L12,35 Z" fill="url(#gradient-${cape.id})" />
                            <path d="M15,5 L12,35 L20,75" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none" />
                        </svg>
                    </div>
                    <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px;">${cape.name}</div>
                    <div style="font-size: 9px; color: #888; font-weight: 500;">${description}</div>
                </div>
            `;
        });
        
        updateCosmeticsLocks();
    }

    function showBetaOverlay() {
        const betaOverlay = document.getElementById('beta-overlay');
        if (betaOverlay) {
            const betaLangSelect = document.getElementById('beta-lang-select');
            if (betaLangSelect) {
                betaLangSelect.value = currentLang;
            }
            updateBetaOverlayLang();
            
            betaOverlay.style.display = 'flex';
            setTimeout(() => {
                betaOverlay.classList.add('show');
            }, 10);
        }
    }

    function hideBetaOverlay() {
        const betaOverlay = document.getElementById('beta-overlay');
        if (betaOverlay) {
            betaOverlay.classList.remove('show');
            setTimeout(() => {
                betaOverlay.style.display = 'none';
            }, 500);
        }
    }

    function updateBetaOverlayLang() {
        const select = document.getElementById('beta-lang-select');
        if (!select) return;
        const lang = select.value;
        currentLang = lang;
        localStorage.setItem('tentix_lang', lang);
        
        const title = document.getElementById('beta-title');
        const desc = document.getElementById('beta-desc');
        const btn = document.getElementById('beta-submit-btn');
        
        if (lang === 'de') {
            if (title) title.innerText = "BETA ZUGANG";
            if (desc) desc.innerText = "Bitte gib deinen Beta-Key ein, um fortzufahren.";
            if (btn) btn.innerText = "VERIFIZIEREN";
        } else {
            if (title) title.innerText = "BETA ACCESS";
            if (desc) desc.innerText = "Please enter your Beta Key to proceed.";
            if (btn) btn.innerText = "VERIFY";
        }
    }

    function submitBetaCode() {
        const inputField = document.getElementById('beta-input-field');
        if (!inputField) return;
        const key = inputField.value.trim().toUpperCase();
        
        if (key === 'BETA' || key.startsWith('BETA-')) {
            localStorage.setItem('tentix_beta_verified', 'true');
            showToast(currentLang === 'de' ? "ZUGANG GEWÄHRT!" : "ACCESS GRANTED!", "success");
            hideBetaOverlay();
            proceedToMainMenu();
        } else {
            showToast(currentLang === 'de' ? "UNGÜLTIGER BETA KEY!" : "INVALID BETA KEY!", "error");
        }
    }

    function closeNewsPane() {
        const pane = document.getElementById('news-pane');
        const btn = document.getElementById('news-toggle-btn');
        const playWrapper = document.getElementById('play-container-wrapper');
        const annBar = document.getElementById('announcement-bar');
        if(!pane || !btn || !playWrapper) return;
        
        pane.classList.remove('open');
        btn.classList.remove('pane-open');
        playWrapper.classList.remove('news-open');
        localStorage.setItem('tentix_news_open', 'false');
        if(annBar && currentEventData) annBar.classList.add('show');
    }

    function proceedToMainMenu() {
        const lScreen = document.getElementById('loading-screen');
        if(lScreen) {
            lScreen.style.opacity = "0";
            setTimeout(() => {
                lScreen.style.display='none';
                isAppReady = true;

                const menu = document.getElementById('main-menu-wrapper');
                if(menu) {
                    menu.style.visibility='visible';
                    menu.style.opacity=1;
                }

                applyLoginState();
                updateMaintenanceBannerVisibility();

                if(localStorage.getItem('tentix_news_open') === 'true' && isLoggedIn) {
                    if(document.getElementById('news-pane')) document.getElementById('news-pane').classList.add('open');
                    if(document.getElementById('news-toggle-btn')) document.getElementById('news-toggle-btn').classList.add('pane-open');
                    if(document.getElementById('play-container-wrapper')) document.getElementById('play-container-wrapper').classList.add('news-open');
                }

                const appBg = document.getElementById('app-bg');
                if(appBg) appBg.style.opacity = 1;

                const bgCanvas = document.getElementById('bg-canvas');
                if(bgCanvas) bgCanvas.style.opacity = 1;

                const winControls = document.getElementById('top-right-controls');
                if(winControls) {
                    winControls.style.visibility = 'visible';
                    winControls.style.opacity = 1;
                }

                fetchEvents();

            }, 800);
        }
    }

    function navTo(page) {
        closeNewsPane();
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => { if(el.getAttribute('data-page') === page) el.classList.add('active'); });
        setTimeout(updateMaintenanceBannerVisibility, 600); // Allow view switch animation to finish, then update banner

        const menu = document.getElementById('main-menu-wrapper');
        const shop = document.getElementById('shop-view');
        const explore = document.getElementById('explore-view');
        const cosmetics = document.getElementById('cosmetics-view');
        const tentixplus = document.getElementById('tentixplus-view');
        const canvas = document.getElementById('bg-canvas');
        const socials = document.getElementById('ui-social-container');
        const newsBtn = document.getElementById('news-toggle-btn');
        const annBar = document.getElementById('announcement-bar');

        if(!menu || !shop || !explore || !canvas || !cosmetics || !tentixplus) return;

        if(page === 'start') {
            shop.style.opacity = '0';
            explore.style.opacity = '0';
            cosmetics.style.opacity = '0';
            tentixplus.style.opacity = '0';
            canvas.style.filter = 'blur(0px)';

            setTimeout(() => {
                shop.style.visibility = 'hidden'; shop.style.display = 'none';
                explore.style.visibility = 'hidden'; explore.style.display = 'none';
                cosmetics.style.visibility = 'hidden'; cosmetics.style.display = 'none';
                tentixplus.style.visibility = 'hidden'; tentixplus.style.display = 'none';
                menu.style.display = 'block';

                setTimeout(() => {
                    menu.style.opacity = '1';
                }, 50);

                if(isLoggedIn) {
                    if(socials) { socials.style.display = 'flex'; setTimeout(() => socials.style.opacity = '1', 50); }
                    if(newsBtn) { newsBtn.style.display = 'flex'; setTimeout(() => newsBtn.style.opacity = '1', 50); }
                    if(annBar && currentEventData && !document.getElementById('play-container-wrapper').classList.contains('news-open')) {
                        annBar.classList.add('show');
                    }
                }
            }, 500);
        } else if (page === 'explore') {
            menu.style.opacity = '0';
            shop.style.opacity = '0';
            cosmetics.style.opacity = '0';
            tentixplus.style.opacity = '0';
            canvas.style.filter = 'blur(10px)';

            if(socials) { socials.style.opacity = '0'; setTimeout(() => socials.style.display = 'none', 500); }
            if(newsBtn) { newsBtn.style.opacity = '0'; setTimeout(() => newsBtn.style.display = 'none', 500); }
            if(annBar) annBar.classList.remove('show');

            setTimeout(() => {
                menu.style.display = 'none';
                shop.style.visibility = 'hidden'; shop.style.display = 'none';
                cosmetics.style.visibility = 'hidden'; cosmetics.style.display = 'none';
                tentixplus.style.visibility = 'hidden'; tentixplus.style.display = 'none';

                explore.style.visibility = 'visible'; explore.style.display = 'flex';
                setTimeout(() => explore.style.opacity = '1', 50);

                if (document.getElementById('explore-results-box').innerHTML.includes('Lade Mods') ||
                    document.getElementById('explore-results-box').innerHTML.trim() === '') {
                    triggerModSearch(false);
                }
            }, 500);
        } else if (page === 'cosmetics') {
            menu.style.opacity = '0';
            explore.style.opacity = '0';
            shop.style.opacity = '0';
            tentixplus.style.opacity = '0';
            canvas.style.filter = 'blur(10px)';

            if(socials) { socials.style.opacity = '0'; setTimeout(() => socials.style.display = 'none', 500); }
            if(newsBtn) { newsBtn.style.opacity = '0'; setTimeout(() => newsBtn.style.display = 'none', 500); }
            if(annBar) annBar.classList.remove('show');

            setTimeout(() => {
                menu.style.display = 'none';
                explore.style.visibility = 'hidden'; explore.style.display = 'none';
                shop.style.visibility = 'hidden'; shop.style.display = 'none';
                tentixplus.style.visibility = 'hidden'; tentixplus.style.display = 'none';

                cosmetics.style.visibility = 'visible'; cosmetics.style.display = 'flex';
                setTimeout(() => cosmetics.style.opacity = '1', 50);
                
                initCosmeticsViewer();
                updateCosmeticsSkin();
                renderCosmetics();
            }, 500);
        } else if (page === 'shop') {
            menu.style.opacity = '0';
            explore.style.opacity = '0';
            cosmetics.style.opacity = '0';
            tentixplus.style.opacity = '0';
            canvas.style.filter = 'blur(10px)';

            if(socials) { socials.style.opacity = '0'; setTimeout(() => socials.style.display = 'none', 500); }
            if(newsBtn) { newsBtn.style.opacity = '0'; setTimeout(() => newsBtn.style.display = 'none', 500); }
            if(annBar) annBar.classList.remove('show');

            setTimeout(() => {
                menu.style.display = 'none';
                explore.style.visibility = 'hidden'; explore.style.display = 'none';
                cosmetics.style.visibility = 'hidden'; cosmetics.style.display = 'none';
                tentixplus.style.visibility = 'hidden'; tentixplus.style.display = 'none';

                shop.style.visibility = 'visible'; shop.style.display = 'flex';
                setTimeout(() => shop.style.opacity = '1', 50);
                loadShop();
                initShopViewer();
                updateShopViewerSkin();
            }, 500);
        } else if (page === 'tentixplus') {
            menu.style.opacity = '0';
            explore.style.opacity = '0';
            cosmetics.style.opacity = '0';
            shop.style.opacity = '0';
            canvas.style.filter = 'blur(10px)';

            if(socials) { socials.style.opacity = '0'; setTimeout(() => socials.style.display = 'none', 500); }
            if(newsBtn) { newsBtn.style.opacity = '0'; setTimeout(() => newsBtn.style.display = 'none', 500); }
            if(annBar) annBar.classList.remove('show');

            setTimeout(() => {
                menu.style.display = 'none';
                explore.style.visibility = 'hidden'; explore.style.display = 'none';
                cosmetics.style.visibility = 'hidden'; cosmetics.style.display = 'none';
                shop.style.visibility = 'hidden'; shop.style.display = 'none';

                tentixplus.style.visibility = 'visible'; tentixplus.style.display = 'flex';
                setTimeout(() => tentixplus.style.opacity = '1', 50);
            }, 500);
        }
    }

    async function loginProcess() {
        closeAllPopups();
        const overlay = document.getElementById('action-overlay');
        const text = document.getElementById('action-text');
        if(text) text.innerText = currentLang === 'de' ? "VERBINDE..." : "CONNECTING...";
        if(overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.style.opacity = '1', 10);
        }

        try {
            if(!window.api || !window.api.loginWithMicrosoft) {
                throw new Error("API Missing");
            }
            const res = await window.api.loginWithMicrosoft();
            if(res.success) {
                localStorage.setItem('tentix_logged', 'true');
                localStorage.setItem('tentix_user', res.name);
                localStorage.setItem('tentix_uuid', res.uuid);
                localStorage.setItem('tentix_mc_token', JSON.stringify(res.mclc_token));

                checkAuthState();
                updateUI();
                applyLoginState();
            } else {
                showErrorModal();
            }
        } catch (err) {
            console.error(err);
            showErrorModal();
        } finally {
            if(overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        }
    }

    async function playMinecraft() {
        if(!navigator.onLine) return;
        const tokenStr = localStorage.getItem('tentix_mc_token');
        if(!tokenStr) return;

        const playBtn = document.getElementById('play-btn');
        if(playBtn) playBtn.disabled = true;

        if(document.getElementById('dl-container')) document.getElementById('dl-container').style.display = 'block';

        const resParts = (localStorage.getItem('tentix_res') || "1920x1080").split('x');

        try {
            const result = await window.api.launchMinecraft({
                token: JSON.parse(tokenStr),
                version: lastVer,
                ram: localStorage.getItem('tentix_ram_raw') || "4G",
                resWidth: parseInt(resParts[0]),
                resHeight: parseInt(resParts[1]),
                modloader: currentModloader
            });

            if (!result.success) {
                if(document.getElementById('dl-container')) document.getElementById('dl-container').style.display = 'none';
                if(playBtn) {
                    playBtn.innerText = currentLang === 'de' ? "SPIELEN" : "PLAY";
                    playBtn.disabled = false;
                }
                alert("Launch Error:\n" + result.error);
            }
        } catch(e) {
            if(document.getElementById('dl-container')) document.getElementById('dl-container').style.display = 'none';
            if(playBtn) {
                playBtn.innerText = currentLang === 'de' ? "SPIELEN" : "PLAY";
                playBtn.disabled = false;
            }
            alert("Launch Error:\n" + e.message);
        }
    }

    function getProgressBarLabel(taskType) {
        const type = (taskType || '').toLowerCase();
        if (currentLang === 'de') {
            if (type === 'natives') return 'Systembibliotheken entpacken...';
            if (type === 'classes' || type === 'jar' || type === 'libraries' || type === 'library') return 'Spieldateien vorbereiten...';
            if (type === 'assets' || type === 'resource') return 'Grafiken & Sounds herunterladen...';
            if (type === 'mods' || type === 'mod') return 'Client-Mods synchronisieren...';
            return 'Dateien werden geladen...';
        } else {
            if (type === 'natives') return 'Extracting system libraries...';
            if (type === 'classes' || type === 'jar' || type === 'libraries' || type === 'library') return 'Preparing game libraries...';
            if (type === 'assets' || type === 'resource') return 'Downloading game graphics & audio...';
            if (type === 'mods' || type === 'mod') return 'Syncing client mods list...';
            return 'Loading game files...';
        }
    }

    if(window.api && window.api.onLaunchProgress) {
        window.api.onLaunchProgress((data) => {
            if(data.type === 'progress') {
                if(document.getElementById('dl-bar')) document.getElementById('dl-bar').style.width = ((data.task / data.total) * 100) + "%";
                if(document.getElementById('dl-status')) document.getElementById('dl-status').innerText = getProgressBarLabel(data.taskType);
                if(document.getElementById('dl-stats')) document.getElementById('dl-stats').innerText = data.task + " / " + data.total;
                
                if (window.api.updateDiscordRPStatus) {
                    window.api.updateDiscordRPStatus({ username: savedName, state: (currentLang === 'de' ? "Installiert Spieldateien..." : "Installing files...") });
                }
            }
            if(data.type === 'data') {
                if(document.getElementById('dl-status')) document.getElementById('dl-status').innerText = "STARTING...";
                if(document.getElementById('play-btn')) document.getElementById('play-btn').innerText = "GAME RUNNING";
                if(localStorage.getItem('tentix_vis') === 'hide' && window.api.minimize) { window.api.minimize(); }
                
                if (window.api.updateDiscordRPStatus) {
                    window.api.updateDiscordRPStatus({ username: savedName, state: (currentLang === 'de' ? "Spielt auf TENTIX.tv" : "Playing on TENTIX.tv"), startTimestamp: Date.now() });
                }
            }
            if(data.type === 'close') {
                if(document.getElementById('dl-container')) document.getElementById('dl-container').style.display = 'none';
                if(document.getElementById('play-btn')) { document.getElementById('play-btn').innerText = currentLang === 'de' ? "SPIELEN" : "PLAY"; document.getElementById('play-btn').disabled = false; }
                
                if (window.api.updateDiscordRPStatus) {
                    window.api.updateDiscordRPStatus({ username: savedName, state: "Im Menü", resetTime: true });
                }
            }
        });
    }

    if(window.api && window.api.onMaximized) { window.api.onMaximized((isMax) => { if (isMax) document.body.classList.add('is-maximized'); else document.body.classList.remove('is-maximized'); }); }

    const canvas = document.getElementById('bg-canvas'); const ctx = canvas ? canvas.getContext('2d') : null; let particles = [];
    function initParticles() { if(!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; particles = []; for(let i=0; i<35; i++) particles.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2 + 1, vx: (Math.random()-0.5)*0.2, vy: Math.random()*0.5 + 0.2}); }
    function animate() { if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = maintenanceModeActive ? "rgba(255, 75, 75, 0.6)" : "rgba(0, 212, 255, 0.6)"; ctx.shadowColor = maintenanceModeActive ? "rgba(255, 75, 75, 0.8)" : "rgba(0, 212, 255, 0.8)"; ctx.shadowBlur = 12; particles.forEach(p => { p.x += p.vx; p.y -= p.vy; if(p.x<0 || p.x>canvas.width) p.vx*=-1; if(p.y<0) p.y = canvas.height; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); }); requestAnimationFrame(animate); }
    initParticles(); animate(); window.onresize = initParticles;

    function applyMaintenanceModeState(active) {
        if (typeof maintenanceModeActive !== 'undefined' && maintenanceModeActive === true && active === false) {
            localStorage.setItem('tentix_last_maintenance', new Date().toISOString());
        }
        maintenanceModeActive = active;
        document.body.classList.toggle('maintenance-active', active);
        
        // 1. Accent color variables
        if (active) {
            document.documentElement.style.setProperty('--accent-blue', '#ff4b4b');
            document.documentElement.style.setProperty('--accent-blue-rgb', '255, 75, 75');
            document.documentElement.style.setProperty('--accent-gradient-sec', '#ff1a1a');
            document.documentElement.style.setProperty('--news-pane-width', '380px');
        } else {
            document.documentElement.style.setProperty('--accent-blue', '#00d4ff');
            document.documentElement.style.setProperty('--accent-blue-rgb', '0, 212, 255');
            document.documentElement.style.setProperty('--accent-gradient-sec', '#0072ff');
            document.documentElement.style.setProperty('--news-pane-width', '320px');
        }

        // Swap logo images
        const logoSrc = active ? '../assets/TENTIX2.png' : '../assets/TENTIX.png';
        document.querySelectorAll('.startup-logo, .sidebar-logo, #tentixplus-modal img').forEach(img => {
            img.src = logoSrc;
        });

        // 2. Banner display & syncing
        localStorage.setItem('tentix_maintenance_active', active ? 'true' : 'false');
        updateMaintenanceBannerVisibility();
        
        // Sync checkbox in admin control tab
        const maintCheckbox = document.getElementById('maint-global-active');
        if (maintCheckbox) {
            maintCheckbox.checked = active;
        }

        // 3. Gray out and disable TENTIX+ nav button
        const tentixPlusNav = document.querySelector('.nav-item[data-page="tentixplus"]');
        if (tentixPlusNav) {
            if (active) {
                tentixPlusNav.classList.add('maint-disabled');
            } else {
                tentixPlusNav.classList.remove('maint-disabled');
            }
        }

        // 4. Update news alert status in real-time
        loadNews();
    }

    function BootSequence() {
        // Query maintenance status on startup
        fetch(`${API_BASE_URL}/api/system/status`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    applyMaintenanceModeState(data.maintenance);
                }
            })
            .catch(() => {
                // Fallback to local default / localStorage state if offline
                applyMaintenanceModeState(localStorage.getItem('tentix_sim_maintenance') === 'true');
            });

        updateOnlineStatus();

        const resParts = (localStorage.getItem('tentix_res') || "1920x1080").split('x');
        if(document.getElementById('res-w')) document.getElementById('res-w').value = resParts[0] || "1920";
        if(document.getElementById('res-h')) document.getElementById('res-h').value = resParts[1] || "1080";

        const visSetting = localStorage.getItem('tentix_vis') || 'keep';
        if (visSetting === 'keep') {
            if(document.getElementById('radio-keep')) document.getElementById('radio-keep').querySelector('.lunar-radio').classList.add('active');
            if(document.getElementById('radio-hide')) document.getElementById('radio-hide').querySelector('.lunar-radio').classList.remove('active');
        } else {
            if(document.getElementById('radio-keep')) document.getElementById('radio-keep').querySelector('.lunar-radio').classList.remove('active');
            if(document.getElementById('radio-hide')) document.getElementById('radio-hide').querySelector('.lunar-radio').classList.add('active');
        }

        checkAuthState();
        updateUI();
        checkBanStatus();
        
        const customSkin = localStorage.getItem('tentix_custom_skin');
        if (customSkin) {
            getAvatarFromSkin(customSkin, (avatarUrl) => {
                if (avatarUrl && document.getElementById('user-avatar')) {
                    document.getElementById('user-avatar').src = avatarUrl;
                }
            });
        }
        
        // Dynamically load Minecraft versions and Fabric meta lists on startup
        loadMinecraftVersions();
        fetchFabricVersions();
        initSkinDragAndDrop();

        setTimeout(() => {
            if(isLoggedIn) {
                startHeartbeat();
            }
            checkTeamInvites();
            updateDiscordRP();
        }, 1500);

        const badge = document.getElementById('bell-badge');
        if(badge) {
            badge.innerText = '0';
            badge.classList.remove('show');
            badge.classList.add('empty');
        }

        // Initialize extended premium systems
        loadFriends();
        initPermissions();
        checkCreatorCodeExpiration();
        updateNavMaintenanceState();

        let progress = 0;
        const loadingInt = setInterval(() => {
            progress += Math.random() * 8;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInt);

                setTimeout(async () => {
                    await loadBadges();

                    const isStaff = (currentUserRoles || []).some(r => r === 'OWNER' || r === 'DEV' || r === 'ADMIN');
                    const isBetaVerified = localStorage.getItem('tentix_beta_verified') === 'true';

                    if (isStaff || isBetaVerified) {
                        proceedToMainMenu();
                    } else {
                        showBetaOverlay();
                    }
                }, 600);
            }

        }, 100);

        if (window.api && window.api.getTotalRam) {
            window.api.getTotalRam().then(total => {
                systemTotalRam = total;
                const slider = document.getElementById('ram-slider');
                if(slider) {
                    slider.max = total;
                    if(document.getElementById('ram-max-label')) document.getElementById('ram-max-label').innerText = total + " GB";

                    let savedRam = localStorage.getItem('tentix_ram_raw') || "4G";
                    let val = parseInt(savedRam);
                    slider.value = val.toString();

                    if(document.getElementById('ram-val-current')) document.getElementById('ram-val-current').innerText = val + " GB";

                    let freeRam = total - val;
                    if(freeRam < 0) freeRam = 0;
                    if(document.getElementById('max-ram-display')) document.getElementById('max-ram-display').innerText = freeRam;

                    updateRamTag(val, total);
                }
            });
        }

        if(window.api && window.api.onUpdateStatus) {
            window.api.onUpdateStatus((data) => {
                onUpdateStatusReceived(data);
            });
        }
        if(window.api && window.api.onUpdateProgress) {
            window.api.onUpdateProgress((percent) => {
                onUpdateProgressReceived(percent);
            });
        }
    }

    function setLang(l, e) { if(e) e.stopPropagation(); currentLang = l; localStorage.setItem('tentix_lang', l); updateUI(); }

    function setRadioVis(state) {
        document.querySelectorAll('#tab-spiel .lunar-radio-row .lunar-radio').forEach(el => el.classList.remove('active'));
        if(state === 'keep' && document.getElementById('radio-keep')) document.getElementById('radio-keep').querySelector('.lunar-radio').classList.add('active');
        else if (document.getElementById('radio-hide')) document.getElementById('radio-hide').querySelector('.lunar-radio').classList.add('active');
        localStorage.setItem('tentix_vis', state);
    }

    function updateFromSlider(val) {
        if(document.getElementById('ram-val-current')) document.getElementById('ram-val-current').innerText = val + " GB";
        localStorage.setItem('tentix_ram_raw', val + "G");

        let freeRam = systemTotalRam - parseInt(val);
        if(freeRam < 0) freeRam = 0;
        if(document.getElementById('max-ram-display')) document.getElementById('max-ram-display').innerText = freeRam;

        updateRamTag(parseInt(val), systemTotalRam);
    }

    function updateRes() {
        const w = document.getElementById('res-w') ? document.getElementById('res-w').value : "1920";
        const h = document.getElementById('res-h') ? document.getElementById('res-h').value : "1080";
        localStorage.setItem('tentix_res', `${w}x${h}`);
    }

    function handleAccountClick() { closeAllPopups(); if(document.getElementById('account-card')) document.getElementById('account-card').style.display = 'flex'; if(document.getElementById('click-backdrop')) document.getElementById('click-backdrop').style.display = 'block'; }

    function toggleInbox(e) {
        if(e) e.stopPropagation();
        closeAllPopups();
        if(document.getElementById('inbox-popup')) document.getElementById('inbox-popup').style.display = 'flex';
        if(document.getElementById('click-backdrop')) document.getElementById('click-backdrop').style.display = 'block';

        const badge = document.getElementById('bell-badge');
        if(badge) {
            badge.innerText = '0';
            badge.classList.remove('show');
            badge.classList.add('empty');
        }
    }

    function openSettings() {
        closeAllPopups();
        if(document.getElementById('settings-overlay')) document.getElementById('settings-overlay').style.display = 'flex';
        if(document.getElementById('click-backdrop')) document.getElementById('click-backdrop').style.display = 'block';
        updateMaintenanceBannerVisibility();
    }

    function toggleVersions(e) { if(e) e.stopPropagation(); closeAllPopups(); if(document.getElementById('version-overlay')) document.getElementById('version-overlay').style.display = 'grid'; if(document.getElementById('click-backdrop')) document.getElementById('click-backdrop').style.display = 'block'; }

    function switchSettingsTab(tabId, el) {
        const searchInput = document.getElementById('settings-search');
        if(searchInput) {
            searchInput.value = "";
            onSearchChange(searchInput);
        }

        const scrollArea = document.getElementById('settings-scroll-area');
        if(scrollArea) scrollArea.scrollTop = 0;

        document.querySelectorAll('.settings-tab').forEach(t => {
            t.classList.remove('active-tab');
            t.querySelectorAll('.setting-block').forEach(b => b.style.display = 'block');
        });
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        if(document.getElementById(tabId)) document.getElementById(tabId).classList.add('active-tab');
        if(el) el.classList.add('active');
    }

    function closeAllPopups() {
        const ids = ['account-card', 'inbox-popup', 'version-overlay', 'settings-overlay', 'click-backdrop'];
        ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = 'none'; });
        const dLogin = document.getElementById('dash-login-modal');
        if(dLogin && dLogin.style.display !== 'none') {
            dLogin.style.opacity = '0'; dLogin.classList.remove('show'); setTimeout(()=>dLogin.style.display='none',300);
        }
        updateMaintenanceBannerVisibility();
    }

    function selectVer(v, e) {
        if(e) e.stopPropagation();

        const isSnapshot = v.includes('w') || v.includes('pre') || v.includes('rc') || v.toLowerCase().includes('snapshot');
        if (currentModloader === 'FABRIC') {
            let isSupported = true;
            if (fabricSupportedVersions && fabricSupportedVersions.length > 0) {
                isSupported = fabricSupportedVersions.includes(v);
            } else {
                isSupported = !['1.7.10', '1.8.9', '1.12.2'].includes(v) && !isSnapshot;
            }
            if (!isSupported) {
                showVersionError();
                return;
            }
        }

        lastVer = v;
        localStorage.setItem('tentix_last_ver', v);
        updateUI();
        closeAllPopups();
    }

    function showVersionError() {
        const t = translations[currentLang];
        document.getElementById('ui-err-title').innerText = t.errVerTitle || "VERSION FEHLER";
        document.getElementById('ui-err-desc').innerText = t.errVerDesc || "Fabric ist für diese Version nicht verfügbar.";

        const modal = document.getElementById('error-modal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.classList.add('show');
        }, 10);
    }

    function copyUUID(e) {
        e.stopPropagation();
        if (!isLoggedIn) return;
        navigator.clipboard.writeText(uuidValue).then(() => {
            showToast(translations[currentLang].copied, "success");
        });
    }

    function toggleNewsPane() {
        const pane = document.getElementById('news-pane');
        const btn = document.getElementById('news-toggle-btn');
        const playWrapper = document.getElementById('play-container-wrapper');
        const annBar = document.getElementById('announcement-bar');
        if(!pane || !btn || !playWrapper) return;

        const isOpen = pane.classList.contains('open');

        if (isOpen) {
            pane.classList.remove('open');
            btn.classList.remove('pane-open');
            playWrapper.classList.remove('news-open');
            localStorage.setItem('tentix_news_open', 'false');
            if(annBar && currentEventData) annBar.classList.add('show');
        } else {
            pane.classList.add('open');
            btn.classList.add('pane-open');
            playWrapper.classList.add('news-open');
            localStorage.setItem('tentix_news_open', 'true');
            if(annBar) annBar.classList.remove('show');
        }
    }

    function updateDiscordRP() {
        if(window.api && window.api.updateDiscordRP) {
            const enabled = localStorage.getItem('tentix_drp') !== 'false';
            const hideAway = localStorage.getItem('tentix_drp_hide') === 'true';
            window.api.updateDiscordRP({ enabled, hideAway });
        }
    }

    function toggleSwitch(element) {
        if(element) {
            element.classList.toggle('active');

            if(element.id === 'ts-discord-hide') {
                localStorage.setItem('tentix_drp_hide', element.classList.contains('active'));
                updateDiscordHideTag(element);
                updateDiscordRP();
            }
            if(element.id === 'ts-discord-rp') {
                localStorage.setItem('tentix_drp', element.classList.contains('active'));
                updateDiscordRP();
            }
            if(element.id === 'ts-ads') {
                localStorage.setItem('tentix_ads_enabled', element.classList.contains('active'));
            }
        }
    }

    function toggleAutostart(element) {
        if(element) {
            element.classList.toggle('active');
            const isEnabled = element.classList.contains('active');
            localStorage.setItem('tentix_autostart', isEnabled);
            if(window.api && window.api.setAutostart) {
                window.api.setAutostart(isEnabled);
            }
        }
    }

    function resetRam() {
        if (window.api && window.api.getTotalRam) {
            window.api.getTotalRam().then(total => {
                let recommended = 4;
                if (total >= 32) recommended = 12; else if (total >= 16) recommended = 6; else if (total >= 8) recommended = 3; else recommended = 2;

                const slider = document.getElementById('ram-slider');
                if(slider) {
                    slider.value = recommended.toString();
                    updateFromSlider(recommended);
                }
            });
        }
    }

    function showErrorModal() {
        const modal = document.getElementById('error-modal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.classList.add('show');
        }, 10);
    }

    function closeErrorModal() {
        const modal = document.getElementById('error-modal');
        modal.style.opacity = '0';
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    function openMaintenanceInfoModal() {
        const modal = document.getElementById('maintenance-info-modal');
        
        const deTitle = document.getElementById('maint-de-title');
        const deText = document.getElementById('maint-de-text');
        const enTitle = document.getElementById('maint-en-title');
        const enText = document.getElementById('maint-en-text');
        
        if (deTitle && deText && enTitle && enText) {
            deTitle.style.display = currentLang === 'de' ? 'block' : 'none';
            deText.style.display = currentLang === 'de' ? 'block' : 'none';
            enTitle.style.display = currentLang === 'en' ? 'block' : 'none';
            enText.style.display = currentLang === 'en' ? 'block' : 'none';
        }
        
        const modalTitle = document.getElementById('ui-maint-modal-title');
        if (modalTitle) {
            modalTitle.innerText = currentLang === 'de' ? 'WARTUNGSMODUS' : 'MAINTENANCE MODE';
        }
        const closeBtn = document.getElementById('ui-maint-close-btn');
        if (closeBtn) {
            closeBtn.innerText = currentLang === 'de' ? 'SCHLIESSEN' : 'CLOSE';
        }
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.classList.add('show');
        }, 10);
    }

    function closeMaintenanceInfoModal() {
        const modal = document.getElementById('maintenance-info-modal');
        modal.style.opacity = '0';
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }



    function logout() {
        closeAllPopups();
        const overlay = document.getElementById('action-overlay');
        const text = document.getElementById('action-text');
        text.innerText = currentLang === 'de' ? "ABMELDEN..." : "LOGGING OUT...";
        overlay.style.display = 'flex';
        setTimeout(() => overlay.style.opacity = '1', 10);

        setTimeout(() => {
            localStorage.removeItem('tentix_logged');
            localStorage.removeItem('tentix_user');
            localStorage.removeItem('tentix_uuid');
            localStorage.removeItem('tentix_mc_token');

            checkAuthState();
            updateUI();
            applyLoginState();

            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
        }, 800);
    }

    function createClickExplosion(e) {
        if (!e) return;
        const x = e.clientX;
        const y = e.clientY;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            document.body.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 15 + Math.random() * 55;
            const tx = Math.cos(angle) * speed;
            const ty = Math.sin(angle) * speed;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 500 + Math.random() * 300,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    function openTentixPlusModal(e) {
        if (e) createClickExplosion(e);
        closeAllPopups();
        const modal = document.getElementById('tentixplus-modal');
        const card = document.getElementById('tentixplus-modal-card');
        if (modal && card) {
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }
    }

    function closeTentixPlusModal() {
        const modal = document.getElementById('tentixplus-modal');
        const card = document.getElementById('tentixplus-modal-card');
        if (modal && card) {
            modal.style.opacity = '0';
            card.style.transform = 'scale(0.7)';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    let shopViewer = null;

    function initShopViewer() {
        if (shopViewer) return;
        try {
            const canvas = document.getElementById('shop-skin-canvas');
            if (!canvas) return;
            
            shopViewer = new skinview3d.SkinViewer({
                canvas: canvas,
                width: 180,
                height: 210
            });
            
            shopViewer.controls.enableZoom = true;
            shopViewer.controls.minPolarAngle = 0.3;
            shopViewer.controls.maxPolarAngle = 1.9;
            
            shopViewer.autoRotate = true;
            shopViewer.autoRotateSpeed = 0.5;
            shopViewer.animations.add(skinview3d.WalkingAnimation).speed = 0.6;
            
            updateShopViewerSkin();
        } catch (e) {
            console.error("Failed to initialize shop skinview3d:", e);
        }
    }

    function updateShopViewerSkin() {
        if (!shopViewer) return;
        shopViewer.model = skinChangerModelType;
        const customSkin = localStorage.getItem('tentix_custom_skin');
        if (customSkin) {
            shopViewer.loadSkin(customSkin, { model: skinChangerModelType });
            return;
        }
        let skinUrl = 'https://minotar.net/skin/MHF_Steve';
        if (isLoggedIn && uuidValue && uuidValue !== 'NOT LOGGED IN') {
            skinUrl = `https://minotar.net/skin/${uuidValue.trim()}`;
        } else if (isLoggedIn && savedName && savedName !== 'GUEST') {
            skinUrl = `https://minotar.net/skin/${savedName.trim()}`;
        }
        shopViewer.loadSkin(skinUrl, { model: skinChangerModelType });
    }

    function previewCosmeticInShop(cosmeticId, event) {
        if (event) event.stopPropagation();
        
        initShopViewer();
        if (!shopViewer) return;

        document.querySelectorAll('.shop-product-card').forEach(card => {
            card.classList.remove('previewing');
        });
        
        if (event && event.target) {
            let target = event.target;
            while (target && !target.classList.contains('shop-product-card')) {
                target = target.parentNode;
            }
            if (target) {
                target.classList.add('previewing');
            }
        }

        const capeObj = COSMETICS_LIST.find(c => c.id === cosmeticId);
        if (capeObj) {
            const dataUrl = generateCapeDataUrl(cosmeticId);
            shopViewer.loadCape(dataUrl);
            const nameEl = document.getElementById('shop-preview-name');
            if (nameEl) nameEl.innerText = capeObj.name;
            showToast(currentLang === 'de' ? `${capeObj.name} in 3D geladen!` : `${capeObj.name} loaded in 3D!`, "info");
        }
    }

    let cosmeticsViewer = null;

    function initCosmeticsViewer() {
        if (cosmeticsViewer) return;
        try {
            const canvas = document.getElementById('cosmetics-skin-canvas');
            if (!canvas) return;
            
            cosmeticsViewer = new skinview3d.SkinViewer({
                canvas: canvas,
                width: 320,
                height: 420
            });
            
            cosmeticsViewer.controls.enableZoom = true;
            cosmeticsViewer.controls.minPolarAngle = 0.3; // Limit overhead angle
            cosmeticsViewer.controls.maxPolarAngle = 1.9; // Stop before looking under feet/flipping upside down
            
            cosmeticsViewer.autoRotate = true;
            cosmeticsViewer.autoRotateSpeed = 0.5;
            
            // Add slow-motion walking animation
            cosmeticsViewer.animations.add(skinview3d.WalkingAnimation).speed = 0.6;
            
            updateCosmeticsSkin();

            const savedCape = localStorage.getItem('tentix_equipped_cosmetic');
            if (savedCape && savedCape !== 'none') {
                const capeObj = COSMETICS_LIST.find(c => c.id === savedCape);
                if (capeObj) {
                    const hasAccess = (currentUserRoles || []).some(r => capeObj.roles.includes(r));
                    if (hasAccess) {
                        const dataUrl = generateCapeDataUrl(savedCape);
                        cosmeticsViewer.loadCape(dataUrl);
                        equippedCosmetic = savedCape;
                    } else {
                        localStorage.removeItem('tentix_equipped_cosmetic');
                    }
                }
            }
        } catch (e) {
            console.error("Failed to initialize skinview3d:", e);
        }
    }

    function updateCosmeticsSkin() {
        updateShopViewerSkin();
        if (!cosmeticsViewer) return;
        cosmeticsViewer.model = skinChangerModelType;
        const customSkin = localStorage.getItem('tentix_custom_skin');
        if (customSkin) {
            cosmeticsViewer.loadSkin(customSkin, { model: skinChangerModelType });
            return;
        }
        let skinUrl = 'https://minotar.net/skin/MHF_Steve';
        if (isLoggedIn && uuidValue && uuidValue !== 'NOT LOGGED IN') {
            skinUrl = `https://minotar.net/skin/${uuidValue.trim()}`;
        } else if (isLoggedIn && savedName && savedName !== 'GUEST') {
            skinUrl = `https://minotar.net/skin/${savedName.trim()}`;
        }
        cosmeticsViewer.loadSkin(skinUrl, { model: skinChangerModelType });
    }

    async function installMod(modId, modTitle, btn) {
        if (btn.classList.contains('disabled')) return;
        const originalHtml = btn.innerHTML;
        btn.classList.add('disabled');
        btn.innerHTML = `<span class="mod-spinner"></span>...`;
        
        try {
            const mcVer = localStorage.getItem('tentix_last_ver') || '1.21.11';
            const loader = (localStorage.getItem('tentix_modloader') || 'VANILLA').toLowerCase();
            
            const res = await fetch(`https://api.modrinth.com/v2/project/${modId}/version`);
            const versions = await res.json();
            
            if (!Array.isArray(versions) || versions.length === 0) {
                throw new Error("No versions found");
            }
            
            let bestVersion = null;
            for (let v of versions) {
                const matchesLoader = loader === 'vanilla' || v.loaders.includes(loader);
                const matchesVersion = v.game_versions.includes(mcVer);
                if (matchesLoader && matchesVersion) {
                    bestVersion = v;
                    break;
                }
            }
            
            if (!bestVersion && loader !== 'vanilla') {
                for (let v of versions) {
                    if (v.loaders.includes(loader)) {
                        bestVersion = v;
                        break;
                    }
                }
            }
            
            if (!bestVersion) {
                bestVersion = versions[0];
            }
            
            // Check for required dependencies
            const requiredDeps = (bestVersion.dependencies || []).filter(d => d.dependency_type === 'required');
            const installed = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
            const preInstalledProjectIds = ['P7smOC4t', 'AANobbMI', 'YL575DfQ', 'gv9N2tTf', 'mOgUt4mY'];
            
            let missingDep = null;
            for (let d of requiredDeps) {
                if (d.project_id && !installed.includes(d.project_id) && !preInstalledProjectIds.includes(d.project_id)) {
                    missingDep = d;
                    break;
                }
            }
            
            if (missingDep) {
                pendingModInstall = { modId, modTitle, btn };
                pendingDependency = missingDep;
                
                btn.classList.remove('disabled');
                btn.innerHTML = originalHtml;
                
                try {
                    const depProject = await fetch(`https://api.modrinth.com/v2/project/${missingDep.project_id}`).then(r => r.json());
                    const depTitle = depProject.title || missingDep.project_id;
                    pendingModInstall.depTitle = depTitle;
                    pendingModInstall.depProjectId = missingDep.project_id;
                    
                    document.getElementById('dep-target-mod').innerText = modTitle;
                    document.getElementById('dep-missing-mod').innerText = depTitle;
                    
                    const modal = document.getElementById('dependency-modal');
                    modal.style.display = 'flex';
                    modal.offsetHeight;
                    modal.classList.add('show');
                } catch(err) {
                    console.error("Failed to load dependency project info:", err);
                    showToast(currentLang === 'de' ? "Fehler beim Laden von Mod-Details" : "Failed to load mod details", "error");
                }
                return;
            }
            
            if (!bestVersion || !bestVersion.files || bestVersion.files.length === 0) {
                throw new Error("No download files found");
            }
            
            const fileObj = bestVersion.files.find(f => f.primary) || bestVersion.files[0];
            const downloadUrl = fileObj.url;
            const filename = fileObj.filename;
            
            if (window.api && window.api.downloadMod) {
                const success = await window.api.downloadMod({ url: downloadUrl, filename: filename });
                if (success) {
                    const installedMods = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
                    if (!installedMods.includes(modId)) {
                        installedMods.push(modId);
                    }
                    localStorage.setItem('tentix_installed_mods', JSON.stringify(installedMods));
                    
                    const modFilesMap = JSON.parse(localStorage.getItem('tentix_installed_mods_files') || '{}');
                    modFilesMap[modId] = filename;
                    localStorage.setItem('tentix_installed_mods_files', JSON.stringify(modFilesMap));
                    
                    showToast(currentLang === 'de' ? `Mod "${modTitle}" erfolgreich installiert!` : `Mod "${modTitle}" successfully installed!`, "success");
                    
                    btn.classList.remove('disabled');
                    btn.classList.remove('btn-install');
                    btn.classList.add('installed-btn');
                    btn.innerHTML = '';
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.borderColor = '';
                    
                    const dataInstalled = currentLang === 'de' ? '✓ Installiert' : '✓ Installed';
                    const dataUninstall = currentLang === 'de' ? 'Deinstallieren' : 'Uninstall';
                    btn.setAttribute('data-installed', dataInstalled);
                    btn.setAttribute('data-uninstall', dataUninstall);
                    btn.setAttribute('onclick', `uninstallMod('${modId}', '${modTitle.replace(/'/g, "\\'")}', this)`);
                } else {
                    throw new Error("Download failed");
                }
            } else {
                throw new Error("API not available");
            }
        } catch (e) {
            console.error("Install mod error:", e);
            showToast(currentLang === 'de' ? `Installation fehlgeschlagen: ${e.message}` : `Installation failed: ${e.message}`, "error");
            btn.classList.remove('disabled');
            btn.innerHTML = originalHtml;
        }
    }

    async function uninstallMod(modId, modTitle, btn) {
        if (btn.classList.contains('disabled')) return;
        const originalHtml = btn.innerHTML;
        btn.classList.add('disabled');
        btn.removeAttribute('data-installed');
        btn.removeAttribute('data-uninstall');
        btn.innerHTML = `<span class="mod-spinner"></span>...`;
        
        try {
            const modFilesMap = JSON.parse(localStorage.getItem('tentix_installed_mods_files') || '{}');
            let filename = modFilesMap[modId];
            
            if (!filename) {
                const mcVer = localStorage.getItem('tentix_last_ver') || '1.21.11';
                const loader = (localStorage.getItem('tentix_modloader') || 'VANILLA').toLowerCase();
                const res = await fetch(`https://api.modrinth.com/v2/project/${modId}/version`);
                const versions = await res.json();
                if (Array.isArray(versions) && versions.length > 0) {
                    let bestVersion = null;
                    for (let v of versions) {
                        const matchesLoader = loader === 'vanilla' || v.loaders.includes(loader);
                        const matchesVersion = v.game_versions.includes(mcVer);
                        if (matchesLoader && matchesVersion) {
                            bestVersion = v;
                            break;
                        }
                    }
                    if (!bestVersion && loader !== 'vanilla') {
                        for (let v of versions) {
                            if (v.loaders.includes(loader)) {
                                bestVersion = v;
                                break;
                            }
                        }
                    }
                    if (!bestVersion) bestVersion = versions[0];
                    if (bestVersion && bestVersion.files && bestVersion.files.length > 0) {
                        const fileObj = bestVersion.files.find(f => f.primary) || bestVersion.files[0];
                        filename = fileObj.filename;
                    }
                }
            }
            
            if (!filename) {
                throw new Error("Could not determine filename for mod");
            }
            
            if (window.api && window.api.uninstallMod) {
                const success = await window.api.uninstallMod(filename);
                if (success) {
                    let installedMods = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
                    installedMods = installedMods.filter(id => id !== modId);
                    localStorage.setItem('tentix_installed_mods', JSON.stringify(installedMods));
                    
                    const modFilesMap = JSON.parse(localStorage.getItem('tentix_installed_mods_files') || '{}');
                    delete modFilesMap[modId];
                    localStorage.setItem('tentix_installed_mods_files', JSON.stringify(modFilesMap));
                    
                    showToast(currentLang === 'de' ? `Mod "${modTitle}" erfolgreich deinstalliert!` : `Mod "${modTitle}" successfully uninstalled!`, "info");
                    
                    btn.classList.remove('disabled');
                    btn.classList.remove('installed-btn');
                    btn.classList.add('btn-install');
                    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> ${translations[currentLang].modBtnInstall}`;
                    btn.setAttribute('onclick', `installMod('${modId}', '${modTitle.replace(/'/g, "\\'")}', this)`);
                } else {
                    throw new Error("Deletion failed on disk");
                }
            } else {
                throw new Error("API not available");
            }
        } catch (e) {
            console.error("Uninstall mod error:", e);
            showToast(currentLang === 'de' ? `Deinstallation fehlgeschlagen: ${e.message}` : `Uninstallation failed: ${e.message}`, "error");
            btn.classList.remove('disabled');
            btn.innerHTML = originalHtml;
            const dataInstalled = currentLang === 'de' ? '✓ Installiert' : '✓ Installed';
            const dataUninstall = currentLang === 'de' ? 'Deinstallieren' : 'Uninstall';
            btn.setAttribute('data-installed', dataInstalled);
            btn.setAttribute('data-uninstall', dataUninstall);
        }
    }

    // Skin Changer Preview & Upload
    function openSkinChangerModal() {
        const modal = document.getElementById('skin-changer-modal');
        if (!modal) return;
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('show');
        setTimeout(() => {
            initSkinChangerPreview();
        }, 100);
    }
    
    function closeSkinChangerModal() {
        const modal = document.getElementById('skin-changer-modal');
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    let skinChangerModelType = localStorage.getItem('tentix_skin_model_type') || 'default';
    function setSkinChangerModel(model) {
        skinChangerModelType = model;
        localStorage.setItem('tentix_skin_model_type', model);
        
        const btnClassic = document.getElementById('skin-model-btn-classic');
        const btnSlim = document.getElementById('skin-model-btn-slim');
        
        if (model === 'default') {
            if(btnClassic) btnClassic.classList.add('active');
            if(btnSlim) btnSlim.classList.remove('active');
        } else {
            if(btnClassic) btnClassic.classList.remove('active');
            if(btnSlim) btnSlim.classList.add('active');
        }
        
        updateSkinChangerPreview();
    }

    function initSkinChangerPreview() {
        const canvas = document.getElementById('skin-changer-canvas');
        const canvas2d = document.getElementById('skin-changer-canvas-2d');
        if (!canvas) return;

        // Set initial button states
        const initialModel = localStorage.getItem('tentix_skin_model_type') || 'default';
        skinChangerModelType = initialModel;
        const btnClassic = document.getElementById('skin-model-btn-classic');
        const btnSlim = document.getElementById('skin-model-btn-slim');
        if (initialModel === 'default') {
            if(btnClassic) btnClassic.classList.add('active');
            if(btnSlim) btnSlim.classList.remove('active');
        } else {
            if(btnClassic) btnClassic.classList.remove('active');
            if(btnSlim) btnSlim.classList.add('active');
        }

        let use3D = true;
        try {
            if (!skinChangerViewer) {
                skinChangerViewer = new skinview3d.SkinViewer({
                    canvas: canvas,
                    width: 180,
                    height: 260
                });
                
                skinChangerViewer.controls.enableZoom = false;
                skinChangerViewer.controls.enableRotate = true;
                skinChangerViewer.autoRotate = false;
                
                // Angled stiff pose
                skinChangerViewer.model.rotation.y = 0.4;
                skinChangerViewer.model.rotation.x = 0.05;
            }
        } catch (e) {
            console.error("Failed to initialize skin changer 3D preview:", e);
            skinChangerViewer = null;
            use3D = false;
        }

        if (use3D && skinChangerViewer) {
            canvas.style.display = 'block';
            if (canvas2d) canvas2d.style.display = 'none';
        } else {
            canvas.style.display = 'none';
            if (canvas2d) canvas2d.style.display = 'block';
        }
        
        updateSkinChangerPreview();
        if (use3D && skinChangerViewer) {
            initSkinDragAndDrop();
        }
        
        renderNameMCHistory(savedName || 'MHF_Steve');
        renderUploadedSkinsGallery();
    }
    
    function updateSkinChangerPreview() {
        let skinUrl = 'https://minotar.net/skin/MHF_Steve';
        let label = 'Steve';
        const customSkin = localStorage.getItem('tentix_custom_skin');
        if (customSkin) {
            skinUrl = customSkin;
            label = currentLang === 'de' ? 'Eigener Skin' : 'Custom Skin';
        } else if (isLoggedIn && uuidValue && uuidValue !== 'NOT LOGGED IN') {
            skinUrl = `https://minotar.net/skin/${uuidValue.trim()}`;
            label = savedName || 'Spieler';
        } else if (isLoggedIn && savedName && savedName !== 'GUEST') {
            skinUrl = `https://minotar.net/skin/${savedName.trim()}`;
            label = savedName;
        }
        
        const canvas = document.getElementById('skin-changer-canvas');
        const canvas2d = document.getElementById('skin-changer-canvas-2d');

        if (skinChangerViewer) {
            canvas.style.display = 'block';
            if (canvas2d) canvas2d.style.display = 'none';
            skinChangerViewer.model = skinChangerModelType;
            skinChangerViewer.loadSkin(skinUrl, { model: skinChangerModelType }).catch(err => {
                console.warn("Failed to load 3D skin, falling back to 2D canvas:", err);
                canvas.style.display = 'none';
                if (canvas2d) {
                    canvas2d.style.display = 'block';
                    draw2DSkinOnCanvas(skinUrl);
                }
            });
        } else {
            canvas.style.display = 'none';
            if (canvas2d) {
                canvas2d.style.display = 'block';
                draw2DSkinOnCanvas(skinUrl);
            }
        }
        
        const caption = document.getElementById('current-skin-caption');
        if (caption) {
            caption.innerText = label;
        }
    }
    
    function triggerSkinFileInput() {
        const input = document.getElementById('skin-file-input');
        if (input) input.click();
    }
    
    function handleSkinFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            processSkinFile(file);
        }
    }
    
    function processSkinFile(file) {
        if (!file.type.match('image/png')) {
            showToast(currentLang === 'de' ? "Nur PNG-Dateien erlaubt!" : "Only PNG files allowed!", "error");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            const img = new Image();
            img.src = dataUrl;
            img.onload = function() {
                const w = img.width;
                const h = img.height;
                if ((w === 64 && h === 64) || (w === 64 && h === 32)) {
                    uploadedSkinDataUrl = dataUrl;
                    if (skinChangerViewer) {
                        skinChangerViewer.loadSkin(dataUrl);
                    } else {
                        draw2DSkinOnCanvas(dataUrl);
                    }
                    
                    getAvatarFromSkin(dataUrl, (avatarUrl) => {
                        let uploadedSkins = JSON.parse(localStorage.getItem('tentix_uploaded_skins') || '[]');
                        const skinName = file.name ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : `Skin_${Date.now()}`;
                        if (!uploadedSkins.some(s => s.skin === dataUrl)) {
                            uploadedSkins.push({
                                id: Date.now(),
                                name: skinName.substring(0, 10),
                                skin: dataUrl,
                                avatar: avatarUrl
                            });
                            localStorage.setItem('tentix_uploaded_skins', JSON.stringify(uploadedSkins));
                            renderUploadedSkinsGallery();
                        }
                    });

                    const btn = document.getElementById('skin-upload-apply-btn');
                    if (btn) {
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'all';
                    }
                    showToast(currentLang === 'de' ? "Skin geladen! Klicke auf Speichern." : "Skin loaded! Click Save to apply.", "info");
                } else {
                    showToast(currentLang === 'de' ? `Ungültige Skin-Maße (${w}x${h})! Erforderlich: 64x64 oder 64x32.` : `Invalid skin dimensions (${w}x${h})! Required: 64x64 or 64x32.`, "error");
                }
            };
        };
        reader.readAsDataURL(file);
    }

    function searchSkinFromNameMC() {
        const query = document.getElementById('skin-search-input').value.trim();
        if (!query) {
            showToast(currentLang === 'de' ? "Bitte einen Namen oder UUID eingeben!" : "Please enter a name or UUID!", "error");
            return;
        }
        
        showToast(currentLang === 'de' ? "Suche Skin..." : "Searching skin...", "info");
        const skinUrl = `https://mc-heads.net/skin/${query}`;
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = skinUrl;
        img.onload = function() {
            loadSkinFromUrl(skinUrl, query);
            renderNameMCHistory(query);
            showToast(currentLang === 'de' ? "Skin geladen! Klicke auf Speichern." : "Skin loaded! Click Save to apply.", "success");
        };
        img.onerror = function() {
            showToast(currentLang === 'de' ? "Spieler nicht gefunden oder Skin-Ladefehler!" : "Player not found or skin load error!", "error");
        };
    }

    function loadSkinFromUrl(url, name = null) {
        uploadedSkinDataUrl = url;
        if (skinChangerViewer) {
            skinChangerViewer.loadSkin(url);
        } else {
            draw2DSkinOnCanvas(url);
        }
        const btn = document.getElementById('skin-upload-apply-btn');
        if (btn) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'all';
        }
        const caption = document.getElementById('current-skin-caption');
        if (caption) {
            const displayName = name || (currentLang === 'de' ? "Ausgewählter Skin" : "Selected Skin");
            caption.innerText = (currentLang === 'de' ? 'Vorschau: ' : 'Preview: ') + displayName;
        }
        showToast(currentLang === 'de' ? "Skin geladen! Klicke auf Speichern." : "Skin loaded! Click Save to apply.", "info");
    }

    function saveSkinToHistory(name) {
        if (!name) return;
        let history = JSON.parse(localStorage.getItem('tentix_skin_history') || '["TN3X", "Notch", "Herobrine", "jeb_"]');
        history = history.filter(u => u.toLowerCase() !== name.toLowerCase());
        history.unshift(name);
        if (history.length > 8) {
            history.pop();
        }
        localStorage.setItem('tentix_skin_history', JSON.stringify(history));
    }

    function renderNameMCHistory(query = null) {
        const box = document.getElementById('namemc-skins-box');
        if (!box) return;
        
        if (query && query !== 'MHF_Steve' && query !== 'GUEST') {
            saveSkinToHistory(query);
        }
        
        const history = JSON.parse(localStorage.getItem('tentix_skin_history') || '["TN3X", "Notch", "Herobrine", "jeb_"]');
        let html = '';
        history.forEach((u) => {
            html += `
                <div class="namemc-card" onclick="loadSkinFromUrl('https://mc-heads.net/skin/${u}', '${u}')" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 10px 5px; cursor: pointer; text-align: center; transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1); display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box;">
                    <img src="https://mc-heads.net/body/${u}/right" style="height: 75px; width: 100%; object-fit: contain; margin-bottom: 5px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); transition: transform 0.2s;" onerror="this.src='https://minotar.net/helm/${u}/40.png'">
                    <span style="font-size: 8px; color: #aaa; font-weight: 700; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px;">${u}</span>
                </div>
            `;
        });
        box.innerHTML = html;
    }

    function renderUploadedSkinsGallery() {
        const gallery = document.getElementById('uploaded-skins-gallery');
        if(!gallery) return;
        
        let uploadedSkins = JSON.parse(localStorage.getItem('tentix_uploaded_skins') || '[]');
        if (uploadedSkins.length === 0) {
            gallery.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #444; font-size: 10px; font-style: italic; padding: 20px 0;">Keine gespeicherten Skins.</div>`;
            return;
        }
        
        let html = '';
        uploadedSkins.forEach(skinObj => {
            const escapedName = skinObj.name.replace(/'/g, "\\'");
            html += `
                <div class="gallery-card" style="position: relative; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; cursor: pointer; text-align: center; transition: 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div onclick="event.stopPropagation(); deleteUploadedSkin(${skinObj.id})" style="position: absolute; top: 4px; right: 4px; background: rgba(255,75,75,0.15); border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; color: #ff4b4b; font-size: 8px; font-weight: bold; cursor: pointer;" title="Delete">✕</div>
                    <img src="${skinObj.avatar}" style="width: 32px; height: 32px; border-radius: 4px; margin-bottom: 5px;" onclick="loadSkinFromUrl('${skinObj.skin}', '${escapedName}')">
                    <span style="font-size: 8px; color: #888; font-weight: 700; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${skinObj.name}</span>
                </div>
            `;
        });
        gallery.innerHTML = html;
    }

    function deleteUploadedSkin(id) {
        let uploadedSkins = JSON.parse(localStorage.getItem('tentix_uploaded_skins') || '[]');
        uploadedSkins = uploadedSkins.filter(s => s.id !== id);
        localStorage.setItem('tentix_uploaded_skins', JSON.stringify(uploadedSkins));
        renderUploadedSkinsGallery();
        showToast(currentLang === 'de' ? "Skin gelöscht!" : "Skin deleted!", "info");
    }
    
    async function syncSkinWithMojang(skinUrl, modelType) {
        const mcToken = JSON.parse(localStorage.getItem('tentix_mc_token') || '{}');
        const accessToken = mcToken.access_token;
        if (!accessToken) return;

        try {
            const variant = modelType === 'slim' ? 'slim' : 'classic';
            const response = await fetch('https://api.minecraftservices.com/minecraft/profile/skins', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    variant: variant,
                    url: skinUrl
                })
            });

            if (response.ok) {
                showToast(currentLang === 'de' ? "Skin mit Mojang/Minecraft-Servern synchronisiert!" : "Skin synced with Mojang/Minecraft servers!", "success");
            } else {
                const errData = await response.json().catch(() => ({}));
                console.error("Mojang Skin Sync failed:", errData);
                showToast(currentLang === 'de' ? "Mojang-Sync fehlgeschlagen: " + (errData.errorMessage || response.statusText) : "Mojang-Sync failed: " + (errData.errorMessage || response.statusText), "warning");
            }
        } catch (e) {
            console.error("Error syncing skin with Mojang:", e);
            showToast(currentLang === 'de' ? "Fehler bei Minecraft Skin-Sync!" : "Error syncing skin with Minecraft servers!", "error");
        }
    }

    async function applySkinUpload() {
        if (!uploadedSkinDataUrl) return;
        localStorage.setItem('tentix_custom_skin', uploadedSkinDataUrl);
        
        updateCosmeticsSkin();
        updateSkinChangerPreview();
        getAvatarFromSkin(uploadedSkinDataUrl, (avatarUrl) => {
            if (avatarUrl && document.getElementById('user-avatar')) {
                document.getElementById('user-avatar').src = avatarUrl;
            }
        });
        
        const mcToken = JSON.parse(localStorage.getItem('tentix_mc_token') || '{}');
        const accessToken = mcToken.access_token;
        if (accessToken) {
            let skinUrlForMojang = uploadedSkinDataUrl;
            if (uploadedSkinDataUrl.startsWith('data:')) {
                try {
                    const uploadRes = await fetch(`${API_BASE_URL}/api/skins/upload`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            base64Data: uploadedSkinDataUrl,
                            filename: (savedName || 'skin') + '_' + Date.now()
                        })
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadData.success && uploadData.url) {
                        skinUrlForMojang = uploadData.url;
                    } else {
                        throw new Error(uploadData.error || "Upload failed");
                    }
                } catch (e) {
                    console.warn("Backend skin upload failed, Mojang sync might fail:", e);
                }
            }
            await syncSkinWithMojang(skinUrlForMojang, skinChangerModelType);
        }
        
        showToast(currentLang === 'de' ? "Skin erfolgreich geändert!" : "Skin successfully changed!", "success");
        closeSkinChangerModal();
    }
    
    function initSkinDragAndDrop() {
        const zone = document.getElementById('skin-drop-zone');
        if (!zone) return;
        
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) {
                processSkinFile(file);
            }
        });
    }
    
    function getAvatarFromSkin(skinDataUrl, callback) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = skinDataUrl;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 40, 40);
            ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 40, 40);
            callback(canvas.toDataURL());
        };
        img.onerror = function() {
            callback(null);
        };
    }

    // Custom Capes Cosmetics
    function generateCapeDataUrl(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 32);
        
        if (type === 'tentix') {
            const grad = ctx.createLinearGradient(0, 0, 64, 32);
            grad.addColorStop(0, '#0c0c0e');
            grad.addColorStop(0.5, '#181822');
            grad.addColorStop(1, '#0c0c0e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 32);
            
            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(4, 2, 8, 2);
            ctx.fillRect(7, 4, 2, 12);
            ctx.fillRect(4, 6, 8, 2);
            
            ctx.fillStyle = 'rgba(var(--accent-blue-rgb), 0.4)';
            ctx.fillRect(0, 0, 64, 2);
            ctx.fillRect(0, 30, 64, 2);
        } else if (type === 'beta') {
            const grad = ctx.createLinearGradient(0, 0, 0, 32);
            grad.addColorStop(0, '#11998e');
            grad.addColorStop(1, '#38ef7d');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 32);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < 64; x += 4) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 32); ctx.stroke();
            }
            for (let y = 0; y < 32; y += 4) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(64, y); ctx.stroke();
            }
        } else if (type === 'dev') {
            ctx.fillStyle = '#1a0033';
            ctx.fillRect(0, 0, 64, 32);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(5, 7, 3, 3);
            ctx.fillRect(6, 6, 1, 5);
            ctx.fillRect(4, 8, 5, 1);
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, 64, 32);
        } else if (type === 'alpha') {
            const grad = ctx.createLinearGradient(0, 0, 0, 32);
            grad.addColorStop(0, '#e65c00');
            grad.addColorStop(1, '#f9d423');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 32);
        } else if (type === 'twitch') {
            const grad = ctx.createLinearGradient(0, 0, 0, 32);
            grad.addColorStop(0, '#9146FF');
            grad.addColorStop(1, '#6441a5');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 32);
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(4, 4, 8, 8);
            ctx.fillStyle = '#6441a5';
            ctx.fillRect(6, 6, 1, 3);
            ctx.fillRect(9, 6, 1, 3);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(8, 12);
            ctx.lineTo(8, 14);
            ctx.lineTo(10, 12);
            ctx.closePath();
            ctx.fill();
        } else if (type === 'yt') {
            const grad = ctx.createLinearGradient(0, 0, 0, 32);
            grad.addColorStop(0, '#ff0000');
            grad.addColorStop(1, '#cc0000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 32);
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(5, 5);
            ctx.lineTo(11, 8);
            ctx.lineTo(5, 11);
            ctx.closePath();
            ctx.fill();
        }
        
        return canvas.toDataURL();
    }
    
    let equippedCosmetic = null;
    function updateCosmeticsLocks() {
        const checkRole = (allowedRoles) => {
            return (currentUserRoles || []).some(r => allowedRoles.includes(r));
        };
        
        const capes = COSMETICS_LIST;

        capes.forEach(cape => {
            const card = document.getElementById(`cosmetic-card-${cape.id}`);
            if (!card) return;
            
            const existingLock = card.querySelector('.cape-lock-overlay');
            if (existingLock) existingLock.remove();

            const hasAccess = checkRole(cape.roles);
            if (!hasAccess) {
                card.style.position = 'relative';
                card.style.opacity = '0.35';
                const lock = document.createElement('div');
                lock.className = 'cape-lock-overlay';
                lock.style.position = 'absolute';
                lock.style.bottom = '8px';
                lock.style.right = '8px';
                lock.style.background = 'rgba(0,0,0,0.65)';
                lock.style.borderRadius = '50%';
                lock.style.width = '20px';
                lock.style.height = '20px';
                lock.style.display = 'flex';
                lock.style.alignItems = 'center';
                lock.style.justifyContent = 'center';
                lock.style.border = '1px solid rgba(255,255,255,0.15)';
                lock.innerHTML = `<svg viewBox="0 0 24 24" style="width: 11px; height: 11px; fill: #ff4b4b;"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
                card.appendChild(lock);
            } else {
                card.style.opacity = '1';
            }
        });
    }

    function selectCosmetic(type, element) {
        if (type !== 'none') {
            const capeRoles = {};
            COSMETICS_LIST.forEach(c => {
                capeRoles[c.id] = { roles: c.roles, name: c.roleName };
            });
            
            const req = capeRoles[type];
            if (req) {
                const hasAccess = (currentUserRoles || []).some(r => req.roles.includes(r));
                if (!hasAccess) {
                    showToast(currentLang === 'de' ? `Dieses Cape ist nur für ${req.name} freigeschaltet!` : `This cape is only unlocked for ${req.name}!`, "error");
                    return;
                }
            }
        }

        document.querySelectorAll('.cosmetic-card').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');
        
        if (!cosmeticsViewer) return;
        if (type === 'none') {
            cosmeticsViewer.loadCape(null);
            equippedCosmetic = null;
            localStorage.setItem('tentix_equipped_cosmetic', 'none');
            showToast(currentLang === 'de' ? "Cape abgelegt" : "Cape unequipped", "info");
        } else {
            const dataUrl = generateCapeDataUrl(type);
            cosmeticsViewer.loadCape(dataUrl);
            equippedCosmetic = type;
            localStorage.setItem('tentix_equipped_cosmetic', type);
            showToast(currentLang === 'de' ? "Cape ausgerüstet!" : "Cape equipped!", "success");
        }
    }

    // Dependency resolution functions
    function closeDependencyModal() {
        const modal = document.getElementById('dependency-modal');
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    async function downloadMissingDependency() {
        if (!pendingModInstall || !pendingDependency) return;
        
        const btn = document.getElementById('dep-download-btn');
        const origText = btn.innerText;
        btn.style.pointerEvents = 'none';
        btn.innerHTML = `<span class="mod-spinner"></span>...`;
        
        try {
            const mcVer = localStorage.getItem('tentix_last_ver') || '1.21.11';
            const loader = (localStorage.getItem('tentix_modloader') || 'VANILLA').toLowerCase();
            
            const res = await fetch(`https://api.modrinth.com/v2/project/${pendingDependency.project_id}/version`);
            const versions = await res.json();
            
            if (!Array.isArray(versions) || versions.length === 0) {
                throw new Error("No versions found for dependency");
            }
            
            let bestVersion = null;
            for (let v of versions) {
                const matchesLoader = loader === 'vanilla' || v.loaders.includes(loader);
                const matchesVersion = v.game_versions.includes(mcVer);
                if (matchesLoader && matchesVersion) {
                    bestVersion = v;
                    break;
                }
            }
            
            if (!bestVersion) {
                bestVersion = versions[0];
            }
            
            const fileObj = bestVersion.files.find(f => f.primary) || bestVersion.files[0];
            const downloadUrl = fileObj.url;
            const filename = fileObj.filename;
            
            if (window.api && window.api.downloadMod) {
                const success = await window.api.downloadMod({ url: downloadUrl, filename: filename });
                if (success) {
                    const installed = JSON.parse(localStorage.getItem('tentix_installed_mods') || '[]');
                    installed.push(pendingModInstall.depProjectId);
                    localStorage.setItem('tentix_installed_mods', JSON.stringify(installed));
                    
                    showToast(currentLang === 'de' ? `Abhängigkeit "${pendingModInstall.depTitle}" erfolgreich installiert!` : `Dependency "${pendingModInstall.depTitle}" successfully installed!`, "success");
                    closeDependencyModal();
                    
                    setTimeout(() => {
                        installMod(pendingModInstall.modId, pendingModInstall.modTitle, pendingModInstall.btn);
                    }, 500);
                } else {
                    throw new Error("Download failed");
                }
            } else {
                throw new Error("API not available");
            }
        } catch (e) {
            console.error("Dependency download error:", e);
            showToast(currentLang === 'de' ? `Fehler beim Download: ${e.message}` : `Download failed: ${e.message}`, "error");
        } finally {
            btn.style.pointerEvents = 'all';
            btn.innerText = origText;
        }
    }

    // User search filter
    function filterDashboardUsers() {
        const query = document.getElementById('dash-user-search-input').value.trim().toLowerCase();
        const rows = document.querySelectorAll('#dash-users-tbody tr');
        rows.forEach(row => {
            if (row.cells.length < 2) return;
            const username = row.cells[0].innerText.toLowerCase();
            const uuid = row.cells[1].innerText.toLowerCase();
            if (username.includes(query) || uuid.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // System Status dashboard tab functions
    function logToTerminal(text) {
        const consoleBox = document.getElementById('sys-console-box');
        if (!consoleBox) return;
        const timeStr = new Date().toTimeString().split(' ')[0];
        consoleBox.innerHTML += `[${timeStr}] ${text}\n`;
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    async function loadDashboardBackups() {
        const tbody = document.getElementById('dash-backups-tbody');
        if(!tbody) return;

        let backups = [];
        if (isClientSimulated) {
            backups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            if (backups.length === 0) {
                backups = [
                    { id: 1, filename: 'backup_2026-05-28_auto.sql', created_at: Date.now() - 3600000, size: 24576 },
                    { id: 2, filename: 'backup_2026-05-27_manual.sql', created_at: Date.now() - 24 * 3600000, size: 28672 }
                ];
                localStorage.setItem('tentix_sim_backups', JSON.stringify(backups));
            }
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/system/backups`);
                if(!res.ok) throw new Error();
                const data = await res.json();
                if(data.success) backups = data.backups;
            } catch(e) {
                backups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            }
        }

        if(backups.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic; padding:20px; color:#555;">Keine Backups vorhanden.</td></tr>`;
            return;
        }

        let html = '';
        backups.forEach(b => {
            const sizeFormatted = b.size ? `${(b.size / 1024).toFixed(2)} KB` : 'N/A';
            const dateFormatted = new Date(b.created_at || b.date || Date.now()).toLocaleString();
            html += `<tr>
                <td style="color:#fff; font-weight:700;">${b.filename}</td>
                <td>${dateFormatted}</td>
                <td>${sizeFormatted}</td>
                <td style="text-align: right;">
                    <div style="display:inline-flex; gap: 8px;">
                        <div class="dash-action-btn" style="background: rgba(var(--accent-blue-rgb), 0.15); color: var(--accent-blue);" onclick="restoreDashboardBackup(${b.id}, '${b.filename}')">Wiederherstellen</div>
                        <div class="dash-action-btn" style="background: rgba(255, 75, 75, 0.15); color: #ff4b4b;" onclick="deleteDashboardBackup(${b.id}, '${b.filename}')">Löschen</div>
                    </div>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }

    async function restoreDashboardBackup(id, filename) {
        showCustomConfirm(
            currentLang === 'de' ? "Backup einspielen?" : "Restore Backup?",
            currentLang === 'de' ? `Bist du sicher, dass du das Backup '${filename}' einspielen willst? Alle aktuellen Tabellendaten werden überschrieben!` : `Are you sure you want to restore backup '${filename}'? All current table data will be overwritten!`,
            null,
            'var(--accent-blue)',
            (approved) => {
                if (approved) executeRestoreBackup(id, filename);
            }
        );
    }

    async function executeRestoreBackup(id, filename) {
        logToTerminal(`Starte Wiederherstellung von Backup: ${filename}...`);
        showToast("Wiederherstellung läuft...", "info");

        if (isClientSimulated) {
            let simBackups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            const backup = simBackups.find(b => b.id === id);
            if(backup) {
                try {
                    const dataObj = backup.data ? JSON.parse(backup.data) : null;
                    if(dataObj) {
                        if(dataObj.users) localStorage.setItem('tentix_sim_users', JSON.stringify(dataObj.users));
                        if(dataObj.codes) localStorage.setItem('tentix_sim_codes', JSON.stringify(dataObj.codes));
                    }
                    showToast("Wiederherstellung erfolgreich abgeschlossen! (Simulation)", "success");
                    logToTerminal(`RESTORE ERFOLGREICH (Simulation): ${filename}`);
                } catch(err) {
                    showToast("Fehler beim Parsen des Backups", "error");
                }
            } else {
                showToast("Backup nicht gefunden (Simulation)", "error");
            }
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/system/restore`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if(data.success) {
                showToast("Wiederherstellung erfolgreich abgeschlossen!", "success");
                logToTerminal(`RESTORE ERFOLGREICH: ${filename}`);
            } else {
                showToast(data.error || "Wiederherstellung fehlgeschlagen", "error");
                logToTerminal(`RESTORE FEHLER: ${data.error || 'Unbekannt'}`);
            }
        } catch(e) {
            let simBackups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            const backup = simBackups.find(b => b.id === id);
            if(backup) {
                try {
                    const dataObj = JSON.parse(backup.data);
                    if(dataObj.users) localStorage.setItem('tentix_db_users', JSON.stringify(dataObj.users));
                    if(dataObj.codes) localStorage.setItem('tentix_db_codes', JSON.stringify(dataObj.codes));
                    showToast("Wiederherstellung erfolgreich abgeschlossen! (Simulation)", "success");
                    logToTerminal(`RESTORE ERFOLGREICH (Simulation): ${filename}`);
                } catch(err) {
                    showToast("Fehler beim Parsen des Backups", "error");
                }
            } else {
                showToast("Backup nicht gefunden (Simulation)", "error");
            }
        }
    }

    async function deleteDashboardBackup(id, filename) {
        showCustomConfirm(
            currentLang === 'de' ? "Backup löschen?" : "Delete Backup?",
            currentLang === 'de' ? `Bist du sicher, dass du das Backup '${filename}' löschen willst?` : `Are you sure you want to delete backup '${filename}'?`,
            null,
            "#ff4b4b",
            (approved) => {
                if (approved) executeDeleteBackup(id, filename);
            }
        );
    }

    async function executeDeleteBackup(id, filename) {
        logToTerminal(`Lösche Backup: ${filename}...`);

        if (isClientSimulated) {
            let simBackups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            simBackups = simBackups.filter(b => b.id !== id);
            localStorage.setItem('tentix_sim_backups', JSON.stringify(simBackups));
            showToast("Backup gelöscht! (Simulation)", "success");
            logToTerminal(`BACKUP GELÖSCHT (Simulation): ${filename}`);
            loadDashboardBackups();
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/system/delete-backup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if(data.success) {
                showToast("Backup gelöscht!", "success");
                logToTerminal(`BACKUP GELÖSCHT: ${filename}`);
                loadDashboardBackups();
            } else {
                showToast(data.error || "Löschen fehlgeschlagen", "error");
            }
        } catch(e) {
            let simBackups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
            simBackups = simBackups.filter(b => b.id !== id);
            localStorage.setItem('tentix_sim_backups', JSON.stringify(simBackups));
            showToast("Backup gelöscht! (Simulation)", "success");
            logToTerminal(`BACKUP GELÖSCHT (Simulation): ${filename}`);
            loadDashboardBackups();
        }
    }
    
    function startSystemMonitoring() {
        if (systemMonInterval) clearInterval(systemMonInterval);
        
        const consoleBox = document.getElementById('sys-console-box');
        if (consoleBox) consoleBox.innerHTML = '';
        
        logToTerminal("Initialisiere System-Überwachung...");
        logToTerminal("Verbinde mit System-Status API...");
        
        const updateMetrics = () => {
            if (isClientSimulated) {
                const cpu = 2 + Math.floor(Math.random() * 5);
                const ramUsed = (0.8 + Math.random() * 0.2).toFixed(2);
                const latency = 1 + Math.floor(Math.random() * 3);
                
                if (document.getElementById('sys-cpu-val')) document.getElementById('sys-cpu-val').innerText = `${cpu} %`;
                if (document.getElementById('sys-ram-val')) document.getElementById('sys-ram-val').innerText = `${ramUsed} GB / 32 GB`;
                if (document.getElementById('sys-db-latency')) document.getElementById('sys-db-latency').innerText = `${latency} ms`;
                
                maintenanceModeActive = localStorage.getItem('tentix_sim_maintenance') === 'true';
                applyMaintenanceModeState(maintenanceModeActive);
                const statusEl = document.getElementById('sys-maint-status');
                if (statusEl) {
                    if (maintenanceModeActive) {
                        statusEl.innerText = "AKTIVIERT";
                        statusEl.style.color = "#00ff80";
                    } else {
                        statusEl.innerText = "DEAKTIVIERT";
                        statusEl.style.color = "#ff4b4b";
                    }
                }
            } else {
                fetch(`${API_BASE_URL}/api/system/status`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById('sys-cpu-val').innerText = `${data.cpu} %`;
                            document.getElementById('sys-ram-val').innerText = `${data.memory.used} GB / ${data.memory.total} GB`;
                            document.getElementById('sys-db-latency').innerText = `${data.dbLatency} ms`;
                            
                            maintenanceModeActive = data.maintenance;
                            applyMaintenanceModeState(maintenanceModeActive);
                            const statusEl = document.getElementById('sys-maint-status');
                            if (statusEl) {
                                if (maintenanceModeActive) {
                                    statusEl.innerText = "AKTIVIERT";
                                    statusEl.style.color = "#00ff80";
                                } else {
                                    statusEl.innerText = "DEAKTIVIERT";
                                    statusEl.style.color = "#ff4b4b";
                                }
                            }
                        }
                    })
                    .catch(() => {
                        const cpu = 5 + Math.floor(Math.random() * 15);
                        const ramUsed = (1.2 + Math.random() * 0.4).toFixed(2);
                        const latency = 2 + Math.floor(Math.random() * 8);
                        
                        document.getElementById('sys-cpu-val').innerText = `${cpu} %`;
                        document.getElementById('sys-ram-val').innerText = `${ramUsed} GB / 8 GB`;
                        document.getElementById('sys-db-latency').innerText = `${latency} ms`;
                    });
            }
                
            const mockLogs = [
                "GET /api/heartbeat 200 OK - client active",
                "Datenbank Abfrage: SELECT * FROM metrics ORDER BY timestamp DESC",
                "Metric Punkt registriert - 12 Spieler online",
                "API translation cache: hit",
                "Clean-up Timer: Keine verwaisten Sessions gefunden",
                "GET /api/stats 200 OK",
                "Heartbeat ping erhalten von User: Player_" + Math.floor(Math.random() * 100)
            ];
            const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
            logToTerminal(randomLog);
        };
        
        updateMetrics();
        loadDashboardBackups();
        systemMonInterval = setInterval(updateMetrics, 5000);
    }
    
    function toggleMaintenanceMode() {
        if (isClientSimulated) {
            maintenanceModeActive = !maintenanceModeActive;
            localStorage.setItem('tentix_sim_maintenance', maintenanceModeActive ? 'true' : 'false');
            applyMaintenanceModeState(maintenanceModeActive);
            
            if (maintenanceModeActive) {
                let news = JSON.parse(localStorage.getItem('tentix_sim_news') || '[]');
                news.unshift({
                    id: Date.now(),
                    title: "System-Wartung / Maintenance",
                    content: "Wir sind aktuell im Wartungsmodus! Bitte beachtet, dass manche Funktionen vorübergehend deaktiviert sind.\n\nWe are currently in maintenance! Please note that some features are temporarily disabled.",
                    image_url: "MAINTENANCE_RED",
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('tentix_sim_news', JSON.stringify(news));
                loadNews();
            }

            const statusEl = document.getElementById('sys-maint-status');
            if (statusEl) {
                if (maintenanceModeActive) {
                    statusEl.innerText = "AKTIVIERT";
                    statusEl.style.color = "#00ff80";
                    showToast("Wartungsmodus aktiviert! (Simulation)", "success");
                    logToTerminal("WARTUNGSMODUS (Simulation): Aktiviert.");
                } else {
                    statusEl.innerText = "DEAKTIVIERT";
                    statusEl.style.color = "#ff4b4b";
                    showToast("Wartungsmodus deaktiviert! (Simulation)", "success");
                    logToTerminal("WARTUNGSMODUS (Simulation): Deaktiviert.");
                }
            }
            return;
        }

        fetch(`${API_BASE_URL}/api/system/maintenance`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    maintenanceModeActive = data.maintenance;
                    applyMaintenanceModeState(maintenanceModeActive);
                    const statusEl = document.getElementById('sys-maint-status');
                    if (maintenanceModeActive) {
                        statusEl.innerText = "AKTIVIERT";
                        statusEl.style.color = "#00ff80";
                        showToast("Wartungsmodus aktiviert!", "success");
                        logToTerminal("WARTUNGSMODUS: Aktiviert von Admin.");
                    } else {
                        statusEl.innerText = "DEAKTIVIERT";
                        statusEl.style.color = "#ff4b4b";
                        showToast("Wartungsmodus deaktiviert!", "success");
                        logToTerminal("WARTUNGSMODUS: Deaktiviert von Admin.");
                    }
                    loadNews();
                }
            })
            .catch(() => {
                maintenanceModeActive = !maintenanceModeActive;
                localStorage.setItem('tentix_sim_maintenance', maintenanceModeActive ? 'true' : 'false');
                applyMaintenanceModeState(maintenanceModeActive);
                
                if (maintenanceModeActive) {
                    let news = JSON.parse(localStorage.getItem('tentix_db_news') || '[]');
                    news.unshift({
                        id: Date.now(),
                        title: "System-Wartung / Maintenance",
                        content: "Wir sind aktuell im Wartungsmodus! Bitte beachtet, dass manche Funktionen vorübergehend deaktiviert sind.\n\nWe are currently in maintenance! Please note that some features are temporarily disabled.",
                        image_url: "MAINTENANCE_RED",
                        created_at: new Date().toISOString()
                    });
                    localStorage.setItem('tentix_db_news', JSON.stringify(news));
                    loadNews();
                }

                const statusEl = document.getElementById('sys-maint-status');
                if (maintenanceModeActive) {
                    statusEl.innerText = "AKTIVIERT";
                    statusEl.style.color = "#00ff80";
                    showToast("Wartungsmodus aktiviert! (Simulation)", "success");
                    logToTerminal("WARTUNGSMODUS (Simulation): Aktiviert.");
                } else {
                    statusEl.innerText = "DEAKTIVIERT";
                    statusEl.style.color = "#ff4b4b";
                    showToast("Wartungsmodus deaktiviert! (Simulation)", "success");
                    logToTerminal("WARTUNGSMODUS (Simulation): Deaktiviert.");
                }
            });
    }
    
    function triggerDashboardBackup() {
        logToTerminal("Starte Datenbank-Backup...");
        showToast("Backup wird erstellt...", "info");
        
        if (isClientSimulated) {
            setTimeout(() => {
                const backupName = `backup_${new Date().toISOString().slice(0,10)}.sql`;
                let simBackups = JSON.parse(localStorage.getItem('tentix_sim_backups') || '[]');
                
                // Pack current sim users and codes in backup data
                const backupData = JSON.stringify({
                    users: JSON.parse(localStorage.getItem('tentix_sim_users') || '[]'),
                    codes: JSON.parse(localStorage.getItem('tentix_sim_codes') || '[]')
                });
                
                simBackups.unshift({
                    id: Date.now(),
                    filename: backupName,
                    created_at: Date.now(),
                    size: backupData.length,
                    data: backupData
                });
                localStorage.setItem('tentix_sim_backups', JSON.stringify(simBackups));
                
                showToast(`Backup erstellt: ${backupName} (Simulation)`, "success");
                logToTerminal(`BACKUP ERFOLGREICH (Simulation): ${backupName}`);
                loadDashboardBackups();
            }, 1000);
            return;
        }

        fetch(`${API_BASE_URL}/api/system/backup`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(`Backup erstellt: ${data.backupFile}`, "success");
                    logToTerminal(`BACKUP ERFOLGREICH: ${data.backupFile}`);
                }
            })
            .catch(() => {
                setTimeout(() => {
                    const backupName = `backup_${new Date().toISOString().slice(0,10)}.sql`;
                    showToast(`Backup erstellt: ${backupName} (Simulation)`, "success");
                    logToTerminal(`BACKUP ERFOLGREICH (Simulation): ${backupName}`);
                }, 1000);
            });
    }
    
    function clearDashboardMetrics() {
        logToTerminal("Lösche alte Metriken aus der Datenbank...");
        
        if (isClientSimulated) {
            showToast("Historie erfolgreich geleert! (Simulation)", "success");
            logToTerminal("METRIKEN CLEANUP (Simulation): Einträge gelöscht.");
            return;
        }

        fetch(`${API_BASE_URL}/api/system/clear-metrics`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast("Historie erfolgreich geleert!", "success");
                    logToTerminal("METRIKEN CLEANUP: Alte Einträge gelöscht.");
                }
            })
            .catch(() => {
                showToast("Historie erfolgreich geleert! (Simulation)", "success");
                logToTerminal("METRIKEN CLEANUP (Simulation): Einträge gelöscht.");
            });
    }

    function getSimulatedChartData(filter) {
        const now = Date.now();
        let intervals = [];
        let formatLabel;
        let count = 7;
        let groupDivisor = 24 * 3600 * 1000;
        let timeLimit = now - (7 * 24 * 3600 * 1000);

        if (filter === '24h') {
            count = 12;
            groupDivisor = 2 * 60 * 60 * 1000;
            timeLimit = now - (24 * 60 * 60 * 1000);
            formatLabel = (ts) => String(new Date(ts).getHours()).padStart(2, '0') + ":00";
        } else if (filter === '7T') {
            count = 7;
            groupDivisor = 24 * 3600 * 1000;
            timeLimit = now - (7 * 24 * 3600 * 1000);
            formatLabel = (ts) => new Date(ts).getDate() + "." + (new Date(ts).getMonth() + 1);
        } else if (filter === '14T') {
            count = 7;
            groupDivisor = 2 * 24 * 3600 * 1000;
            timeLimit = now - (14 * 24 * 3600 * 1000);
            formatLabel = (ts) => new Date(ts).getDate() + "." + (new Date(ts).getMonth() + 1);
        } else if (filter === '30T') {
            count = 10;
            groupDivisor = 3 * 24 * 3600 * 1000;
            timeLimit = now - (30 * 24 * 3600 * 1000);
            formatLabel = (ts) => new Date(ts).getDate() + "." + (new Date(ts).getMonth() + 1);
        } else if (filter === '60T') {
            count = 8;
            groupDivisor = 7 * 24 * 3600 * 1000;
            timeLimit = now - (60 * 24 * 3600 * 1000);
            formatLabel = (ts) => "KW " + Math.ceil(new Date(ts).getDate() / 7);
        } else {
            let days = filter === '180T' ? 180 : 360;
            count = filter === '180T' ? 6 : 12;
            groupDivisor = 30 * 24 * 3600 * 1000;
            timeLimit = now - (days * 24 * 3600 * 1000);
            formatLabel = (ts) => new Date(ts).toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US', { month: 'short' });
        }

        let data = [];
        for (let i = 0; i < count; i++) {
            let t = timeLimit + (i * groupDivisor);
            let hourFactor = 1.0;
            if (filter === '24h') {
                let hr = new Date(t).getHours();
                hourFactor = 0.4 + 0.6 * Math.sin((hr - 8) * Math.PI / 12);
            } else {
                hourFactor = 0.8 + 0.2 * Math.sin(i * Math.PI / (count - 1));
            }
            let avgVal = Math.floor((1000 + Math.random() * 300) * hourFactor);
            let peakVal = Math.floor(avgVal * (1.1 + Math.random() * 0.15));
            let bansVal = Math.floor(Math.random() * 4) + (i % 3 === 0 ? 3 : 0);

            data.push({
                label: formatLabel(t),
                avg: Math.max(10, avgVal),
                peak: Math.max(15, peakVal),
                bans: bansVal
            });
        }
        return data;
    }

    function toggleClientSimulation() {
        isClientSimulated = !isClientSimulated;
        localStorage.setItem('tentix_is_client_simulated', isClientSimulated ? 'true' : 'false');
        updateSimulationButtonText();
        
        fetchDashboardStats();
        renderDashboardChart();
        renderUsersTable();
        renderCodesTable();
        loadNews();
        loadDashboardBackups();
        
        showToast(
            currentLang === 'de' 
                ? (isClientSimulated ? 'Simulation aktiviert!' : 'Simulation deaktiviert!') 
                : (isClientSimulated ? 'Simulation enabled!' : 'Simulation disabled!'),
            'success'
        );
    }

    function updateSimulationButtonText() {
        const btn = document.getElementById('dash-sim-client-btn');
        if (!btn) return;
        
        if (isClientSimulated) {
            btn.style.background = 'rgba(0, 225, 255, 0.2)';
            btn.style.borderColor = '#00e1ff';
            btn.style.color = '#00e1ff';
            btn.innerText = currentLang === 'de' ? 'Simuliere den Client: AN' : 'Simulate Client: ON';
        } else {
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            btn.style.color = '#888';
            btn.innerText = currentLang === 'de' ? 'Simuliere den Client: AUS' : 'Simulate Client: OFF';
        }
    }

    // ==========================================
    // PREMIUM SYSTEM EXTENSIONS (FRIENDS, SHOP CART, PERMISSIONS, 2D SKIN FALLBACK)
    // ==========================================

    function forceRestartClient() {
        showToast(currentLang === 'de' ? "Launcher wird neu gestartet..." : "Restarting launcher...", "success");
        setTimeout(() => {
            if (window.api && window.api.installUpdate) {
                window.api.installUpdate();
            } else {
                location.reload();
            }
        }, 1500);
    }

    // --- Friends System ---
    let friendsList = [];
    function loadFriends() {
        const stored = localStorage.getItem('tentix_friends');
        if (stored && !stored.includes('LukasLp')) {
            friendsList = JSON.parse(stored);
        } else {
            friendsList = [];
            localStorage.setItem('tentix_friends', JSON.stringify(friendsList));
        }
        updateFriendsBadge();
    }
    
    function updateFriendsBadge() {
        const badge = document.getElementById('friends-badge');
        if (!badge) return;
        const onlineCount = friendsList.filter(f => f.online).length;
        badge.innerText = onlineCount;
        if (onlineCount > 0) {
            badge.style.transform = 'scale(1)';
        } else {
            badge.style.transform = 'scale(0)';
        }
    }
    
    function toggleFriendsPopup(e) {
        if (e) e.stopPropagation();
        const popup = document.getElementById('friends-popup');
        if (!popup) return;
        
        // Close other popups
        const inbox = document.getElementById('inbox-popup');
        if (inbox) inbox.style.display = 'none';
        const accountCard = document.getElementById('account-card');
        if (accountCard) accountCard.classList.remove('active');
        
        if (popup.style.display === 'flex' || popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'flex';
            popup.style.flexDirection = 'column';
            restoreFriendsPopupSize();
            
            // Periodically toggle fake online states for dynamic feel
            if (Math.random() > 0.5) {
                friendsList.forEach(f => {
                    f.online = Math.random() > 0.45;
                    if (f.online) {
                        const statuses = [
                            'im Launcher',
                            'im Spiel auf Server: TENTIX.net',
                            'im Spiel auf Server: GommeHD.net',
                            'im Hauptmenü'
                        ];
                        f.status = statuses[Math.floor(Math.random() * statuses.length)];
                    } else {
                        f.status = 'Offline';
                    }
                });
                localStorage.setItem('tentix_friends', JSON.stringify(friendsList));
                updateFriendsBadge();
            }
            renderFriendsList();
        }
    }
    
    function toggleAddFriendSection() {
        const sec = document.getElementById('add-friend-section');
        if (!sec) return;
        sec.style.display = sec.style.display === 'none' ? 'flex' : 'none';
    }
    
    function submitAddFriend() {
        const input = document.getElementById('add-friend-name');
        if (!input) return;
        const val = input.value.trim();
        if (!val) {
            showToast(currentLang === 'de' ? "Name oder UUID darf nicht leer sein!" : "Name or UUID cannot be empty!", "error");
            return;
        }
        
        if (friendsList.some(f => f.username.toLowerCase() === val.toLowerCase() || f.uuid === val)) {
            showToast(currentLang === 'de' ? "Bereits in der Freundesliste!" : "Already in friends list!", "error");
            return;
        }
        
        const isUuid = val.includes('-');
        const isOnline = Math.random() > 0.35;
        const statuses = [
            'im Launcher',
            'im Spiel auf Server: TENTIX.net',
            'im Spiel auf Server: GommeHD.net',
            'im Hauptmenü'
        ];
        
        const newFriend = {
            username: isUuid ? "Spieler" : val,
            uuid: isUuid ? val : val + "-uuid",
            online: isOnline,
            status: isOnline ? statuses[Math.floor(Math.random() * statuses.length)] : 'Offline'
        };
        
        friendsList.push(newFriend);
        localStorage.setItem('tentix_friends', JSON.stringify(friendsList));
        updateFriendsBadge();
        renderFriendsList();
        input.value = '';
        toggleAddFriendSection();
        showToast(currentLang === 'de' ? `${val} hinzugefügt!` : `${val} added!`, "success");
    }
    
    function removeFriend(uuid) {
        friendsList = friendsList.filter(f => f.uuid !== uuid);
        localStorage.setItem('tentix_friends', JSON.stringify(friendsList));
        updateFriendsBadge();
        renderFriendsList();
        showToast(currentLang === 'de' ? "Freund entfernt!" : "Friend removed!", "info");
    }

    function connectToFriendServer(ip, e) {
        if (e) e.stopPropagation();
        showToast(currentLang === 'de' ? `Verbinde mit Server ${ip}...` : `Connecting to server ${ip}...`, "info");
        setTimeout(() => {
            showToast(currentLang === 'de' ? `Erfolgreich mit ${ip} verbunden!` : `Successfully connected to ${ip}!`, "success");
        }, 1500);
    }
    
    function renderFriendsList() {
        const container = document.getElementById('friends-list-content');
        const search = document.getElementById('friends-search-input')?.value.toLowerCase() || '';
        if (!container) return;
        container.innerHTML = '';
        
        const filtered = friendsList.filter(f => f.username.toLowerCase().includes(search) || f.uuid.toLowerCase().includes(search));
        
        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #444; font-size: 11px; padding: 20px; font-style: italic;">Keine Freunde gefunden</div>`;
            return;
        }
        
        filtered.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
        
        filtered.forEach(f => {
            const dotColor = f.online ? '#00ff80' : '#555';
            let statusText = f.online ? 'Online' : 'Offline';
            let serverJoinIcon = '';
            
            if (f.online) {
                if (!f.status) {
                    const statuses = [
                        'im Launcher',
                        'im Spiel auf Server: TENTIX.net',
                        'im Spiel auf Server: GommeHD.net',
                        'im Hauptmenü'
                    ];
                    f.status = statuses[Math.floor(Math.random() * statuses.length)];
                }
                statusText = f.status;
                
                if (f.status.includes('Server:')) {
                    const serverIp = f.status.split('Server:')[1].trim();
                    serverJoinIcon = `
                        <div class="friend-join-btn" onclick="connectToFriendServer('${serverIp}', event)" style="cursor: pointer; background: rgba(var(--accent-blue-rgb), 0.12); border: 1px solid rgba(var(--accent-blue-rgb), 0.3); border-radius: 4px; padding: 3px 8px; font-size: 9px; font-weight: 800; color: var(--accent-blue); text-transform: uppercase; margin-right: 8px; display: inline-flex; align-items: center; gap: 4px; transition: 0.2s;" onmouseover="this.style.background='var(--accent-blue)'; this.style.color='#000';" onmouseout="this.style.background='rgba(var(--accent-blue-rgb), 0.12)'; this.style.color='var(--accent-blue)';">
                            <svg viewBox="0 0 24 24" style="width: 10px; height: 10px; fill: currentColor;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                            Join
                        </div>
                    `;
                }
            }
            
            container.innerHTML += `
                <div class="friend-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.02);">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                        <img class="friend-avatar" src="https://minotar.net/avatar/${f.username}/24" onerror="this.src='https://minotar.net/avatar/MHF_Steve/24'" style="border-radius: 4px; width: 24px; height: 24px;">
                        <div style="min-width: 0; flex: 1;">
                           <div style="font-size: 11.5px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${f.username}</div>
                           <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; color: #777; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                               <div class="friend-status-dot" style="background: ${dotColor}; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;"></div>
                               <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${statusText}</span>
                           </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        ${serverJoinIcon}
                        <div class="friend-chat-btn" onclick="openFriendChat('${f.uuid}', '${f.username.replace(/'/g, "\\'")}', event)" style="cursor: pointer; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 3px 6px; display: inline-flex; align-items: center; margin-right: 6px; transition: 0.2s;" onmouseover="this.style.background='rgba(0, 225, 255, 0.1)'; this.style.borderColor='rgba(0, 225, 255, 0.3)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.borderColor='rgba(255, 255, 255, 0.1)';">
                            <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: currentColor; color: #aaa;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                        </div>
                        <div class="friends-remove-btn" onclick="removeFriend('${f.uuid}')" style="cursor: pointer; color: #555; padding: 4px 6px; font-size: 10px; transition: 0.2s;" onmouseover="this.style.color='#ff4b4b';" onmouseout="this.style.color='#555';">✕</div>
                    </div>
                </div>
            `;
        });
    }
    
    function filterFriendsList() {
        renderFriendsList();
    }

    // --- Encrypted Friends Chat System ---
    let activeChatFriendUuid = null;
    let activeChatFriendName = null;
    let chatPollInterval = null;

    // Symmetric E2E XOR Cipher with base64 serialization (UTF-8 safe)
    function xorEncrypt(text, key) {
        try {
            const utf8Text = unescape(encodeURIComponent(text));
            let xored = '';
            for (let i = 0; i < utf8Text.length; i++) {
                xored += String.fromCharCode(utf8Text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return btoa(xored);
        } catch (e) {
            console.error("Encryption failed:", e);
            return btoa(text);
        }
    }

    function xorDecrypt(base64Text, key) {
        try {
            const xored = atob(base64Text);
            let decrypted = '';
            for (let i = 0; i < xored.length; i++) {
                decrypted += String.fromCharCode(xored.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return decodeURIComponent(escape(decrypted));
        } catch (e) {
            console.error("Decryption failed:", e);
            return "[Decryption Error]";
        }
    }

    async function openFriendChat(friendUuid, friendUsername, e) {
        if (e) e.stopPropagation();
        
        activeChatFriendUuid = friendUuid;
        activeChatFriendName = friendUsername;
        
        const chatTitle = document.getElementById('chat-friend-name');
        const chatAvatar = document.getElementById('chat-friend-avatar');
        if (chatTitle) chatTitle.innerText = friendUsername.toUpperCase();
        if (chatAvatar) chatAvatar.src = `https://minotar.net/avatar/${friendUsername}/18`;
        
        const chatPopup = document.getElementById('friends-chat-popup');
        if (chatPopup) {
            chatPopup.style.display = 'flex';
        }
        
        await loadFriendChatHistory();
        
        const msgBox = document.getElementById('friends-chat-messages');
        if (msgBox) {
            msgBox.scrollTop = msgBox.scrollHeight;
        }
        
        if (chatPollInterval) clearInterval(chatPollInterval);
        chatPollInterval = setInterval(loadFriendChatHistory, 3000);
    }

    function closeFriendChat() {
        const chatPopup = document.getElementById('friends-chat-popup');
        if (chatPopup) {
            chatPopup.style.display = 'none';
        }
        activeChatFriendUuid = null;
        activeChatFriendName = null;
        if (chatPollInterval) {
            clearInterval(chatPollInterval);
            chatPollInterval = null;
        }
    }

    async function loadFriendChatHistory() {
        if (!activeChatFriendUuid) return;
        
        const senderUuid = uuidValue || 'guest-uuid';
        const friendUuid = activeChatFriendUuid;
        const msgBox = document.getElementById('friends-chat-messages');
        if (!msgBox) return;
        
        const encryptionKey = [senderUuid, friendUuid].sort().join('-');
        
        try {
            let messages = [];
            if (isClientSimulated) {
                const allSimMsgs = JSON.parse(localStorage.getItem('tentix_sim_private_messages') || '[]');
                messages = allSimMsgs.filter(m => 
                    (m.sender === senderUuid && m.recipient === friendUuid) ||
                    (m.sender === friendUuid && m.recipient === senderUuid)
                );
            } else {
                const res = await fetch(`${API_BASE_URL}/api/chat/history?user1=${senderUuid}&user2=${friendUuid}`);
                const data = await res.json();
                if (data.success) {
                    messages = data.messages;
                }
            }
            
            let html = '';
            if (messages.length === 0) {
                html = `<div style="text-align: center; color: #444; font-size: 11px; padding: 20px; font-style: italic;">Keine Nachrichten vorhanden. Schreibe eine Nachricht...</div>`;
            } else {
                messages.forEach(msg => {
                    const isMe = msg.sender === senderUuid;
                    const decryptedContent = xorDecrypt(msg.content, encryptionKey);
                    const bubbleClass = isMe ? 'sent' : 'received';
                    const timeStr = new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    html += `
                        <div class="chat-bubble ${bubbleClass}">
                            <div>${decryptedContent}</div>
                            <div class="chat-time">${timeStr}</div>
                        </div>
                    `;
                });
            }
            
            if (msgBox.innerHTML !== html) {
                const wasAtBottom = msgBox.scrollHeight - msgBox.clientHeight <= msgBox.scrollTop + 40;
                msgBox.innerHTML = html;
                if (wasAtBottom) {
                    msgBox.scrollTop = msgBox.scrollHeight;
                }
            }
        } catch (err) {
            console.error("Failed to load chat history:", err);
        }
    }

    async function sendFriendChatMessage() {
        const input = document.getElementById('friends-chat-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        
        const senderUuid = uuidValue || 'guest-uuid';
        const friendUuid = activeChatFriendUuid;
        if (!friendUuid) return;
        
        const encryptionKey = [senderUuid, friendUuid].sort().join('-');
        const encryptedText = xorEncrypt(text, encryptionKey);
        
        const payload = {
            sender: senderUuid,
            recipient: friendUuid,
            content: encryptedText
        };
        
        try {
            if (isClientSimulated) {
                const allSimMsgs = JSON.parse(localStorage.getItem('tentix_sim_private_messages') || '[]');
                allSimMsgs.push({
                    ...payload,
                    created_at: new Date().toISOString()
                });
                localStorage.setItem('tentix_sim_private_messages', JSON.stringify(allSimMsgs));
                input.value = '';
                await loadFriendChatHistory();
                const msgBox = document.getElementById('friends-chat-messages');
                if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
            } else {
                const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    input.value = '';
                    await loadFriendChatHistory();
                    const msgBox = document.getElementById('friends-chat-messages');
                    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
                } else {
                    showToast("Fehler beim Senden!", "error");
                }
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            showToast("Fehler beim Senden!", "error");
        }
    }

    // --- Shop Cart Logic ---
    let shoppingCart = [];
    
    function toggleCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const winControls = document.getElementById('top-right-controls');
        if (drawer) {
            drawer.classList.toggle('open');
            if (drawer.classList.contains('open')) {
                if (winControls) {
                    winControls.style.opacity = '0';
                    winControls.style.visibility = 'hidden';
                    winControls.style.pointerEvents = 'none';
                }
            } else {
                if (winControls) {
                    winControls.style.opacity = '1';
                    winControls.style.visibility = 'visible';
                    winControls.style.pointerEvents = 'auto';
                }
            }
        }
    }
    
    function addToCart(productId) {
        const product = SHOP_PRODUCTS.find(p => p.id === productId);
        if (!product) return;
        
        if (shoppingCart.some(item => item.id === productId)) {
            showToast(currentLang === 'de' ? "Artikel ist bereits im Warenkorb!" : "Item already in cart!", "info");
            return;
        }
        
        shoppingCart.push(product);
        updateCartUI();
        showToast(currentLang === 'de' ? `${product.title} im Warenkorb!` : `${product.title} in cart!`, "success");
        
        const drawer = document.getElementById('cart-drawer');
        if (drawer && !drawer.classList.contains('open')) {
            drawer.classList.add('open');
            const winControls = document.getElementById('top-right-controls');
            if (winControls) {
                winControls.style.opacity = '0';
                winControls.style.visibility = 'hidden';
                winControls.style.pointerEvents = 'none';
            }
        }
    }
    
    function removeFromCart(productId) {
        shoppingCart = shoppingCart.filter(item => item.id !== productId);
        updateCartUI();
    }
    
    function formatPrice(val) {
        return val.toFixed(2).replace('.', ',') + ' €';
    }
    
    function updateCartUI() {
        const badge = document.getElementById('shop-cart-badge');
        if (badge) {
            badge.innerText = shoppingCart.length;
            if (shoppingCart.length > 0) {
                badge.style.transform = 'scale(1)';
                badge.style.opacity = '1';
            } else {
                badge.style.transform = 'scale(0)';
                badge.style.opacity = '0';
            }
        }
        
        const list = document.getElementById('cart-items-list');
        if (!list) return;
        list.innerHTML = '';
        
        if (shoppingCart.length === 0) {
            list.innerHTML = `<div style="text-align:center; color:#555; font-size:11px; padding:30px; font-style:italic;">Dein Warenkorb ist leer.</div>`;
            document.getElementById('cart-subtotal').innerText = '0,00 €';
            document.getElementById('cart-total').innerText = '0,00 €';
            document.getElementById('cart-vat-value').innerText = '0,00 €';
            document.getElementById('cart-discount-row').style.display = 'none';
            return;
        }
        
        let subtotal = 0;
        shoppingCart.forEach(item => {
            subtotal += item.price;
            list.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-icon">${item.icon}</div>
                        <div>
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">${formatPrice(item.price)}</div>
                        </div>
                    </div>
                    <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</div>
                </div>
            `;
        });
        
        document.getElementById('cart-subtotal').innerText = formatPrice(subtotal);
        
        const activeCodeStr = localStorage.getItem('applied_creator_code');
        const codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        const activeCode = codes.find(c => c.code.toUpperCase() === (activeCodeStr || '').toUpperCase());
        
        let total = subtotal;
        if (activeCode) {
            const discountPercent = activeCode.discount;
            const discountVal = subtotal * (discountPercent / 100);
            total = subtotal - discountVal;
            
            document.getElementById('cart-discount-percent').innerText = discountPercent;
            document.getElementById('cart-discount-value').innerText = `-${formatPrice(discountVal)}`;
            document.getElementById('cart-discount-row').style.display = 'flex';
        } else {
            document.getElementById('cart-discount-row').style.display = 'none';
        }
        
        document.getElementById('cart-total').innerText = formatPrice(total);
        
        const vatVal = total - (total / 1.19);
        document.getElementById('cart-vat-value').innerText = formatPrice(vatVal);
    }
    
    function syncCreatorCodeInputs(e, targetId) {
        const targetInput = document.getElementById(targetId);
        if (targetInput) {
            targetInput.value = e.target.value;
        }
        const status = document.getElementById('shop-creator-status');
        const cartStatus = document.getElementById('cart-creator-status');
        if (status) status.style.display = 'none';
        if (cartStatus) cartStatus.style.display = 'none';
    }

    let selectedCartPaymentMethod = 'paypal';
    function selectCartPayment(method) {
        selectedCartPaymentMethod = method;
        document.querySelectorAll('.cart-pay-btn').forEach(btn => {
            if (btn.getAttribute('data-method') === method) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function applyShopCreatorCode() {
        const input = document.getElementById('shop-creator-input');
        const cartInput = document.getElementById('cart-creator-input');
        const status = document.getElementById('shop-creator-status');
        const cartStatus = document.getElementById('cart-creator-status');
        
        const activeInput = document.activeElement && document.activeElement.id === 'cart-creator-input' ? cartInput : input;
        if (!activeInput) return;
        const val = activeInput.value.trim().toUpperCase();
        
        if (!val) {
            showToast(currentLang === 'de' ? "Creator Code darf nicht leer sein!" : "Creator Code cannot be empty!", "error");
            return;
        }
        
        const codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        const codeObj = codes.find(c => c.code.toUpperCase() === val);
        
        if (codeObj) {
            localStorage.setItem('applied_creator_code', val);
            localStorage.setItem('applied_creator_code_time', Date.now().toString());
            
            const text = `Code '${val}' aktiv (${codeObj.discount}% Rabatt)`;
            if (status) { status.innerText = text; status.style.color = '#00ff80'; status.style.display = 'block'; }
            if (cartStatus) { cartStatus.innerText = text; cartStatus.style.color = '#00ff80'; cartStatus.style.display = 'block'; }
            if (input) input.value = val;
            if (cartInput) cartInput.value = val;
            
            showToast(currentLang === 'de' ? `Creator Code '${val}' angewendet!` : `Creator Code '${val}' applied!`, "success");
            updateCartUI();
        } else {
            const text = currentLang === 'de' ? "Ungültiger Creator Code!" : "Invalid Creator Code!";
            if (status) { status.innerText = text; status.style.color = '#ff4b4b'; status.style.display = 'block'; }
            if (cartStatus) { cartStatus.innerText = text; cartStatus.style.color = '#ff4b4b'; cartStatus.style.display = 'block'; }
            
            showToast(currentLang === 'de' ? "Ungültiger Code!" : "Invalid Code!", "error");

            setTimeout(() => {
                if (status && (status.innerText.includes("Ungültiger") || status.innerText.includes("Invalid"))) {
                    status.style.display = 'none';
                }
                if (cartStatus && (cartStatus.innerText.includes("Ungültiger") || cartStatus.innerText.includes("Invalid"))) {
                    cartStatus.style.display = 'none';
                }
            }, 4000);
        }
    }
    
    function checkCreatorCodeExpiration() {
        const code = localStorage.getItem('applied_creator_code');
        const time = localStorage.getItem('applied_creator_code_time');
        const status = document.getElementById('shop-creator-status');
        const cartStatus = document.getElementById('cart-creator-status');
        const input = document.getElementById('shop-creator-input');
        const cartInput = document.getElementById('cart-creator-input');

        if (code && time) {
            const elapsed = Date.now() - parseInt(time, 10);
            const limit = 30 * 24 * 3600 * 1000; // 30 days
            if (elapsed >= limit) {
                localStorage.removeItem('applied_creator_code');
                localStorage.removeItem('applied_creator_code_time');
                showToast(currentLang === 'de' ? `Dein Creator-Code '${code}' ist nach 30 Tagen abgelaufen!` : `Your creator code '${code}' has expired after 30 days!`, "warning");
                if (status) status.style.display = 'none';
                if (cartStatus) cartStatus.style.display = 'none';
            } else {
                const codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
                const codeObj = codes.find(c => c.code.toUpperCase() === code.toUpperCase());
                if (codeObj) {
                    const text = `Code '${code}' aktiv (${codeObj.discount}% Rabatt)`;
                    if (status) { status.innerText = text; status.style.color = '#00ff80'; status.style.display = 'block'; }
                    if (cartStatus) { cartStatus.innerText = text; cartStatus.style.color = '#00ff80'; cartStatus.style.display = 'block'; }
                    if (input) input.value = code;
                    if (cartInput) cartInput.value = code;
                }
            }
        }
    }
    
    let selectedDonationMethod = 'paypal';

    function openDonationModal() {
        const modal = document.getElementById('donation-modal');
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.firstElementChild.style.transform = 'scale(1)';
        }, 10);
        
        // Sync inputs
        const donationInput = document.getElementById('donation-amount-input');
        const donationRange = document.getElementById('donation-amount-range');
        if (donationInput && donationRange) {
            donationInput.value = 10;
            donationRange.value = 10;
        }
    }

    function closeDonationModal() {
        const modal = document.getElementById('donation-modal');
        if (!modal) return;
        modal.firstElementChild.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }

    function selectDonationMethod(method, element) {
        selectedDonationMethod = method;
        document.querySelectorAll('#donation-methods-grid .pay-method-opt').forEach(opt => {
            opt.classList.remove('active');
            opt.style.borderColor = 'rgba(255,255,255,0.06)';
            opt.style.background = 'rgba(0,0,0,0.2)';
        });
        element.classList.add('active');
        if (method === 'paypal') {
            element.style.borderColor = '#0079c1';
            element.style.background = 'rgba(0, 121, 193, 0.1)';
        } else {
            element.style.borderColor = 'var(--accent-blue)';
            element.style.background = 'rgba(var(--accent-blue-rgb), 0.05)';
        }
    }

    function executeDonation() {
        const amtInput = document.getElementById('donation-amount-input');
        const amt = amtInput ? parseFloat(amtInput.value) : 10;
        if (isNaN(amt) || amt < 2) {
            showToast(currentLang === 'de' ? "Mindestspende beträgt 2,00 €." : "Minimum donation is €2.00.", "error");
            return;
        }
        closeDonationModal();
        showToast(currentLang === 'de' ? "Weiterleitung zu PayPal..." : "Redirecting to PayPal...", "success");
        const formattedAmt = amt.toFixed(2);
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=liesesandro4@gmail.com&item_name=Tentix%20Client%20Support&amount=${formattedAmt}&currency_code=EUR`;
        if (window.api && window.api.openExternalLink) {
            window.api.openExternalLink(paypalUrl);
        } else {
            window.open(paypalUrl, '_blank');
        }
    }

    function restoreFriendsPopupSize() {
        const currentUser = localStorage.getItem('tentix_username') || 'guest';
        const width = localStorage.getItem(`friends_popup_width_${currentUser}`);
        const height = localStorage.getItem(`friends_popup_height_${currentUser}`);
        const popup = document.getElementById('friends-popup');
        if (popup) {
            if (width) popup.style.width = width + 'px';
            if (height) popup.style.height = height + 'px';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const donationInput = document.getElementById('donation-amount-input');
        const donationRange = document.getElementById('donation-amount-range');
        if (donationInput && donationRange) {
            donationInput.addEventListener('input', () => {
                donationRange.value = donationInput.value;
            });
            donationRange.addEventListener('input', () => {
                donationInput.value = donationRange.value;
            });
        }

        const friendsPopup = document.getElementById('friends-popup');
        if (friendsPopup) {
            restoreFriendsPopupSize();
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const width = Math.round(entry.contentRect.width);
                    const height = Math.round(entry.contentRect.height);
                    if (width > 50 && height > 50) {
                        if (friendsPopup.style.display === 'flex' || friendsPopup.style.display === 'block') {
                            const currentUser = localStorage.getItem('tentix_username') || 'guest';
                            localStorage.setItem(`friends_popup_width_${currentUser}`, width);
                            localStorage.setItem(`friends_popup_height_${currentUser}`, height);
                        }
                    }
                }
            });
            resizeObserver.observe(friendsPopup);
        }
    });

    function checkoutCart() {
        if (shoppingCart.length === 0) return;
        
        let subtotal = 0;
        shoppingCart.forEach(item => subtotal += item.price);
        
        const activeCodeStr = localStorage.getItem('applied_creator_code');
        const codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        const activeCode = codes.find(c => c.code.toUpperCase() === (activeCodeStr || '').toUpperCase());
        
        let total = subtotal;
        if (activeCode) {
            const discountVal = subtotal * (activeCode.discount / 100);
            total = subtotal - discountVal;
        }
        
        const formattedTotal = total.toFixed(2);
        const itemNames = shoppingCart.map(item => item.title).join(', ');
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=liesesandro4@gmail.com&currency_code=EUR&amount=${formattedTotal}&item_name=${encodeURIComponent('TENTIX: ' + itemNames)}`;
        
        if (window.api && window.api.openExternalLink) {
            window.api.openExternalLink(paypalUrl);
        }
        
        showToast(currentLang === 'de' ? `Zahlung von ${formatPrice(total)} wird verarbeitet...` : `Processing payment of ${formatPrice(total)}...`, "info");
        
        setTimeout(() => {
            shoppingCart.forEach(item => {
                localStorage.setItem(`tentix_unlocked_${item.id}`, 'true');
            });
            
            shoppingCart = [];
            updateCartUI();
            
            const drawer = document.getElementById('cart-drawer');
            if (drawer && drawer.classList.contains('open')) {
                toggleCartDrawer();
            }
            
            showToast(currentLang === 'de' ? "Kauf erfolgreich abgeschlossen!" : "Purchase completed successfully!", "success");
            updateCosmeticsLocks();
        }, 1500);
    }

    // --- Admin Creator Codes Manager ---
    async function renderCreatorCodesTable() {
        const tbody = document.getElementById('dash-creator-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let codes = [];
        if (isClientSimulated) {
            codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/creator-codes`);
                const data = await res.json();
                if (data.success) {
                    codes = data.codes;
                    localStorage.setItem('tentix_creator_codes', JSON.stringify(codes));
                } else {
                    codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
                }
            } catch (e) {
                codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
            }
        }
        
        if (codes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; font-style:italic; padding:20px;">Keine Creator Codes vorhanden.</td></tr>`;
            return;
        }
        
        codes.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td style="color:#fff; font-weight:700;">${c.code}</td>
                    <td>${c.discount}%</td>
                    <td style="text-align: center;"><div class="dash-btn" style="background:rgba(255, 75, 75, 0.1); border:1px solid #ff4b4b; color:#ff4b4b; padding:6px 12px; font-size:10px; margin:0;" onclick="deleteCreatorCode('${c.code}')">Löschen</div></td>
                </tr>
            `;
        });
    }
    
    async function createCreatorCode() {
        if (!hasPermission('CanManageCreatorCodes')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zur Codeverwaltung!" : "No permission to manage creator codes!", "error");
            return;
        }
        
        const codeEl = document.getElementById('dash-creator-code');
        const discountEl = document.getElementById('dash-creator-discount');
        if (!codeEl || !discountEl) return;
        const code = codeEl.value.trim().toUpperCase();
        const discount = parseInt(discountEl.value, 10);
        
        if (!code) {
            showToast(currentLang === 'de' ? "Code darf nicht leer sein!" : "Code cannot be empty!", "error");
            return;
        }
        if (isNaN(discount) || discount < 0 || discount > 100) {
            showToast(currentLang === 'de' ? "Rabatt muss zwischen 0 und 100 sein!" : "Discount must be between 0 and 100!", "error");
            return;
        }
        
        let codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        if (codes.some(c => c.code.toUpperCase() === code)) {
            showToast(currentLang === 'de' ? "Creator Code existiert bereits!" : "Creator Code already exists!", "error");
            return;
        }
        
        if (isClientSimulated) {
            codes.push({ code: code, discount: discount });
            localStorage.setItem('tentix_creator_codes', JSON.stringify(codes));
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/creator-codes/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code, discount: discount })
                });
                const data = await res.json();
                if (!data.success) {
                    showToast(data.error || "Fehler beim Erstellen des Codes", "error");
                    return;
                }
                codes.push({ code: code, discount: discount });
                localStorage.setItem('tentix_creator_codes', JSON.stringify(codes));
            } catch (e) {
                showToast("Verbindungsfehler", "error");
                return;
            }
        }
        
        codeEl.value = '';
        discountEl.value = '';
        renderCreatorCodesTable();
        showToast(currentLang === 'de' ? `Creator Code '${code}' erstellt!` : `Creator Code '${code}' created!`, "success");
    }
    
    async function deleteCreatorCode(code) {
        if (!hasPermission('CanManageCreatorCodes')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zur Codeverwaltung!" : "No permission to manage creator codes!", "error");
            return;
        }
        
        let codes = JSON.parse(localStorage.getItem('tentix_creator_codes') || '[]');
        
        if (isClientSimulated) {
            codes = codes.filter(c => c.code.toUpperCase() !== code.toUpperCase());
            localStorage.setItem('tentix_creator_codes', JSON.stringify(codes));
        } else {
            try {
                const res = await fetch(`${API_BASE_URL}/api/creator-codes/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code })
                });
                const data = await res.json();
                if (!data.success) {
                    showToast(data.error || "Fehler beim Löschen des Codes", "error");
                    return;
                }
                codes = codes.filter(c => c.code.toUpperCase() !== code.toUpperCase());
                localStorage.setItem('tentix_creator_codes', JSON.stringify(codes));
            } catch (e) {
                showToast("Verbindungsfehler", "error");
                return;
            }
        }
        
        renderCreatorCodesTable();
        showToast(currentLang === 'de' ? "Creator Code gelöscht!" : "Creator Code deleted!", "info");
    }

    // --- Permissions Configuration ---
    const ALL_PERMISSIONS = [
        { key: 'CanDeleteUsers', label_de: 'Nutzer löschen (User Manager)', label_en: 'Delete Users' },
        { key: 'CanBanUsers', label_de: 'Nutzer bannen & entbannen', label_en: 'Ban/Unban Users' },
        { key: 'CanEditRoles', label_de: 'Ränge & Badges zuweisen', label_en: 'Assign Ranks/Badges' },
        { key: 'CanGenerateCodes', label_de: 'Redeem Codes generieren', label_en: 'Generate Redeem Codes' },
        { key: 'CanManageNews', label_de: 'News verfassen & löschen', label_en: 'Create/Delete News' },
        { key: 'CanToggleMaintenance', label_de: 'Wartungsmodus ein-/ausschalten', label_en: 'Toggle Maintenance' },
        { key: 'CanManageCreatorCodes', label_de: 'Creator Codes verwalten', label_en: 'Manage Creator Codes' }
    ];
    
    function initPermissions() {
        if (!localStorage.getItem('tentix_role_permissions')) {
            const defaults = {
                'OWNER': ['CanDeleteUsers', 'CanBanUsers', 'CanEditRoles', 'CanGenerateCodes', 'CanManageNews', 'CanToggleMaintenance', 'CanManageCreatorCodes'],
                'DEV': ['CanDeleteUsers', 'CanBanUsers', 'CanEditRoles', 'CanGenerateCodes', 'CanManageNews', 'CanToggleMaintenance', 'CanManageCreatorCodes'],
                'ADMIN': ['CanBanUsers', 'CanEditRoles', 'CanGenerateCodes', 'CanManageNews', 'CanToggleMaintenance', 'CanManageCreatorCodes'],
                'MOD': ['CanBanUsers', 'CanManageNews'],
                'SUPP': ['CanBanUsers']
            };
            localStorage.setItem('tentix_role_permissions', JSON.stringify(defaults));
        }
    }
    
    function hasPermission(permissionKey) {
        const userRole = currentDashRole || 'GUEST';
        if (userRole === 'OWNER') return true; // Owner has all permissions
        
        const perms = JSON.parse(localStorage.getItem('tentix_role_permissions') || '{}');
        const rolePerms = perms[userRole] || [];
        return rolePerms.includes(permissionKey);
    }
    
    function loadRolePermissions() {
        const role = document.getElementById('permissions-role-select').value;
        const container = document.getElementById('permissions-checkbox-container');
        if (!container) return;
        container.innerHTML = '';
        
        const perms = JSON.parse(localStorage.getItem('tentix_role_permissions') || '{}');
        const rolePerms = perms[role] || [];
        
        ALL_PERMISSIONS.forEach(p => {
            const label = currentLang === 'de' ? p.label_de : p.label_en;
            const checked = rolePerms.includes(p.key) ? 'checked' : '';
            const disabled = role === 'OWNER' ? 'disabled' : ''; 
            container.innerHTML += `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="perm-chk-${p.key}" data-perm="${p.key}" ${checked} ${disabled} style="width: 16px; height: 16px; cursor: pointer;">
                    <label for="perm-chk-${p.key}" style="font-size: 12px; color: #fff; cursor: pointer;">${label}</label>
                </div>
            `;
        });
    }
    
    function saveRolePermissions() {
        const role = document.getElementById('permissions-role-select').value;
        if (role === 'OWNER') {
            showToast(currentLang === 'de' ? "Owner-Berechtigungen können nicht bearbeitet werden!" : "Owner permissions are immutable!", "error");
            return;
        }
        
        const perms = JSON.parse(localStorage.getItem('tentix_role_permissions') || '{}');
        const selected = [];
        ALL_PERMISSIONS.forEach(p => {
            const chk = document.getElementById(`perm-chk-${p.key}`);
            if (chk && chk.checked) {
                selected.push(p.key);
            }
        });
        
        perms[role] = selected;
        localStorage.setItem('tentix_role_permissions', JSON.stringify(perms));
        showToast(currentLang === 'de' ? "Berechtigungen erfolgreich gespeichert!" : "Permissions successfully saved!", "success");
    }

    // --- Maintenance Management ---
    function loadMaintenanceTab() {
        const maintActive = localStorage.getItem('tentix_maintenance_active') === 'true';
        document.getElementById('maint-global-active').checked = maintActive;
        
        document.getElementById('maint-deactivate-play').checked = localStorage.getItem('tentix_maint_deactivate_play') === 'true';
        document.getElementById('maint-deactivate-explore').checked = localStorage.getItem('tentix_maint_deactivate_explore') === 'true';
        document.getElementById('maint-deactivate-cosmetics').checked = localStorage.getItem('tentix_maint_deactivate_cosmetics') === 'true';
        document.getElementById('maint-deactivate-shop').checked = localStorage.getItem('tentix_maint_deactivate_shop') === 'true';
        document.getElementById('maint-deactivate-tentixplus').checked = localStorage.getItem('tentix_maint_deactivate_tentixplus') === 'true';
    }
    
    function toggleGlobalMaintenance(active) {
        localStorage.setItem('tentix_maintenance_active', active ? 'true' : 'false');
        if (active) {
            localStorage.setItem('tentix_last_maintenance', new Date().toISOString());
        }
        
        // Synchronize with system status maintenance state
        if (maintenanceModeActive !== active) {
            maintenanceModeActive = active;
            if (isClientSimulated) {
                localStorage.setItem('tentix_sim_maintenance', active ? 'true' : 'false');
                applyMaintenanceModeState(active);
            } else {
                fetch(`${API_BASE_URL}/api/system/maintenance`, { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            applyMaintenanceModeState(data.maintenance);
                        }
                    }).catch(() => {});
            }
        } else {
            applyMaintenanceModeState(active);
        }
        
        updateNavMaintenanceState();
        loadNews(); 
    }
    
    function saveMaintenanceSettings() {
        if (!hasPermission('CanToggleMaintenance')) {
            showToast(currentLang === 'de' ? "Keine Berechtigung zur Wartungsverwaltung!" : "No permission to manage maintenance!", "error");
            return;
        }
        
        const play = document.getElementById('maint-deactivate-play').checked;
        const explore = document.getElementById('maint-deactivate-explore').checked;
        const cosmetics = document.getElementById('maint-deactivate-cosmetics').checked;
        const shop = document.getElementById('maint-deactivate-shop').checked;
        const tentixplus = document.getElementById('maint-deactivate-tentixplus').checked;
        
        localStorage.setItem('tentix_maint_deactivate_play', play ? 'true' : 'false');
        localStorage.setItem('tentix_maint_deactivate_explore', explore ? 'true' : 'false');
        localStorage.setItem('tentix_maint_deactivate_cosmetics', cosmetics ? 'true' : 'false');
        localStorage.setItem('tentix_maint_deactivate_shop', shop ? 'true' : 'false');
        localStorage.setItem('tentix_maint_deactivate_tentixplus', tentixplus ? 'true' : 'false');
        
        updateNavMaintenanceState();
        showToast(currentLang === 'de' ? "Wartungs-Einstellungen gespeichert!" : "Maintenance settings saved!", "success");
    }

    function isFeatureDeactivated(feature) {
        const maintActive = localStorage.getItem('tentix_maintenance_active') === 'true';
        if (!maintActive) return false;
        return localStorage.getItem(`tentix_maint_deactivate_${feature}`) === 'true';
    }

    function updateNavMaintenanceState() {
        const isPlayDeactivated = isFeatureDeactivated('play');
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            if (isPlayDeactivated) {
                playBtn.style.opacity = '0.4';
                playBtn.style.pointerEvents = 'none';
                playBtn.style.cursor = 'not-allowed';
                playBtn.title = currentLang === 'de' ? "Spielen während der Wartungsarbeiten deaktiviert" : "Playing disabled during maintenance";
            } else {
                playBtn.style.opacity = '1';
                playBtn.style.pointerEvents = 'auto';
                playBtn.style.cursor = 'pointer';
                playBtn.title = '';
            }
        }

        document.querySelectorAll('.nav-item').forEach(el => {
            const page = el.getAttribute('data-page');
            if (page && isFeatureDeactivated(page)) {
                el.classList.add('disabled');
            } else {
                el.classList.remove('disabled');
            }
        });
        
        // Update global maintenance banner visibility
        updateMaintenanceBannerVisibility();
    }

    function updateMaintenanceBannerVisibility() {
        const banner = document.getElementById('maintenance-banner');
        if (!banner) return;
        
        const maintActive = localStorage.getItem('tentix_maintenance_active') === 'true';
        const activeTabEl = document.querySelector('.nav-item.active');
        const currentTab = activeTabEl ? activeTabEl.getAttribute('data-page') : 'start';
        const settingsOpen = document.getElementById('settings-overlay') && document.getElementById('settings-overlay').style.display === 'flex';
        
        if (maintActive && isAppReady && currentTab === 'start' && !settingsOpen && !paymentMethodsExpanded) {
            banner.style.display = 'flex';
        } else {
            banner.style.display = 'none';
        }
    }

    // --- 2D Pixel Steve Skin Fallback Renderer ---
    function draw2DSkinOnCanvas(skinUrlOrDataUrl) {
        const canvas = document.getElementById('skin-changer-canvas-2d');
        if (!canvas) return;
        canvas.width = 180;
        canvas.height = 260;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Procedural pixel Steve immediate drawing
        ctx.imageSmoothingEnabled = false;
        const scale = 4.5;
        const charW = 16 * scale;
        const charH = 32 * scale;
        const xOffset = (canvas.width - charW) / 2;
        const yOffset = (canvas.height - charH) / 2;
        
        // Head (Peach skin)
        ctx.fillStyle = '#db9c72';
        ctx.fillRect(xOffset + 4 * scale, yOffset, 8 * scale, 8 * scale);
        // Hair (Brown)
        ctx.fillStyle = '#543b23';
        ctx.fillRect(xOffset + 4 * scale, yOffset, 8 * scale, 2.5 * scale);
        // Eyes (Blue/White)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(xOffset + 5 * scale, yOffset + 3.5 * scale, 2 * scale, 1 * scale);
        ctx.fillRect(xOffset + 9 * scale, yOffset + 3.5 * scale, 2 * scale, 1 * scale);
        ctx.fillStyle = '#2c53a6';
        ctx.fillRect(xOffset + 6 * scale, yOffset + 3.5 * scale, 1 * scale, 1 * scale);
        ctx.fillRect(xOffset + 9 * scale, yOffset + 3.5 * scale, 1 * scale, 1 * scale);
        // Mouth (Reddish brown)
        ctx.fillStyle = '#a05c3c';
        ctx.fillRect(xOffset + 6 * scale, yOffset + 5.5 * scale, 4 * scale, 1.5 * scale);
        
        // Torso (Cyan shirt)
        ctx.fillStyle = '#00a6ad';
        ctx.fillRect(xOffset + 4 * scale, yOffset + 8 * scale, 8 * scale, 12 * scale);
        
        // Left Arm (Cyan sleeve, peach skin)
        ctx.fillStyle = '#00a6ad';
        ctx.fillRect(xOffset, yOffset + 8 * scale, 4 * scale, 4 * scale);
        ctx.fillStyle = '#db9c72';
        ctx.fillRect(xOffset, yOffset + 12 * scale, 4 * scale, 8 * scale);
        
        // Right Arm (Cyan sleeve, peach skin)
        ctx.fillStyle = '#00a6ad';
        ctx.fillRect(xOffset + 12 * scale, yOffset + 8 * scale, 4 * scale, 4 * scale);
        ctx.fillStyle = '#db9c72';
        ctx.fillRect(xOffset + 12 * scale, yOffset + 12 * scale, 4 * scale, 8 * scale);
        
        // Left Leg (Dark blue pants, grey shoes)
        ctx.fillStyle = '#4c3e85';
        ctx.fillRect(xOffset + 4 * scale, yOffset + 20 * scale, 4 * scale, 10 * scale);
        ctx.fillStyle = '#555555';
        ctx.fillRect(xOffset + 4 * scale, yOffset + 30 * scale, 4 * scale, 2 * scale);
        
        // Right Leg (Dark blue pants, grey shoes)
        ctx.fillStyle = '#4c3e85';
        ctx.fillRect(xOffset + 8 * scale, yOffset + 20 * scale, 4 * scale, 10 * scale);
        ctx.fillStyle = '#555555';
        ctx.fillRect(xOffset + 8 * scale, yOffset + 30 * scale, 4 * scale, 2 * scale);
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = skinUrlOrDataUrl || 'https://minotar.net/skin/MHF_Steve';
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;
            
            // Draw actual skin
            // Head
            ctx.drawImage(img, 8, 8, 8, 8, xOffset + 4 * scale, yOffset, 8 * scale, 8 * scale);
            ctx.drawImage(img, 40, 8, 8, 8, xOffset + 4 * scale, yOffset, 8 * scale, 8 * scale); // Helm layer
            
            // Torso
            ctx.drawImage(img, 20, 20, 8, 12, xOffset + 4 * scale, yOffset + 8 * scale, 8 * scale, 12 * scale);
            ctx.drawImage(img, 20, 36, 8, 12, xOffset + 4 * scale, yOffset + 8 * scale, 8 * scale, 12 * scale); // Torso layer
            
            // Left Arm
            ctx.drawImage(img, 44, 20, 4, 12, xOffset, yOffset + 8 * scale, 4 * scale, 12 * scale);
            ctx.drawImage(img, 44, 36, 4, 12, xOffset, yOffset + 8 * scale, 4 * scale, 12 * scale); // Left arm layer
            
            // Right Arm
            ctx.drawImage(img, 44, 20, 4, 12, xOffset + 12 * scale, yOffset + 8 * scale, 4 * scale, 12 * scale);
            ctx.drawImage(img, 44, 36, 4, 12, xOffset + 12 * scale, yOffset + 8 * scale, 4 * scale, 12 * scale); // Right arm layer
            
            // Left Leg
            ctx.drawImage(img, 4, 20, 4, 12, xOffset + 4 * scale, yOffset + 20 * scale, 4 * scale, 12 * scale);
            ctx.drawImage(img, 4, 36, 4, 12, xOffset + 4 * scale, yOffset + 20 * scale, 4 * scale, 12 * scale); // Left leg layer
            
            // Right Leg
            ctx.drawImage(img, 4, 20, 4, 12, xOffset + 8 * scale, yOffset + 20 * scale, 4 * scale, 12 * scale);
            ctx.drawImage(img, 4, 36, 4, 12, xOffset + 8 * scale, yOffset + 20 * scale, 4 * scale, 12 * scale); // Right leg layer
        };
    }


    // Starte den Launcher
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', BootSequence);
    } else {
        BootSequence();
    }
