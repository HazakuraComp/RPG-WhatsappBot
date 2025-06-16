const cooldown = 1000 * 60 * 60 * 24; // 24 jam

module.exports = {
  command: ['daily'],
  tags: ['rpg'],
  help: ['daily'],
  func: async (m, { mongo }) => {
    const user = await mongo.db('rpg').collection('users').findOne({ uid: m.sender }) || {};
    const last = user.lastDaily || 0;
    const now = Date.now();

    if (now - last < cooldown) {
      const remaining = ((cooldown - (now - last)) / 1000 / 60).toFixed(0);
      return m.reply(`🕒 Kamu sudah klaim hari ini. Tunggu ${remaining} menit lagi.`);
    }

    const reward = 250;
    await global.database.collection('users').updateOne(
      { uid: m.sender },
      { $inc: { coin: reward }, $set: { lastDaily: now } },
      { upsert: true }
    );

    m.reply(`🎁 Kamu klaim harian dan mendapat +${reward} coin!`);
  }
};
