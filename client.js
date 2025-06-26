require("./config")
const { exec } = require("child_process")
const fs = require('fs')
const util = require('util')
const path = require("path")
const moment = require("moment-timezone")
const Connection = require("./lib/connection")
const { default: fetch } = require('node-fetch')
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = ard = async (ard, m, chatUpdate, store) => {
  if (!m) return;
  if (m.isBaileys) return;

  try {
    const body = m?.mtype === 'conversation' ? m?.message?.conversation :
      m?.mtype === 'imageMessage' ? m?.message?.imageMessage?.caption :
      m?.mtype === 'videoMessage' ? m?.message?.videoMessage?.caption :
      m?.mtype === 'extendedTextMessage' ? m?.message?.extendedTextMessage?.text :
      m?.mtype === 'buttonsResponseMessage' ? m?.message?.buttonsResponseMessage?.selectedButtonId :
      m?.mtype === 'listResponseMessage' ? m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
      m?.mtype === 'templateButtonReplyMessage' ? m?.message?.templateButtonReplyMessage?.selectedId :
      m?.mtype === 'messageContextInfo' ?
        (m?.message?.buttonsResponseMessage?.selectedButtonId ||
          m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
          m?.text) : '';

    const budy = (typeof m?.text === 'string') ? m?.text : '';
    const prefix = '.';
    const isCmd = body?.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body?.trim().split(/ +/).slice(1);
    const text = q = args?.join(" ");
    const pushname = m?.pushName || "No Name";
    const botNumber = await ard.decodeJid(ard.user.id);
    const isCreator = global.creator.includes(m.sender.split("@")[0]);
    const itsMe = m?.sender === botNumber;
    const quoted = m.quoted || m;
    const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
    const qmsg = (quoted?.msg || quoted);
    const isMedia = /image|video|sticker|audio/.test(mime);

    const users = global.database.collection("users")
    let me = await users.findOne({ jid: m.sender })

    // 🛡️ Jika belum terverifikasi dan bukan command .reg, kirim pesan
    if (!me && command !== "reg") {
      return m.reply(`❌ Kamu belum terverifikasi.\nSilakan registrasi terlebih dahulu dengan _*".reg"*_.`)
    }

    const pluginsLoader = async (directory) => {
      const plugins = []
      const files = fs.readdirSync(directory)
      for (let file of files) {
        const filePath = path.join(directory, file)
        if (filePath.endsWith(".js")) {
          try {
            delete require.cache[require.resolve(filePath)]
            plugins.push(require(filePath))
          } catch (error) {
            console.log(`${filePath}:`, error)
          }
        }
      }
      return plugins
    }

    const plugins = await pluginsLoader(path.resolve(__dirname, "./cmd"))
    global.plugins = plugins
    const plug = { ard, prefix, command, text, isGroup: m.isGroup, args, isCmd, isCreator, quoted, mime }

    for (let plugin of plugins) {
      if (plugin.before && typeof plugin.before === "function") await plugin.before(m, plug)
      if (plugin.command.includes(command.toLowerCase())) {
        if (plugin.creator && !isCreator) return m.reply(`Perintah ini hanya untuk Creator`);
        if (plugin.group && !plug.isGroup) return m.reply(`Fitur ini hanya di Group`);
        if (plugin.private && plug.isGroup) return m.reply(`Fitur ini hanya di Private Chat`);
        if (typeof plugin.func !== "function") return;
        await plugin.func(m, plug)
      }
    }

    // Command khusus
    switch (command) {
      case "eval":
        if (!isCreator) return;
        if (!text) return m.reply("undefined");
        try {
          let result = await eval(`${text}`);
          if (typeof result !== "string") result = util.inspect(result);
          m.reply(result);
        } catch (error) {
          m.reply(String(error));
        }
        break

      case "exec":
        if (!isCreator) return;
        exec(text, (err, stdout) => {
          if (err) return m.reply("```Error :```\n\n" + err)
          if (stdout) return m.reply("```Output :```\n\n" + stdout)
        })
        break
    }

  } catch (err) {
    for (let nomer of global.creator) {
      await mainbot.sendText(nomer, util.format(err), m)
    }
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
})
