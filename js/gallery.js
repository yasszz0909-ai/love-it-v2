/**
 * OUR LITTLE STORY - Gallery Data (Video JJ, Foto AI, & Random Memories)
 * 
 * ===================================================================
 * CARA MENAMBAH / MENGUBAH FOTO & VIDEO BARU:
 * ===================================================================
 * 
 * 1. UNTUK MENAMBAHKAN VIDEO JJ (JEDAG-JEDUG) / REEL:
 *    - Masukkan file video ke folder: assets/videos/
 *    - Masukkan cover thumbnail foto ke folder: assets/images/
 *    - Tambahkan data di array memories:
 *      {
 *        type: "video",
 *        category: "jj",
 *        tag: "JJ Berdua 🔥",
 *        title: "Judul Video JJ",
 *        date: "28 September 2026",
 *        video: "assets/videos/nama-video.mp4",
 *        thumbnail: "assets/images/nama-thumbnail.jpg",
 *        description: "Deskripsi momen video ini."
 *      },
 * 
 * 2. UNTUK MENAMBAHKAN FOTO BERDUA BUATAN AI:
 *    - Masukkan file foto hasil AI kamu ke folder: assets/images/
 *    - Tambahkan data di array memories:
 *      {
 *        type: "photo",
 *        category: "ai",
 *        tag: "Foto AI ✨",
 *        title: "Foto Berdua Versi AI",
 *        date: "28 September 2026",
 *        image: "assets/images/nama-foto-ai.jpg",
 *        description: "Foto couple buatan AI."
 *      },
 * 
 * 3. UNTUK MENAMBAHKAN FOTO / MOMEN RANDOM (PAP / CANDID):
 *    - Masukkan file foto ke folder: assets/images/
 *    - Tambahkan data di array memories:
 *      {
 *        type: "photo",
 *        category: "random",
 *        tag: "Random Pap 📸",
 *        title: "Judul Foto Random",
 *        date: "28 September 2026",
 *        image: "assets/images/nama-foto.jpg",
 *        description: "Momen lucu atau candid kita."
 *      },
 */

// =====================================
// DATA GALERI (Semua foto lama telah dihapus)
// =====================================
const memories = [
  {
    type: "video",
    category: "jj",
    tag: "#1",
    title: "💕 ❤",
    date: "26 September 2026",
    video: "assets/videos/Yuraprst☕️ 9_16 [9298052].mp4",
    thumbnail: "assets/images/thumb-yura.jpg",
    description: "Video JJ Mobile Legend berdua."
  },
  {
    type: "video",
    category: "jj",
    tag: "#2",
    title: "❤ ✨",
    date: "26 September 2026",
    video: "assets/videos/Proyek Baru 2065 9_16 [2D8E2BF].mp4",
    thumbnail: "assets/images/thumb-proyek.jpg",
    description: "video JJ reels 9:16."
  },
  {
    type: "video",
    category: "jj",
    tag: "#3",
    title: "😖 🎵",
    date: "21 September 2026",
    video: "assets/videos/Preset 9_16 [8A4B850].mp4",
    thumbnail: "assets/images/thumb-preset.jpg",
    description: "Video JJ berdua."
  }, 
  {
    type: "photo",
    category: "ai",
    tag: "Photo",
    title: "Random Photo but make with AI",
    date: "28 September 2026",
    image: "assets/images/file_00000000ad5882119f2b1d80d70e3ba1.png",
    description: "Foto random💕."
 },
];
