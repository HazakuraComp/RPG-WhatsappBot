module.exports = {
  command: ["alchemy"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    if (!args[0]) return m.reply("Usage: .alchemy potion")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    if ((user.inventory?.herb || 0) < 3) return m.reply("❌ Not enough herbs.")

    await global.database.collection("users").updateOne({ uid }, {
      $inc: {
        "inventory.herb": -3,
        "inventory.potion": 1
      }
    })

    m.reply("✅ You created 1 potion using 3 herbs.")
  }
}
