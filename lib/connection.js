const {
    Browsers,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require("@ardsvt/baileys");

const pino = require("pino");
const chalk = require("chalk");
const { join, resolve } = require("path");
const { makeWASocket } = require("./simple.js");

let conn = null;
let conns = new Map();
const authFolder = "sessions/";

const logger = pino({ level: "silent" });

const authStatePromise = useMultiFileAuthState(join(authFolder, "parent"));

async function start(_conn = null, opts = {}) {
    const { authState } = opts;
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const socketConfig = {
        version,
        logger,
        printQRInTerminal: !(opts.usePairingCode || opts.isChild),
        browser: Browsers.ubuntu("Chrome"),
        qrTimeout: 60000,
        auth: {
            creds: authState.state.creds,
            keys: makeCacheableSignalKeyStore(authState.state.keys, logger.child({ stream: "store" }))
        }
    };

    const sock = makeWASocket(socketConfig, {
        ...(_conn && _conn?.chats ? { chats: _conn.chats } : {})
    });

    if (_conn) {
        sock.isInit = _conn.isInit;
        sock.isReloadInit = _conn.isReloadInit;
    }

    if (sock.isInit == null) {
        sock.isInit = false;
        sock.isReloadInit = true;
    }

    await reload(sock, false, opts).catch(console.error);
    return sock;
}

let oldHandler = null;

async function reload(sock, force = false, opts = {}) {
    if (!opts.handler) opts.handler = require("../client.js")
    if (opts.handler instanceof Promise) opts.handler = await opts.handler;
    if (!opts.handler && oldHandler) opts.handler = oldHandler;
    oldHandler = opts.handler;

    const isReloadInit = !!sock.isReloadInit;
    if (force) {
        console.log("restarting connection...");
        try { sock.ws.close(); } catch { }
        sock.ev.removeAllListeners();
        Object.assign(sock, await start(sock, opts) || {});
    }

    Object.assign(sock, messageConfig());

    if (!isReloadInit) {
        console.log("closing connection...");
        if (sock.credsUpdate) sock.ev.off("creds.update", sock.credsUpdate);
        if (sock.handler) sock.ev.off("messages.upsert", sock.handler);
        if (sock.participantsUpdate) sock.ev.off("group-participants.update", sock.participantsUpdate);
        if (sock.groupsUpdate) sock.ev.off("groups.update", sock.groupsUpdate);
        if (sock.onDelete) sock.ev.off("message.delete", sock.onDelete);
        if (sock.connectionUpdate) sock.ev.off("connection.update", sock.connectionUpdate);
    }

    if (opts.handler) {
        if (opts.handler?.handler) sock.handler = opts.handler.handler.bind(sock);
        if (opts.handler?.participantsUpdate) sock.participantsUpdate = opts.handler.participantsUpdate.bind(sock);
        if (opts.handler?.groupsUpdate) sock.groupsUpdate = opts.handler.groupsUpdate.bind(sock);
        if (opts.handler?.deleteUpdate) sock.onDelete = opts.handler.deleteUpdate.bind(sock);
    }

    if (!opts.isChild) sock.connectionUpdate = connectionUpdate.bind(sock, opts);
    sock.credsUpdate = opts.authState?.saveCreds.bind(sock);

    if (sock.handler) sock.ev.on("messages.upsert", sock.handler);
    if (sock.participantsUpdate) sock.ev.on("group-participants.update", sock.participantsUpdate);
    if (sock.groupsUpdate) sock.ev.on("groups.update", sock.groupsUpdate);
    if (sock.onDelete) sock.ev.on("message.delete", sock.onDelete);
    if (sock.connectionUpdate) sock.ev.on("connection.update", sock.connectionUpdate);
    if (sock.credsUpdate) sock.ev.on("creds.update", sock.credsUpdate);

    sock.isReloadInit = false;
    return true;
}

function messageConfig() {
    return {
        welcome: "Welcome to @subject, @user\n",
        bye: "Goodbye @user 👋",
        spromote: "@user sekarang admin!",
        sdemote: "@user sekarang bukan admin!",
        sDesc: "Deskripsi telah diubah ke \n@desc",
        sSubject: "Judul grup telah diubah ke \n@subject",
        sIcon: "Icon grup telah diubah!",
        sRevoke: "Link group telah diubah ke \n@revoke"
    };
}

async function connectionUpdate(opts, update) {
    const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;
    if (isNewLogin) console.log(chalk.green('Login Berhasil!'));
    if (connection == 'connecting') console.log(chalk.redBright('Mengaktifkan Bot, Mohon tunggu sebentar...'));
    if (connection == 'open') console.log(chalk.green('Tersambung'));
    if (isOnline == true) console.log(chalk.green('Status Aktif'));
    if (isOnline == false) console.log(chalk.red('Status Mati'));
    if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'));
    if (connection == "close") {
        console.log(chalk.red('koneksi terputus & mencoba menyambung ulang...'));
        const status = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

        if (status !== DisconnectReason.loggedOut && status !== DisconnectReason.blockedNumber) {
            console.log({
                status,
                message: lastDisconnect.error?.output?.payload?.message ?? lastDisconnect.error?.output?.payload?.statusMessage ?? "",
                disconnectReason: DisconnectReason[status]
            });
            console.log(chalk.red('Connecting...'));
            console.log(await reload(this, true, opts).catch(console.error));
        }
    }

    if (global.db?.data == null) await global.loadDatabase();
}

async function importFile(module) {
    module = require(module)
    return module;
}

const opts = {
    authState: authStatePromise,
    isChild: false,
    usePairingCode: false
};

module.exports = {
    conn,
    opts,
    conns,
    logger,
    authFolder,
    start,
    reload,
    importFile
};
