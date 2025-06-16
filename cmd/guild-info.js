module.exports = {
  command: ["guildinfo"],
  tags: ["Guild"],
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid })
    if (!user?.guild) return m.reply("❌ You are not in a guild.")

    const guild = await global.database.collection("guilds").findOne({ name: user.guild })
    if (!guild) return m.reply("❌ Guild not found.")

    const members = guild.members.length
    m.reply(`🏰 *Guild: ${guild.name}*
Leader: @${guild.leader.split("@")[0]}
Members: ${members}
Level: ${guild.level}
Points: ${guild.points}
Desc: ${guild.description || "-"}
`, null, {
      mentions: [guild.leader]
    })
  }
}
