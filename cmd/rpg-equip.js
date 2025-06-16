module.exports = {
  command: ["equip"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    const item = args[0]
    if (!item) return m.reply("Usage: .equip <item>")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    if (!user.inventory?.[item]) return m.reply("You don't have that item.")

    await global.database.collection("users").updateOne({ uid }, {
      $set: { equipped: item }
    })

    m.reply(`You equipped ${item}.`)
  }
}
