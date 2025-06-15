module.exports = {
  command: ['heal'],
  tags: ['rpg'],
  help: ['heal'],
  func: async (m, { mongo }) => {
    const user = await mongo.db('rpg').collection('users').findOne({ uid: m.sender }) || {};
    const healCost = 100;

    if ((user.coin || 0) < healCost) return m.reply(`💸 Uang kamu tidak cukup untuk menyembuhkan (butuh ${healCost} coin)!`);

    await mongo.db('rpg').collection('users').updateOne(
      { uid: m.sender },
      { $inc: { coin: -healCost }, $set: { hp: 100 } }
    );

    m.reply(`💊 Kamu telah disembuhkan! HP dipulihkan ke 100`);
  }
};
