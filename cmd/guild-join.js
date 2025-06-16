module.exports = {
  command: ["guildjoin"],
  tags: ["Guild"],
  func: async (m, { args }) => {
    const uid = m.sender
    const name = args.join(" ")
    if (!name) return m.reply("❌ Please specify a guild name.")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    if (user.guild) return m.reply("❌ You are already in a guild.")

    const guild = await global.database.collection("guilds").findOne({ name: new RegExp(`^${name}$`, "i") })
    if (!guild) return m.reply("❌ Guild not found.")

    if (guild.members.includes(uid)) return m.reply("❌ You're already in this guild.")

    guild.members.push(uid)
    await global.database.collection("guilds").updateOne({ name: guild.name }, {
      $set: { members: guild.members }
    })
    await global.database.collection("users").updateOne({ uid }, {
      $set: { guild: guild.name, guildRank: "Member" }
    })

    m.reply(`✅ You joined '${guild.name}'`)
  }
}
