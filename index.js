/*Base bot Case × Plugins by ArdSvt
~ Created on 5/31/2025
~ Contact me wa.me/6283861772386
~ Database MongoDB ( untuk uri nya bisa saya bantu buatkan, chat saja melalui nomor whatsapp diatas )
~ Free fitur jadibot QR/Pairing Code
~ Bisa Custom Pairing Code
*/
require("./config")
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, jidDecode, proto, getContentType, downloadContentFromMessage, fetchLatestWaWebVersion } = require("@ardsvt/baileys")
const fs = require("fs");
const pino = require("pino");
const process = require('process');
const path = require('path')
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const fetch = require("node-fetch");
const FileType = require('file-type');
const { Boom } = require("@hapi/boom");
const PhoneNumber = require("awesome-phonenumber");
const readline = require("readline");
const { smsg, color, getBuffer } = require("./lib/myfunc");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { toAudio, toPTT, toVideo } = require('./lib/converter');
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const yargs = require('yargs/yargs');
const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
if (!global.mongodb_uri.startsWith("mongodb+srv://")) return console.log("MASUKAN URI MONGODB KAMU DI FILE config.js")
const { MongoClient, ServerApiVersion } = require("mongodb")
const client = new MongoClient(global.mongodb_uri, {
serverApi: {
version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
}
});
global.database = client.db("database")
const Connection = require("./lib/connection")
const { startBot, restoreSession } = require("./lib/jadibot")
function createTmpFolder() {
const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);
if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
console.log(`Folder '${folderName}' berhasil dibuat.`);
} else {
console.log(`Folder '${folderName}' sudah ada.`);
}
}
createTmpFolder();
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};
async function start() {
let message
async function runBot() {
const { state, saveCreds } = await useMultiFileAuthState("sessions/parent")
const ard = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
msgRetryCounterCache,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
browser: ["Ubuntu", "Chrome", "20.0.04"],
});
if(usePairingCode && !ard.authState.creds.registered) {
const phoneNumber = await question('Masukan nomor yang ingin dijadikan bot :\n');
const code = await ard.requestPairingCode(phoneNumber.trim(), global.pairing_code)
console.log(`Pairing code untuk ${phoneNumber} : ${code}`)
}
store.bind(ard.ev);
global.mess = []
ard.ev.on("messages.upsert", async (chatUpdate) => {
 try {
const msg = chatUpdate.messages[0]
if (!msg.message) return;
msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
if (!ard.public && !msg.key.fromMe && chatUpdate.type === 'notify') return;
if (msg.key.id.startsWith('ARDSVT') && msg.key.id.length === 16) return;
const m = smsg(ard, msg, store)
message = m
if (mess.includes(m.key.id)) return;
require("./client")(ard, m, chatUpdate, store)
mess.push(m.key.id)
} catch (err) {
console.log(err)
}
});
ard.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
} else return jid;
};
ard.ev.on("contacts.update", (update) => {
for (let contact of update) {
let id = ard.decodeJid(contact.id);
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
}
});
ard.getName = (jid, withoutContact = false) => {
id = ard.decodeJid(jid);
withoutContact = ard.withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us"))
return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = ard.groupMetadata(id) || {};
resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
});
else
v =
id === "0@s.whatsapp.net"
? {
id,
name: "WhatsApp",
}
: id === ard.decodeJid(ard.user.id)
? ard.user
: store.contacts[id] || {};
return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};
ard.public = true;
ard.serializeM = (m) => smsg(ard, m, store)
ard.ev.on('connection.update', async (update) => {
const {
connection,
lastDisconnect
} = update
try{
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode
if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Verifikasi Again`); ard.logout(); }
else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); runBot(); }
else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); runBot(); }
else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); ard.logout(); }
else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Verifikasi Again And Run.`); ard.logout(); }
else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); runBot(); }
else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); runBot(); }
else ard.end(`Unknown DisconnectReason: ${reason}|${connection}`)
} if (update.connection == "open" || update.receivedPendingNotifications == "true") {
console.log(`Successfully connected to : ` + JSON.stringify(ard.user, null, 2))
await ard.sendText("6283861772386@s.whatsapp.net", `Successfully Connected To Bot!, owner : ${global.creator.join(", ")}`, null)
}} catch (err) {
console.log('Error Di Connection.update '+err)
}
})
ard.ev.on("creds.update", saveCreds);
ard.getFile = async (PATH, returnAsFilename) => {
let res, filename
const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
const type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data,
deleteFile() {
return filename && fs.promises.unlink(filename)
}
}
}
ard.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 
ard.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await ard.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let opt = { filename }
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '', mimetype = type.mime, convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime)) (
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

let message = {
...options,
caption,
ptt,
[mtype]: { url: pathFile },
mimetype
}
let m
try {
m = await ard.sendMessage(jid, message, { ...opt, ...options })
} catch (e) {
console.error(e)
m = null
} finally {
if (!m) m = await ard.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
return m
 }
}
ard.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await ard.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
ard.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}
ard.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await(const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder
    await fs.writeFileSync(savePath, buffer);
    return savePath;
};
ard.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await ard.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
ard.sendText = (jid, text, quoted = '', options) => ard.sendMessage(jid, { text: text, ...options }, { quoted })
global.mainbot = ard
restoreSession(ard)
return ard;
}
let bot = await [...Connection.conns.entries()].map(_ => _[1].user.jid)
let connection = await runBot()
for (let id of bot) {
startBot(id, connection, message, false)
 }
}
start();
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
