module.exports = {
  command: ["market"],
  tags: ["RPG"],
  private: false,
  func: async (m) => {
    m.reply(`Market Items:
- sword: 1000 coins
- potion: 300 coins

To buy: .buy sword 1`)
  }
}
