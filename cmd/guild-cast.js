export default {
  command: ['gcast'],
  tags: ['rpg', 'guild'],
  usage: '.gcast <pesan>',
  func: async (m, { text }) => {
    if (!text) return m.reply('Isi pesan tidak boleh kosong.')

    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu belum tergabung dalam guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guild })
    if (guild.leader !== m.sender && guild.roles?.[m.sender] !== 'officer') return m.reply('Hanya pemimpin atau officer.')

    for (let member of guild.members) {
      if (member !== m.sender) {
        this.sendMessage(member, { text: `📢 *Pesan dari Guild ${guild.name}*\n\n${text}` })
      }
    }

    m.reply('Broadcast terkirim ke seluruh anggota guild.')
  }
}
