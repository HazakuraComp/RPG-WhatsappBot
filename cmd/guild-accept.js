export default {
  command: ['gaccept'],
  tags: ['rpg', 'guild'],
  func: async (m) => {
    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guildInvite) return m.reply('Kamu tidak memiliki undangan guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guildInvite })
    if (!guild) return m.reply('Guild tidak ditemukan.')

    await global.database.collection('guilds').updateOne(
      { name: user.guildInvite },
      { $push: { members: m.sender } }
    )
    await global.database.collection('users').updateOne(
      { uid: m.sender },
      { $set: { guild: user.guildInvite }, $unset: { guildInvite: "" } }
    )

    m.reply(`Kamu telah bergabung ke guild *${user.guildInvite}*.`)
  }
}
