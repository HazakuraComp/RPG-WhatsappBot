module.exports = {
  command: ["gacha"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const items = ["potion", "rare sword", "herb", "gold armor"]
    const item = items[Math.floor(Math.random() * items.length)]

    await global.database.collection("users").updateOne({ uid }, {
      $inc: { [`inventory.${item}`]: 1 },
      $inc: { coin: -500 }
    })

    m.reply(`You used 500 coins and got a ${item}!`)
  }
}
