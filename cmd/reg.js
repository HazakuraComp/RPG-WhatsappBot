module.exports = {
  command: ["reg"],
  func: async (m, { ard }) => {
    const users = global.database.collection("users")
    const exist = await users.findOne({ jid: m.sender })

    if (exist) return m.reply("✅ Kamu sudah terverifikasi.")

    const user = {
      jid: m.sender,
      name: await ard.getName(m.sender, true),
      register: true,
      money: 0,
      exp: 0,
      level: 0
    }

    await users.insertOne(user)
    m.reply("✅ Registrasi berhasil! Sekarang kamu bisa menggunakan semua fitur bot.")
  }
}
