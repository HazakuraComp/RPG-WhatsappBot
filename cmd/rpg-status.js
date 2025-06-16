module.exports = {
  command: ["status"],
  tags: ["RPG"],
  func: async (m) => {
    const uid = m.sender
    const u = await global.database.collection("users").findOne({ uid }) || {}

    m.reply(`📊 Status:
• Level: ${u.level || 1}
• EXP: ${u.exp || 0}
• Rank: ${u.rank || 0}
• HP: ${u.hp || 100}
• Coins: ${u.coin || 0}
• Class: ${u.class || "None"}
• Weapon Lv: ${u.weaponLevel || 1}`)
  }
}
