module.exports = {
  command: ['mine'],
  tags: ['rpg'],
  help: ['mine'],
  func: async (m, { mongo }) => {
    const iron = Math.floor(Math.random() * 5) + 1;
    const gold = Math.floor(Math.random() * 3);
    const diamond = Math.floor(Math.random() * 2);

    await global.database.collection('users').updateOne(
      { uid: m.sender },
      {
        $inc: { 'inventory.iron': iron, 'inventory.gold': gold, 'inventory.diamond': diamond },
        $setOnInsert: { uid: m.sender }
      },
      { upsert: true }
    );

    m.reply(`⛏️ Kamu menambang:\n+${iron} Iron\n+${gold} Gold\n+${diamond} Diamond`);
  }
};
