export default {
  command: ['guildbuff', 'gbuff'],
  tags: ['rpg', 'guild'],
  func: async (m) => {
    let user = await global.database.collection('users').findOne({ uid: m.sender })
    if (!user.guild) return m.reply('Kamu tidak tergabung dalam guild.')

    let guild = await global.database.collection('guilds').findOne({ name: user.guild })
    let buff = {
      coinBonus: Math.min(guild.level, 5) * 2,  // +2% per level
      expBonus: Math.min(guild.level, 5) * 1    // +1% per level
    }

    m.reply(`🎁 *Buff Aktif dari Guild*\n\n- +${buff.coinBonus}% Coin\n- +${buff.expBonus}% EXP`)
  }
}
