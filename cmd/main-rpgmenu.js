module.exports = {
  command: ["rpgmenu", "rpghelp"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const coin = user.coin || 0
    const exp = user.exp || 0
    const level = user.level || 1
    const cls = user.class || "none"
    const inv = user.inventory || {}

    const inventory = Object.entries(inv).length
      ? Object.entries(inv).map(([k, v]) => `- ${k}: ${v}`).join("\n")
      : "- Empty"

    const menu = `
=== RPG STATUS ===
Level : ${level}
Class : ${cls}
Coin  : ${coin}
EXP   : ${exp}

Inventory:
${inventory}

=== RPG COMMANDS ===
.duel @user      → Duel with another player
.dungeon         → Explore a dungeon
.war             → Fight in a war
.shop            → Buy or sell items
.class <name>    → Select a class/job
.leaderboard     → View top coin users
.leaderboard exp → View top EXP users
`.trim()

    m.reply(menu)
  }
}
