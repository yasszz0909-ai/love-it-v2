/**
 * OUR LITTLE STORY - Anniversary, Special Dates & Birthday Data
 * 
 * ===================================================================
 * DATA TANGGAL SPESIAL & ULANG TAHUN
 * ===================================================================
 */

// 1. DATA ULANG TAHUN PASANGAN
const coupleBirthdays = {
  iam: {
    id: "iam",
    name: "Pangeran I'am",
    month: 0, // 0 = Januari (0-indexed)
    day: 22,
    emoji: "👑",
    title: "PANGERAN • I'AM (YAS)",
    zodiac: "♒ Aquarius"
  },
  via: {
    id: "via",
    name: "Tuan Putri Via",
    month: 9, // 9 = Oktober (0-indexed)
    day: 30,
    emoji: "🌸",
    title: "TUAN PUTRI • VIA",
    zodiac: "♏ Scorpio"
  }
};

// 2. DATA TANGGAL SPESIAL
const specialDates = [
  {
    date: "2026-11-01",
    title: "Next Our Anniversary",
    description: "Hari indah saat kita resmi memulai perjalanan cinta berdua.",
    image: "assets/images/thum_ultah.jpg"
  }
];

// Helper to expose globally for any script or inline runner
if (typeof window !== "undefined") {
  window.coupleBirthdays = coupleBirthdays;
  window.specialDates = specialDates;
}
