/*
Base RPG WhatsApp Bot by Renata
~ Created on 5/31/2025
~ Contact me wa.me/6287756593163
~ MongoDB Database (I can help you create the uri, just chat via the whatsapp number above)
~ Free f
*/

global.creator = ["6287756593163"]
global.mongodb_uri = "CAN I HELP YOU CREATE A URI, JUST CHAT TO THE WHATSAPP NUMBER ABOVE"
global.pairing_code = "ARDACRTR"

let file = require.resolve(__filename)
const fs = require("fs")
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
