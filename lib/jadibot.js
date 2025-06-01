const captionPairing = `Pairing Code Untuk %number : %code`.trim()
const captionQR = `Scan kode QR ini untuk menjadi bot sementara.
Kode QR akan expired dalam %time detik.
QR Count: %count/3`.trim();

const QRCode = require('qrcode');
const { join } = require('path');
const { existsSync, promises: fs } = require('fs');
const {
  delay,
  DisconnectReason,
  areJidsSameUser,
  jidNormalizedUser,
  useMultiFileAuthState
} = require('@ardsvt/baileys');
const connection = require('./connection.js');
const { start, reload, authFolder } = connection;

async function Jadibot(jid, conn = connection.conn, msg = null, usePairingCode = true) {
  jid = jidNormalizedUser(jid);
  if (jid && jid.startsWith('0')) {
    jid = '62' + jid.slice(1) + "@s.whatsapp.net";
  }
  const id = jid && jid.split('@')[0];
  if (!id) throw new Error("Invalid JID");

  const sock = await startBot(jid, conn, msg, usePairingCode);
  if (sock && sock.user?.jid && !areJidsSameUser(sock.user.jid, jid)) {
    console.log("JID mismatch, expected:", jid, "got:", sock.user.jid);
    try {
      await sock.end();
      const oldPath = join(authFolder, id);
      const newPath = join(authFolder, sock.user.jid.split('@')[0]);
      await fs.rename(oldPath, newPath);
      jid = sock.user.jid;
    } catch (e) {
      console.error(e);
      jid = null;
    } finally {
      if (!jid) throw new Error("Failed to start bot");
      connection.conns.delete(id);
      await delay(2000);
      return Jadibot(jid, conn, msg, usePairingCode);
    }
  }
  return sock;
}

async function startBot(jid, conn = connection.conn, msg = null, usePairingCode) {
  let qrMsg, qrRetryCount = 0;
  const id = jid.split('@')[0];
  const authPath = join(authFolder, id);
  const runningBots = [...connection.conns.values()].map(sock => sock.user?.jid);
  if (runningBots.includes(jid)) throw new Error("Bot already running");

  const authState = await useMultiFileAuthState(authPath);
  const config = {
    authState,
    isChild: true,
    usePairingCode
  };
  const sock = await start(conn, config);
  const pairingType = usePairingCode ? "Pairing code" : "QR code";

  const reply = async (...args) => conn?.reply?.(...args) || console.log(...args);

  if (usePairingCode && !sock?.authState?.creds?.registered) {
    await delay(1500);
    try {
      let code = await sock.requestPairingCode(id, global.pairing_code);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      if (msg) {
        await conn.sendText(msg.chat ?? jid, captionPairing.replace(/%code/g, code).replace(/%number/g, id), msg);
      }
    } catch (e) {
    }
  }

  sock.ev.on("connection.update", async update => {
    const {
      qr,
      connection: connState,
      lastDisconnect,
      isNewLogin,
      receivedPendingNotifications
    } = update;

    if (qr && !usePairingCode && msg) {
      if (qrRetryCount >= 3) {
        await reply(msg.chat, "QRCode expired!");
        try { sock.ws.close(); } catch {}
     sock.ev.removeAllListeners();
        qrRetryCount = 0;
        if (existsSync(authPath)) await fs.rm(authPath, { recursive: true }).catch(console.error);
        if (qrMsg?.key) await conn.sendMessage(msg.chat, { delete: qrMsg.key });
      } else {
        if (qrMsg?.key) await conn.sendMessage(msg.chat, { delete: qrMsg.key });
        qrRetryCount++;
        try {
          const qrBuffer = await QRCode.toBuffer(qr, {
            scale: 8,
            margin: 4,
            width: 256,
            color: {
              dark: "#000000ff",
              light: "#ffffffff"
            }
          });
          qrMsg = await conn.sendFile(
            msg.chat,
            qrBuffer,
            "qr.png",
            captionQR.replace(/%time/g, sock?.ws?.config?.qrTimeout / 1000 || 60).replace(/%count/g, qrRetryCount),
            msg
          );
        } catch (err) {
          console.error(err);
        }
      }
    }

    const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    const statusMsg = lastDisconnect?.error?.output?.message || lastDisconnect?.error?.output?.payload?.message;

    if (connState === "close") {
      (sock.logger ?? conn.logger ?? console).error("Connection closed: " + statusMsg + "\nID: " + jidNormalizedUser(sock?.user?.jid ?? sock?.user?.id ?? '') + "\nStatus: " + statusCode + "\nReason: " + DisconnectReason[statusCode]);
    } else if (connState === "open" && !isNewLogin && msg?.chat) {
      await reply(msg.chat, "Berhasil terhubung!", msg);
       let values = "ABCDEFGHIJKLMNOPQRSTUFWXYZ123456789".split("")
    let iid = ""
    for (let i=0;i<10;i++) {
        iid += values[Math.floor(Math.random() * values.length)]

    }
      const mongoJadibot = global.database.collection("jadibot")
await mongoJadibot.insertOne({
id: id + "@s.whatsapp.net",
owner: msg.sender,
virtualBotId: iid,
access: sock.user
    })
    }

    if (statusCode) {
      console.log("Handling status code of disconnect reason:", {
        status: statusCode,
        message: statusMsg
      });
      if (![DisconnectReason.loggedOut, DisconnectReason.connectionReplaced, DisconnectReason.timedOut, DisconnectReason.forbidden].includes(statusCode)) {
        await reload(sock, true, config).catch(console.error);
      } else if (statusCode === DisconnectReason.timedOut) {
        console.log("Connection timed out!");
        if (msg && !sock.authState?.creds?.registered) {
          await reply(msg.chat, pairingType + " telah berakhir!");
          if (existsSync(authPath)) await fs.rm(authPath, { recursive: true }).catch(console.error);
        } else if (sock.authState?.creds?.registered) {
          sock.logger.info("Connection timed out, restarting...");
          await reload(sock, true, config).catch(console.error);
        }
      } else if ([DisconnectReason.loggedOut, DisconnectReason.forbidden].includes(statusCode)) {
        if (existsSync(authPath)) await fs.rm(authPath, { recursive: true }).catch(console.error);
        console.log("Logged out or forbidden, stopping all events...");
        if (connection.conns.has(id)) connection.conns.delete(id);
        const target = msg?.chat || sock?.user?.jid || jid;
        const reason = statusCode === DisconnectReason.loggedOut ? "Logged out" : 'Forbidden';
        await reply(target, "STATE: " + reason + ", bot telah dihentikan!", msg);
      }
    }

    if (isNewLogin) {
      sock.logger.info(id, "Logged in");
      if (msg) {
        let m = await msg.reply("Berhasil terhubung!");
        await delay(1000);
        await sock.reply(msg.chat, "OK!", m);
        let values = "ABCDEFGHIJKLMNOPQRSTUFWXYZ123456789".split("")
    let iid = ""
    for (let i=0;i<10;i++) {
        iid += values[Math.floor(Math.random() * values.length)]

    }
      const mongoJadibot = global.database.collection("jadibot")
await mongoJadibot.insertOne({
id: id + "@s.whatsapp.net",
owner: msg.sender,
virtualBotId: iid,
access: sock.user
    })
      }
    }
  });

  let retries = 0;
  const waitForLogin = () => new Promise(resolve =>
    sock?.user?.jid ? resolve() : (retries++, setTimeout(() => resolve(waitForLogin()), 2000))
  );
  await waitForLogin();

  if (sock?.user?.jid && !runningBots.includes(sock.user.jid)) {
    connection.conns.set(id, sock);
  }
  return sock;
}

async function restoreSession(conn = null) {
  for (const dir of await fs.readdir(authFolder)) {
    await delay(1000);
    if (/parent/.test(dir)) continue;
    if (!existsSync(join(authFolder, dir, "creds.json"))) continue;
    if (connection.conns.has(dir)) continue;
    await Jadibot(dir + "@s.whatsapp.net", conn);
  }
}

module.exports = {
  Jadibot,
  startBot,
  restoreSession
};
