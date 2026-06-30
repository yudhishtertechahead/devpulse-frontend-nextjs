const fallbackCountries = [
  { name: { common: "China" }, capital: ["Beijing"], population: 1412600000, currencies: { CNY: {} }, flags: { emoji: "🇨🇳" }, subregion: "East Asia" },
  { name: { common: "India" }, capital: ["New Delhi"], population: 1380004385, currencies: { INR: {} }, flags: { emoji: "🇮🇳" }, subregion: "South Asia" },
  { name: { common: "Indonesia" }, capital: ["Jakarta"], population: 273523621, currencies: { IDR: {} }, flags: { emoji: "🇮🇩" }, subregion: "South-Eastern Asia" },
  { name: { common: "Pakistan" }, capital: ["Islamabad"], population: 220892331, currencies: { PKR: {} }, flags: { emoji: "🇵🇰" }, subregion: "South Asia" },
  { name: { common: "Bangladesh" }, capital: ["Dhaka"], population: 164689383, currencies: { BDT: {} }, flags: { emoji: "🇧🇩" }, subregion: "South Asia" },
  { name: { common: "Japan" }, capital: ["Tokyo"], population: 125836021, currencies: { JPY: {} }, flags: { emoji: "🇯🇵" }, subregion: "East Asia" },
  { name: { common: "Philippines" }, capital: ["Manila"], population: 109581085, currencies: { PHP: {} }, flags: { emoji: "🇵🇭" }, subregion: "South-Eastern Asia" },
  { name: { common: "Vietnam" }, capital: ["Hanoi"], population: 97338583, currencies: { VND: {} }, flags: { emoji: "🇻🇳" }, subregion: "South-Eastern Asia" },
  { name: { common: "Turkey" }, capital: ["Ankara"], population: 84339067, currencies: { TRY: {} }, flags: { emoji: "🇹🇷" }, subregion: "Western Asia" },
  { name: { common: "Iran" }, capital: ["Tehran"], population: 83992953, currencies: { IRR: {} }, flags: { emoji: "🇮🇷" }, subregion: "Southern Asia" },
  { name: { common: "Thailand" }, capital: ["Bangkok"], population: 69799978, currencies: { THB: {} }, flags: { emoji: "🇹🇭" }, subregion: "South-Eastern Asia" },
  { name: { common: "Myanmar" }, capital: ["Naypyidaw"], population: 54409800, currencies: { MMK: {} }, flags: { emoji: "🇲🇲" }, subregion: "South-Eastern Asia" },
  { name: { common: "South Korea" }, capital: ["Seoul"], population: 51780579, currencies: { KRW: {} }, flags: { emoji: "🇰🇷" }, subregion: "East Asia" },
  { name: { common: "Iraq" }, capital: ["Baghdad"], population: 40222493, currencies: { IQD: {} }, flags: { emoji: "🇮🇶" }, subregion: "Western Asia" },
  { name: { common: "Saudi Arabia" }, capital: ["Riyadh"], population: 34813871, currencies: { SAR: {} }, flags: { emoji: "🇸🇦" }, subregion: "Western Asia" },
  { name: { common: "Malaysia" }, capital: ["Kuala Lumpur"], population: 32365999, currencies: { MYR: {} }, flags: { emoji: "🇲🇾" }, subregion: "South-Eastern Asia" },
  { name: { common: "Nepal" }, capital: ["Kathmandu"], population: 29136808, currencies: { NPR: {} }, flags: { emoji: "🇳🇵" }, subregion: "South Asia" },
  { name: { common: "Sri Lanka" }, capital: ["Sri Jayawardenepura Kotte"], population: 21919000, currencies: { LKR: {} }, flags: { emoji: "🇱🇰" }, subregion: "South Asia" },
  { name: { common: "Kazakhstan" }, capital: ["Nur-Sultan"], population: 18754440, currencies: { KZT: {} }, flags: { emoji: "🇰🇿" }, subregion: "Central Asia" },
  { name: { common: "Cambodia" }, capital: ["Phnom Penh"], population: 16718971, currencies: { KHR: {} }, flags: { emoji: "🇰🇭" }, subregion: "South-Eastern Asia" },
];

export async function fetchCountries() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://restcountries.com/v5.1/region/asia', {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Countries API not available');
    return res.json();
  } catch {
    return fallbackCountries;
  }
}
