module.exports = {
  command: ["trade"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    const target = m.quoted?.sender
    if (!target) return m.reply("Reply to someone to trade with.")

    const [item, amountStr] = args
    const amount = parseInt(amountStr)
    if (!item || isNaN(amount) || amount <= 0) return m.reply("Usage: .trade <item> <amount> (reply to user)")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    if (!user.inventory?.[item] || user.inventory[item] < amount)
      return m.reply("You don’t have enough items.")

    await global.database.collection("users").updateOne({ uid }, {
      $inc: { [`inventory.${item}`]: -amount }
    })

    await global.database.collection("users").updateOne({ uid: target }, {
      $inc: { [`inventory.${item}`]: amount }
    }, { upsert: true })

    m.reply(`You sent ${amount} ${item} to @${target.split('@')[0]}`, null, { mentions: [target] })
  }
}
