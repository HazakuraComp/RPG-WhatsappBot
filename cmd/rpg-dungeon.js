module.exports = {
  command: ["duel"],
  tags: ["RPG"],
  private: false,
  func: async (m, { text, prefix }) => {
    const uid = m.sender
    const now = Date.now()

    if (!text) return m.reply(`Usage: ${prefix}duel @user`)
    const opponent = m.mentionedJid[0]
    if (!opponent) return m.reply("You must tag someone to duel with.")
    if (opponent === uid) return m.reply("You can't duel yourself.")

    const [user, opp] = await Promise.all([
      global.database.collection('users').findOne({ uid }),
      global.database.collection('users').findOne({ uid: opponent })
    ])

    const userPower = (user?.level || 1) * (user?.exp || 1)
    const oppPower = (opp?.level || 1) * (opp?.exp || 1)
    const winner = Math.random() * userPower > Math.random() * oppPower
    const reward = Math.floor(Math.random() * 1000 + 500)

    if (winner) {
      await global.database.collection('users').updateOne(
        { uid },
        { $inc: { coin: reward, exp: 50 } },
        { upsert: true }
      )
      return m.reply(`You won the duel and earned ${reward} coins + 50 EXP.`)
    } else {
      await global.database.collection('users').updateOne(
        { uid },
        { $inc: { coin: -reward, exp: -20 } },
        { upsert: true }
      )
      return m.reply(`You lost the duel and lost ${reward} coins - 20 EXP.`)
    }
  }
}
