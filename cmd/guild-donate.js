export default {
  command: ['guilddonate', 'gdonate'],
  tags: ['rpg', 'guild'],
  usage: '.gdonate <jumlah>',
  func: async (m, { args }) => {
    let jumlah = parseInt(args[0])
    if (!jumlah || isNaN(jumlah) || jumlah < 1) return m.reply('Jumlah coin tidak valid.')

    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu belum punya guild.')
    if (user.coin < jumlah) return m.reply('Uangmu tidak cukup.')

    await global.database.collection('users').updateOne(
      { uid: m.sender },
      { $inc: { coin: -jumlah } }
    )
    await global.database.collection('guilds').updateOne(
      { name: user.guild },
      { $inc: { coin: jumlah }, $set: { [`contribution.${m.sender}`]: (user.contribution?.[m.sender] || 0) + jumlah } }
    )

    m.reply(`Berhasil menyumbang ${jumlah} coin ke guild *${user.guild}*.`)
  }
}
