const marketItems = {
  sword: 1000,
  potion: 300,
  armor: 2000,
  herb: 100
}

module.exports = {
  command: ["market", "buy"],
  tags: ["RPG"],
  private: false,
  func: async (m, { command, args }) => {
    const uid = m.sender

    if (command === "market") {
      let list = Object.entries(marketItems)
        .map(([name, price]) => `- ${name}: ${price} coins`)
        .join("\n")
      return m.reply(`🛒 Market Items:\n\n${list}\n\nTo buy: .buy <item> <amount>`)
    }

    if (command === "buy") {
      const item = args[0]?.toLowerCase()
      const qty = Math.max(1, parseInt(args[1]) || 1)
      if (!marketItems[item]) return m.reply("❌ Item not found in the market.")
      const total = marketItems[item] * qty

      const user = await global.database.collection("users").findOne({ uid }) || {}
      if ((user.coin || 0) < total) return m.reply("❌ Not enough coins.")

      await global.database.collection("users").updateOne(
        { uid },
        {
          $inc: {
            coin: -total,
            [`inventory.${item}`]: qty
          }
        },
        { upsert: true }
      )

      return m.reply(`✅ You bought ${qty} ${item}(s) for ${total} coins.`)
    }
  }
}
