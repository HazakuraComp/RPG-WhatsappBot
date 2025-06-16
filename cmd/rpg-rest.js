module.exports = {
  command: ["rest"],
  tags: ["RPG"],
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection("users").findOne({ uid }) || {}

    if ((user.lastRest || 0) + 600000 > now)
      return m.reply("❌ You must wait 10 minutes to rest again.")

    const healed = 40 + Math.floor(Math.random() * 30)

    await global.database.collection("users").updateOne({ uid }, {
      $inc: { hp: healed },
      $set: { lastRest: now }
    })

    m.reply(`💤 You rested and recovered ${healed} HP.`)
  }
}
