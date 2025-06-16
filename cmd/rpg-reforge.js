module.exports = {
  command: ["forge"],
  tags: ["RPG"],
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}

    if ((user.inventory?.iron || 0) < 5)
      return m.reply("❌ Not enough iron (Need 5)")

    await global.database.collection("users").updateOne({ uid }, {
      $inc: {
        "inventory.iron": -5,
        "inventory.sword": 1
      }
    })

    m.reply("🔨 Forged a new sword using 5 iron.")
  }
}
