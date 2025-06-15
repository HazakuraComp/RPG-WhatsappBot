const fetch = require('node-fetch');

module.exports = {
  command: ['malchar'],
  tags: ['anime'],
  help: ['malchar <nama karakter>'],
  premium: false,
  private: false,
  func: async (m, { text, command }) => {
    if (!text) return m.reply(`Contoh penggunaan: .${command} gojo`);

    try {
      const res = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(text)}&limit=1`);
      const json = await res.json();

      if (!json.data || json.data.length === 0) {
        return m.reply('❌ Karakter tidak ditemukan di MyAnimeList.');
      }

      const char = json.data[0];
      const {
        name,
        name_kanji,
        about,
        images,
        url,
        anime
      } = char;

      const animeAppearances = anime && anime.length
        ? anime.map(a => `• ${a.anime.title}`).join('\n')
        : 'Tidak tersedia';

      const description = about
        ? about.replace(/\n+/g, '\n').substring(0, 1000) + '...'
        : 'Deskripsi tidak tersedia.';

      const caption = `*Nama:* ${name} (${name_kanji || 'Kanji tidak tersedia'})
*URL MAL:* ${url}
*Anime:* 
${animeAppearances}

*Tentang:* 
${description}`;

      await conn.sendMessage(m.chat, {
        image: { url: images?.jpg?.image_url || 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png' },
        caption: caption
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      return m.reply('⚠️ Terjadi kesalahan saat mengambil data karakter.');
    }
  }
};
