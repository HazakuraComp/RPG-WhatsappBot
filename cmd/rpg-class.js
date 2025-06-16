module.exports = {
  command: ["class"],
  tags: ["RPG"],
  private: false,
  func: async (m, { text }) => {
    const uid = m.sender
    const classes = ["warrior", "mage", "archer", "healer"]
    const chosen = text.trim().toLowerCase()

    if (!chosen) {
      return m.reply(`Available Classes:\n- ${classes.join("\n- ")}\n\nUsage: .class warrior`)
    }

    if (!classes.includes(chosen)) {
      return m.reply(`Invalid class. Choose one of:\n- ${classes.join("\n- ")}`)
    }

    await global.database.collection('users').updateOne(
      { uid },
      { $set: { class: chosen } },
      { upsert: true }
    )

    m.reply(`You are now a ${chosen}.`)
  }
}
