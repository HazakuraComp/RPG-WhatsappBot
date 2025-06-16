module.exports = {
  command: ["pet"],
  tags: ["RPG"],
  private: false,
  func: async (m, { args }) => {
    const uid = m.sender
    const sub = args[0]
    if (sub === "adopt") {
      await global.database.collection("users").updateOne({ uid }, {
        $set: { pet: { name: "Wolf", level: 1, exp: 0 } }
      }, { upsert: true })
      return m.reply("You adopted a Wolf!")
    }

    if (sub === "status") {
      const user = await global.database.collection("users").findOne({ uid })
      return m.reply(`Pet: ${user?.pet?.name || "-"} | Level: ${user?.pet?.level || 0}`)
    }

    m.reply("Usage: .pet adopt / .pet status")
  }
}
