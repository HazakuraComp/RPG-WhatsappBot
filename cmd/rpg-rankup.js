module.exports = {
  command: ["rankup"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}
    const level = user.level || 1
    const exp = user.exp || 0

    const needed = (level + 1) * 1000

    if (exp < needed) {
      return m.reply(`You need ${needed - exp} more EXP to reach level ${level + 1}.`)
    }

    await global.database.collection("users").updateOne(
      { uid },
      {
        $inc: { level: 1 },
        $inc: { exp: -needed }
      },
      { upsert: true }
    )

    m.reply(`Congratulations! You ranked up to level ${level + 1}.`)
  }
}
