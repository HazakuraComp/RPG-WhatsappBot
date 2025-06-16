export default {
  command: ['guildpromote', 'gpromote'],
  tags: ['rpg', 'guild'],
  usage: '.gpromote @user',
  func: async (m) => {
    let target = m.mentionedJid[0]
    if (!target) return m.reply('Tag anggota yang ingin dipromosikan.')

    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu tidak punya guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guild })
    if (guild.leader !== m.sender) return m.reply('Hanya ketua yang bisa mempromosikan.')

    await global.database.collection('guilds').updateOne(
      { name: guild.name },
      { $set: { [`roles.${target}`]: 'officer' } }
    )

    m.reply(`@${target.split('@')[0]} sekarang adalah *Officer* di guild *${guild.name}*.`, { mentions: [target] })
  }
}
