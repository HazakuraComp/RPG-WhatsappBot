module.exports = {
  command: ["craft"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    const item = args[0]?.toLowerCase()
    if (!item) return m.reply("Usage: .craft <item_name>")

    const recipes = {
      sword: { wood: 3, iron: 2 },
      potion: { herb: 5 },
    }

    if (!recipes[item]) return m.reply("Unknown recipe.")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    const inv = user.inventory || {}

    for (let mat in recipes[item]) {
      if (!inv[mat] || inv[mat] < recipes[item][mat])
        return m.reply(`Not enough ${mat} to craft ${item}.`)
    }

    for (let mat in recipes[item]) inv[mat] -= recipes[item][mat]
    inv[item] = (inv[item] || 0) + 1

    await global.database.collection("users").updateOne({ uid }, {
      $set: { inventory: inv }
    }, { upsert: true })

    m.reply(`You crafted 1 ${item}.`)
  }
}
