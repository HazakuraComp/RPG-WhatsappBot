module.exports = {
  command: ['inventory'],
  tags: ['rpg'],
  help: ['inventory'],
  func: async (m, { mongo }) => {
    const user = await mongo.db('rpg').collection('users').findOne({ uid: m.sender }) || {};
    const inv = user.inventory || {};

    m.reply(`📦 Inventory kamu:\n🪨 Iron: ${inv.iron || 0}\n💰 Gold: ${inv.gold || 0}\n💎 Diamond: ${inv.diamond || 0}`);
  }
};
