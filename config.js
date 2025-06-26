/*
Base RPG WhatsApp Bot by Renata
~ Created on 5/31/2025
~ Contact me wa.me/6287756593163
~ MongoDB Database (I can help you create the uri, just chat via the whatsapp number above)
~ Free f
*/

global.creator = ["79861620303"]
global.mongodb_uri = "mongodb+srv://ren:abcd1234@haz.go9wyqb.mongodb.net/?retryWrites=true&w=majority&appName=Haz"
global.pairing_code = "ARDACRTR"

let file = require.resolve(__filename)
const fs = require("fs")
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
