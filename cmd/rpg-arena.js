module.exports = {
  command: ["arena"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const target = m.quoted?.sender
    if (!target) return m.reply("Reply to someone to challenge.")

    const u1 = await global.database.collection("users").findOne({ uid }) || {}
    const u2 = await global.database.collection("users").findOne({ uid: target }) || {}

    const pow1 = Math.random() * (u1.level || 1)
    const pow2 = Math.random() * (u2.level || 1)

    const win = pow1 > pow2 ? uid : target

    await global.database.collection("users").updateOne({ uid: win }, {
      $inc: { coin: 1000 }
    })

    m.reply(`${win === uid ? "You" : `@${target.split('@')[0]}`} won the arena battle!\n+1000 coins`, null, {
      mentions: [target]
    })
  }
}
