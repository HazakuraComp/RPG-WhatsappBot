module.exports = {
  command: ["quest"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}
    if (user.questDone) return m.reply("You already completed this quest.")

    const complete = Math.random() > 0.4
    if (!complete) return m.reply("You failed. Try again later.")

    await global.database.collection("users").updateOne({ uid }, {
      $inc: { coin: 2000, exp: 300 },
      $set: { questDone: true }
    })

    m.reply("Quest Complete!\n+2000 coins\n+300 EXP")
  }
}
