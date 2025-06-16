module.exports = {
  command: ["explore"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    const uid = m.sender
    const event = [
      { text: "You found 2 herbs!", reward: { herb: 2 } },
      { text: "You found an iron shard!", reward: { iron: 1 } },
      { text: "You were attacked! Lost 10 HP.", damage: 10 }
    ][Math.floor(Math.random() * 3)]

    let update = { $set: {} }
    if (event.reward) {
      for (let item in event.reward) {
        update.$inc = update.$inc || {}
        update.$inc[`inventory.${item}`] = event.reward[item]
      }
    } else if (event.damage) {
      update.$inc = { hp: -event.damage }
    }

    await global.database.collection("users").updateOne({ uid }, update, { upsert: true })
    m.reply(event.text)
  }
}
