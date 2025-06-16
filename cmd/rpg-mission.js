module.exports = {
  command: ["mission"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const last = user.lastMission || 0
    const cooldown = 1000 * 60 * 60 * 12 // 12 jam
    if (now - last < cooldown)
      return m.reply(`You can only do 1 mission every 12 hours.\nWait ${Math.ceil((cooldown - (now - last)) / 60000)} minutes.`)

    const missions = [
      { desc: "Collect herbs in the forest", coin: 500, exp: 100 },
      { desc: "Help a villager fix their fence", coin: 800, exp: 120 },
      { desc: "Escort a merchant safely", coin: 1200, exp: 200 },
      { desc: "Deliver secret message", coin: 1000, exp: 180 }
    ]

    const mission = missions[Math.floor(Math.random() * missions.length)]

    await global.database.collection("users").updateOne(
      { uid },
      {
        $inc: { coin: mission.coin, exp: mission.exp },
        $set: { lastMission: now }
      },
      { upsert: true }
    )

    m.reply(`Mission Complete:\n${mission.desc}\n\n+${mission.coin} coins\n+${mission.exp} EXP`)
  }
}
