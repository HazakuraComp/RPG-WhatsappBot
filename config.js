/*
Base bot Case × Plugins by ArdSvt
~ Created on 5/31/2025
~ Contact me wa.me/6283861772386
~ Database MongoDB ( untuk uri nya bisa saya bantu buatkan, chat saja melalui nomor whatsapp diatas )
~ Free fitur jadibot QR/Pairing Code
~ Bisa Custom Pairing Code
*/

global.creator = [ "6283861772386"]

let file = require.resolve(__filename)
const fs = require("fs")
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})