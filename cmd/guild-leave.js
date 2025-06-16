module.exports = {
  command: ["guildleave"],
  tags: ["Guild"],
  func: async (m) => {
    const uid = m.sender
    const user = await global.database.collection("users").findOne({ uid })
    if (!user?.guild) return m.reply("❌ You are not in a guild.")

    const guild = await global.database.collection("guilds").findOne({ name: user.guild })
    if (!guild) return m.reply("❌ Guild not found.")

    if (guild.leader === uid) return m.reply("❌ The leader can't leave. Use .guilddisband to disband the guild.")

    await global.database.collection("guilds").updateOne({ name: user.guild }, {
      $pull: { members: uid }
    })

    await global.database.collection("users").updateOne({ uid }, {
      $unset: { guild: "", guildRank: "" }
    })

    m.reply(`✅ You have left '${user.guild}'`)
  }
}
