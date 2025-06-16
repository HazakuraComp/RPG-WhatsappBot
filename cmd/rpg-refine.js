module.exports = {
  command: ["refine"],
  tags: ["RPG"],
  func: async (m, { args }) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const currentLv = user.weaponLevel || 1
    const cost = currentLv * 1000
    const success = Math.random() < 0.6

    if ((user.coin || 0) < cost) return m.reply(`❌ Not enough coins (Need ${cost})`)
    
    let update = { coin: -cost }
    if (success) update.weaponLevel = currentLv + 1

    await global.database.collection("users").updateOne({ uid }, { $inc: update })

    m.reply(success
      ? `🛠 Success! Weapon upgraded to level ${currentLv + 1}`
      : `❌ Upgrade failed. ${cost} coins lost`)
  }
}
