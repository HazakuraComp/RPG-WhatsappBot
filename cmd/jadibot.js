const { Jadibot } = require("../lib/jadibot");
const Connection = require("../lib/connection");
if (!global.jdbt) global.jdbt = []
module.exports = {
command: [ "jadibot" ],
tags: [ "Jadibot", "Main" ],
private: true,
func: async (m, { ard, text, prefix, command }) => {
    const users = [...Connection.conns.entries()].map(([k, v]) => v.user);
    if (users.length > 4) return m.reply('Maaf, Max pemakaian jadibot telah tercapai!')
    let who = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.sender;
    if (!who || who === "@s.whatsapp.net") return m.reply("Nomor yang kamu masukan tidak valid!")
    if (Connection.conns.has(who.split("@")[0])) return m.reply("Kamu sudah menjadi bot!");
    let kd = await m.reply(`*Untuk melanjutkan pilih salah satu dari 2 opsi dibawah*

1. Pairing Code
2. Scan QR

encodeData:${btoa(JSON.stringify({number:who.split("@")[0]}))}`).then(_ => _.key.id)
    global.jdbt.push(kd)
  },
before: async(m, { ard }) => {
if (m.quoted && jdbt.includes(m.quoted.id)) {
let data = JSON.parse(atob(m.quoted.text.split("encodeData:")[1]))
if (m.text.split(" ")[0] == "1") {
const usePairingCode = true
let accs = await Jadibot(data.number + "@s.whatsapp.net", ard, m, usePairingCode);
}
if (m.text.split(" ")[0] == "2") {
const usePairingCode = false
let accs = await Jadibot(data.number + "@s.whatsapp.net", ard, m, usePairingCode);
   }
  }
 }
}