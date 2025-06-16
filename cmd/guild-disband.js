module.exports = {
  command: ["guilddisband"],
  tags: ["Guild"],
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid })
    if (!user?.guild) return m.reply("❌ You're not in a guild.")

    const guild = await global.database.collection("guilds").findOne({ name: user.guild })
    if (!guild || guild.leader !== uid) return m.reply("❌ Only the leader can disband the guild.")

    for (const member of guild.members) {
      await global.database.collection("users").updateOne({ uid: member }, {
        $unset: { guild: "", guildRank: "" }
      })
    }

    await global.database.collection("guilds").deleteOne({ name: guild.name })
    m.reply(`✅ Guild '${guild.name}' has been disbanded.`)
  }
}
