module.exports = {
  command: ['hunt'],
  tags: ['rpg'],
  help: ['hunt'],
  func: async (m, { mongo }) => {
    const user = global.database.collection('users').findOne({ uid: m.sender }) || {};
    const expGained = Math.floor(Math.random() * 30) + 20;
    const coinGained = Math.floor(Math.random() * 50) + 10;

    await global.database.collection('users').updateOne(
      { uid: m.sender },
      { $inc: { coin: coinGained, exp: expGained }, $setOnInsert: { uid: m.sender } },
      { upsert: true }
    );

    m.reply(`🗡️ Kamu berhasil berburu!\n+${expGained} EXP\n+${coinGained} coin`);
  }
};
