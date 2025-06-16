export default {
  command: ['guildrank', 'guildtop'],
  tags: ['rpg', 'guild'],
  func: async (m) => {
    const topGuilds = await global.database.collection('guilds')
      .find({})
      .sort({ level: -1, exp: -1 })
      .limit(10)
      .toArray()

    if (!topGuilds.length) return m.reply('Belum ada guild terdaftar.')

    let msg = `🏆 *Top Guilds Leaderboard*\n\n`
    topGuilds.forEach((g, i) => {
      msg += `${i + 1}. ${g.name} (Lvl ${g.level}, ${g.members.length} members)\n`
    })

    m.reply(msg)
  }
}
