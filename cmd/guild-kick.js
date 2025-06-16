export default {
  command: ['guildkick', 'gkick'],
  tags: ['rpg', 'guild'],
  usage: '.gkick @user',
  func: async (m) => {
    let target = m.mentionedJid[0]
    if (!target) return m.reply('Tag anggota yang ingin dikeluarkan.')

    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu tidak punya guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guild })
    if (guild.leader !== m.sender && guild.roles?.[m.sender] !== 'officer')
      return m.reply('Hanya ketua atau officer yang bisa mengeluarkan anggota.')

    if (!guild.members.includes(target)) return m.reply('Orang tersebut bukan anggota guild.')

    await global.database.collection('guilds').updateOne(
      { name: user.guild },
      {
        $pull: { members: target },
        $unset: { [`roles.${target}`]: "", [`contribution.${target}`]: "" }
      }
    )
    await global.database.collection('users').updateOne(
      { uid: target },
      { $unset: { guild: "", guildInvite: "" } }
    )

    m.reply(`@${target.split('@')[0]} telah dikeluarkan dari guild *${guild.name}*.`, { mentions: [target] })
  }
}
