module.exports = {
  command: ["badge"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const badges = []
    if ((user.exp || 0) > 1000) badges.push("EXP Master")
    if ((user.coin || 0) > 10000) badges.push("Rich")

    m.reply(`Badges: ${badges.length ? badges.join(", ") : "None"}`)
  }
}
