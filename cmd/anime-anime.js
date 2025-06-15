const fetch = require('node-fetch');

module.exports = {
  command: ['malanime'],
  tags: ['anime'],
  help: ['malanime <judul anime>'],
  premium: false,
  private: false,
  func: async (m, { text, command }) => {
    if (!text) return m.reply(`Contoh penggunaan: .${command} jujutsu kaisen`);

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);
      const json = await res.json();

      if (!json.data || json.data.length === 0) {
        return m.reply('❌ Anime tidak ditemukan di MyAnimeList.');
      }

      const anime = json.data[0];
      const {
        title,
        title_japanese,
        synopsis,
        images,
        url,
        type,
        episodes,
        score,
        rank,
        status,
        season,
        year,
        studios
      } = anime;

      const studioList = studios.map(s => s.name).join(', ') || 'Tidak diketahui';
      const sinopsis = synopsis
        ? synopsis.replace(/\n+/g, '\n').substring(0, 1000) + '...'
        : 'Sinopsis tidak tersedia.';

      const caption = `*Judul:* ${title} (${title_japanese || 'N/A'})
*Skor:* ${score || 'N/A'} | *Peringkat:* ${rank || 'N/A'}
*Episode:* ${episodes || 'N/A'} | *Tipe:* ${type || 'N/A'}
*Status:* ${status || 'N/A'}
*Season:* ${season || 'N/A'} ${year || ''}
*Studio:* ${studioList}
*URL MAL:* ${url}

*Sinopsis:*
${sinopsis}`;

      await conn.sendMessage(m.chat, {
        image: { url: images?.jpg?.image_url || 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png' },
        caption: caption
      }, { quoted: m });

    } catch (e) {
      console.error(e);
      return m.reply('⚠️ Terjadi kesalahan saat mengambil data anime.');
    }
  }
};
