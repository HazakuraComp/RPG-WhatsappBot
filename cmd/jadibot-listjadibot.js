const Connection = require("../lib/connection")
module.exports = { 
command: [ "listjadibot" ],
tags: [ "Jadibot", "Main" ],
func: async(m) => {
const user = [...Connection.conns.entries()]
    let users = user.map(_ => _[0])
    if (!users.length) return m.reply('Tidak user yang jadibot!')
let bt = []
let allBot = await database.collection("jadibot").find().toArray()
for(let i in allBot) {
let kks = `${i + 1}. *_${allBot[i].virtualBotId} - Online_*
_Number Bot : *wa.me/${allBot[i].id.split("@")[0]}*_
_Number Owner : *wa.me/${allBot[i].owner.split("@")[0]}*_`
bt.push(kks)
}
let teks = `*List Jadibot*

Total bot : ${users.length}

${bt.join("\n\n")}
`
await m.reply(teks)
 }
}