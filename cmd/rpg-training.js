module.exports = {
  command: ["train", "training"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const now = Date.now()
    const user = await global.database.collection("users").findOne({ uid }) || {}

    const lastTrain = user.lastTrain || 0
    const cooldown = 1000 * 60 * 10 // 10 minutes
    if (now - lastTrain < cooldown)
      return m.reply(`You must wait ${Math.ceil((cooldown - (now - lastTrain)) / 60000)} minutes before training again.`)

    const gain = Math.floor(Math.random() * 60 + 40)

    await global.database.collection("users").updateOne(
      { uid },
      {
        $inc: { exp: gain },
        $set: { lastTrain: now }
      },
      { upsert: true }
    )

    m.reply(`You trained hard and gained +${gain} EXP.`)
  }
}
