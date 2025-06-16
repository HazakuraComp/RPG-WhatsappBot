module.exports = {
  command: ["bank"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const amount = parseInt(args[1])
    if (args[0] === "save" && amount > 0) {
      if (user.coin < amount) return m.reply("Insufficient coin.")
      await global.database.collection("users").updateOne({ uid }, {
        $inc: { coin: -amount, bank: amount }
      })
      return m.reply(`Saved ${amount} coins to bank.`)
    }

    if (args[0] === "take" && amount > 0) {
      if ((user.bank || 0) < amount) return m.reply("Insufficient bank balance.")
      await global.database.collection("users").updateOne({ uid }, {
        $inc: { coin: amount, bank: -amount }
      })
      return m.reply(`Withdrew ${amount} coins from bank.`)
    }

    m.reply(`Bank: ${user.bank || 0} coins\nUse: .bank save <amount> or .bank take <amount>`)
  }
}
