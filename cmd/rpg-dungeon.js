module.exports = {
  command: ["dungeon"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection('users').findOne({ uid })

    if ((user?.energy || 0) < 10) return m.reply("You need 10 energy to enter the dungeon.")

    const success = Math.random() < 0.7
    const reward = Math.floor(Math.random() * 1500 + 1000)

    await global.database.collection('users').updateOne(
      { uid },
      {
        $inc: {
          coin: success ? reward : -500,
          exp: success ? 100 : -50,
          energy: -10
        },
        $set: { lastDungeon: now }
      },
      { upsert: true }
    )

    m.reply(success
      ? `You cleared the dungeon! +${reward} coins and 100 EXP.`
      : `You failed the dungeon. Lost -500 coins and 50 EXP.`)
  }
}
