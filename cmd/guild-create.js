module.exports = {
  command: ["guildcreate"],
  tags: ["Guild"],
  func: async (m, { args }) => {
    const uid = m.sender
    const name = args.join(" ")
    if (!name) return m.reply("❌ Please provide a guild name.")

    const user = await global.database.collection("users").findOne({ uid }) || {}
    if (user.guild) return m.reply("❌ You're already in a guild.")

    const isExist = await global.database.collection("guilds").findOne({ name: new RegExp(`^${name}$`, "i") })
    if (isExist) return m.reply("❌ That guild name is already taken.")

    await global.database.collection("guilds").insertOne({
      name,
      leader: uid,
      members: [uid],
      level: 1,
      points: 0,
      description: "",
      createdAt: Date.now()
    })

    await global.database.collection("users").updateOne({ uid }, {
      $set: { guild: name, guildRank: "Leader" }
    })

    m.reply(`✅ Guild '${name}' created successfully!`)
  }
}
