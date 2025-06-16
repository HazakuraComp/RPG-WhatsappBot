module.exports = {
  command: ['profile'],
  tags: ['rpg'],
  help: ['profile'],
  func: async (m, { mongo }) => {
    const user = await global.database.collection('users').findOne({ uid: m.sender }) || {};
    const coin = user.coin || 0;
    const exp = user.exp || 0;
    const hp = user.hp ?? 100;
    const inv = user.inventory || {};

    m.reply(`👤 *Profil RPG*
HP: ${hp}
EXP: ${exp}
Coin: ${coin}

📦 Inventory:
• Iron: ${inv.iron || 0}
• Gold: ${inv.gold || 0}
• Diamond: ${inv.diamond || 0}`);
  }
};
