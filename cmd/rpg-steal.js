module.exports = {
  command: ["steal"],
  tags: ["RPG"],
  func: async (m) => {
    const uid = m.sender
    const target = m.quoted?.sender
    if (!target || uid === target) return m.reply("❌ Reply to someone to steal.")

    const victim = await global.database.collection("users").findOne({ uid: target }) || {}
    const amount = Math.min(Math.floor(Math.random() * 1000), victim.coin || 0)

    if (amount <= 0) return m.reply("❌ Target has no coins to steal.")

    await global.database.collection("users").updateOne({ uid: target }, { $inc: { coin: -amount } })
    await global.database.collection("users").updateOne({ uid }, { $inc: { coin: amount } })

    m.reply(`🕵️‍♂️ You stole ${amount} coins from @${target.split("@")[0]}`, null, {
      mentions: [target]
    })
  }
}
