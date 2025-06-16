module.exports = {
  command: ["bossfight"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const last = user.lastBoss || 0
    const cooldown = 1000 * 60 * 60 // 1 jam
    if (now - last < cooldown)
      return m.reply(`You must wait ${Math.ceil((cooldown - (now - last)) / 60000)} minutes to fight a boss again.`)

    const bosses = [
      { name: "Demon King", hp: 3000, reward: 3000, exp: 500 },
      { name: "Titan", hp: 2000, reward: 2000, exp: 350 },
      { name: "Skeleton Lord", hp: 1500, reward: 1500, exp: 250 },
    ]

    const boss = bosses[Math.floor(Math.random() * bosses.length)]
    const yourPower = Math.floor((user.level || 1) * 200 + Math.random() * 100)

    let result = "lost"
    if (yourPower >= boss.hp) result = "won"

    if (result === "won") {
      await global.database.collection("users").updateOne(
        { uid },
        {
          $inc: { coin: boss.reward, exp: boss.exp },
          $set: { lastBoss: now }
        },
        { upsert: true }
      )
      return m.reply(`You defeated the ${boss.name}!\n+${boss.reward} coins\n+${boss.exp} EXP`)
    } else {
      await global.database.collection("users").updateOne(
        { uid },
        { $set: { lastBoss: now } },
        { upsert: true }
      )
      return m.reply(`You fought bravely against ${boss.name}, but lost.\nTry again later.`)
    }
  }
}
