module.exports = {
  command: ["war"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection('users').findOne({ uid })

    if ((user?.health || 0) < 30) return m.reply("You need 30 health to go to war.")

    const reward = Math.floor(Math.random() * 2000 + 1500)
    const lostHP = Math.floor(Math.random() * 40 + 20)

    await global.database.collection('users').updateOne(
      { uid },
      {
        $inc: {
          coin: reward,
          exp: 120,
          health: -lostHP
        },
        $set: { lastWar: now }
      },
      { upsert: true }
    )

    m.reply(`You joined the war! +${reward} coins, 120 EXP, lost ${lostHP} health.`)
  }
}
