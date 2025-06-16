export default {
  command: ['guildinvite', 'ginvite'],
  tags: ['rpg', 'guild'],
  usage: '.guildinvite @user',
  func: async (m, { text, participants }) => {
    let target = m.mentionedJid[0]
    if (!target) return m.reply('Tag orang yang ingin diundang.')

    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu belum punya guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guild })
    if (!guild || guild.leader !== m.sender) return m.reply('Hanya ketua guild yang bisa mengundang.')

    await global.database.collection('users').updateOne(
      { uid: target },
      { $set: { guildInvite: guild.name } }
    )

    m.reply(`Undangan telah dikirim ke anggota.`)
    this.sendMessage(target, {
      text: `Kamu telah diundang ke guild *${guild.name}*. Balas dengan *.gaccept* untuk bergabung.`,
    }, { quoted: m })
  }
}
