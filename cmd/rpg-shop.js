module.exports = {
  command: ["shop"],
  tags: ["RPG"],
  private: false,
  func: async (m, { text }) => {
    const uid = m.sender
    const items = {
      potion: 500,
      sword: 2000,
      armor: 3000,
      bow: 1500
    }

    const args = text.trim().split(" ")
    const action = args[0]?.toLowerCase()
    const item = args[1]?.toLowerCase()
    const price = items[item]

    if (!action) {
      let list = Object.entries(items).map(([name, price]) => `- ${name} : ${price} coins`).join("\n")
      return m.reply(`Welcome to the RPG Shop.\n\nType: .shop buy potion\n\nAvailable:\n${list}`)
    }

    if (!["buy", "sell"].includes(action)) return m.reply("Only 'buy' or 'sell' are valid actions.")
    if (!price) return m.reply("Invalid item.")

    const user = await global.database.collection('users').findOne({ uid }) || {}

    if (action === "buy") {
      if ((user.coin || 0) < price) return m.reply("Not enough coins.")
      await global.database.collection('users').updateOne(
        { uid },
        {
          $inc: { coin: -price, [`inventory.${item}`]: 1 }
        },
        { upsert: true }
      )
      return m.reply(`Successfully bought 1 ${item}.`)
    }

    if (action === "sell") {
      if ((user.inventory?.[item] || 0) <= 0) return m.reply(`You don't have ${item} to sell.`)
      await global.database.collection('users').updateOne(
        { uid },
        {
          $inc: { coin: Math.floor(price / 2), [`inventory.${item}`]: -1 }
        },
        { upsert: true }
      )
      return m.reply(`Sold 1 ${item} for ${Math.floor(price / 2)} coins.`)
    }
  }
}
