module.exports = {
  command: ["leaderboard", "top"],
  tags: ["RPG"],
  private: false,
  func: async (m, { text }) => {
    const sortField = text === "exp" ? "exp" : "coin"

    const top = await global.database.collection("users")
      .find({ [sortField]: { $gt: 0 } })
      .sort({ [sortField]: -1 })
      .limit(10)
      .toArray()

    if (top.length === 0) return m.reply("No data yet.")

    const list = top.map((user, i) => {
      const id = user.uid.split("@")[0]
      return `${i + 1}. ${id}\n   ${sortField}: ${user[sortField]}`
    }).join("\n\n")

    m.reply(`🏅 Top ${sortField.toUpperCase()} Leaderboard:\n\n${list}`)
  }
}
