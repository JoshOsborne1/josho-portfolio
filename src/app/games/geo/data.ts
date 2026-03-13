// Shared geo game data: countries, borders, utilities
export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  lat: number;
  lng: number;
}

export const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "AF", lat: 33.9391, lng: 67.7100 },
  { name: "Albania", code: "AL", lat: 41.1533, lng: 20.1683 },
  { name: "Algeria", code: "DZ", lat: 28.0339, lng: 1.6596 },
  { name: "Angola", code: "AO", lat: -11.2027, lng: 17.8739 },
  { name: "Argentina", code: "AR", lat: -38.4161, lng: -63.6167 },
  { name: "Australia", code: "AU", lat: -25.2744, lng: 133.7751 },
  { name: "Austria", code: "AT", lat: 47.5162, lng: 14.5501 },
  { name: "Azerbaijan", code: "AZ", lat: 40.1431, lng: 47.5769 },
  { name: "Bangladesh", code: "BD", lat: 23.6850, lng: 90.3563 },
  { name: "Belarus", code: "BY", lat: 53.7098, lng: 27.9534 },
  { name: "Belgium", code: "BE", lat: 50.5039, lng: 4.4699 },
  { name: "Bolivia", code: "BO", lat: -16.2902, lng: -63.5887 },
  { name: "Bosnia and Herzegovina", code: "BA", lat: 43.9159, lng: 17.6791 },
  { name: "Brazil", code: "BR", lat: -14.2350, lng: -51.9253 },
  { name: "Bulgaria", code: "BG", lat: 42.7339, lng: 25.4858 },
  { name: "Cambodia", code: "KH", lat: 12.5657, lng: 104.9910 },
  { name: "Cameroon", code: "CM", lat: 7.3697, lng: 12.3547 },
  { name: "Canada", code: "CA", lat: 56.1304, lng: -106.3468 },
  { name: "Chile", code: "CL", lat: -35.6751, lng: -71.5430 },
  { name: "China", code: "CN", lat: 35.8617, lng: 104.1954 },
  { name: "Colombia", code: "CO", lat: 4.5709, lng: -74.2973 },
  { name: "Congo (DRC)", code: "CD", lat: -4.0383, lng: 21.7587 },
  { name: "Croatia", code: "HR", lat: 45.1, lng: 15.2 },
  { name: "Cuba", code: "CU", lat: 21.5218, lng: -77.7812 },
  { name: "Czech Republic", code: "CZ", lat: 49.8175, lng: 15.4730 },
  { name: "Denmark", code: "DK", lat: 56.2639, lng: 9.5018 },
  { name: "Ecuador", code: "EC", lat: -1.8312, lng: -78.1834 },
  { name: "Egypt", code: "EG", lat: 26.8206, lng: 30.8025 },
  { name: "Ethiopia", code: "ET", lat: 9.1450, lng: 40.4897 },
  { name: "Finland", code: "FI", lat: 61.9241, lng: 25.7482 },
  { name: "France", code: "FR", lat: 46.2276, lng: 2.2137 },
  { name: "Germany", code: "DE", lat: 51.1657, lng: 10.4515 },
  { name: "Ghana", code: "GH", lat: 7.9465, lng: -1.0232 },
  { name: "Greece", code: "GR", lat: 39.0742, lng: 21.8243 },
  { name: "Guatemala", code: "GT", lat: 15.7835, lng: -90.2308 },
  { name: "Hungary", code: "HU", lat: 47.1625, lng: 19.5033 },
  { name: "India", code: "IN", lat: 20.5937, lng: 78.9629 },
  { name: "Indonesia", code: "ID", lat: -0.7893, lng: 113.9213 },
  { name: "Iran", code: "IR", lat: 32.4279, lng: 53.6880 },
  { name: "Iraq", code: "IQ", lat: 33.2232, lng: 43.6793 },
  { name: "Ireland", code: "IE", lat: 53.1424, lng: -7.6921 },
  { name: "Israel", code: "IL", lat: 31.0461, lng: 34.8516 },
  { name: "Italy", code: "IT", lat: 41.8719, lng: 12.5674 },
  { name: "Japan", code: "JP", lat: 36.2048, lng: 138.2529 },
  { name: "Jordan", code: "JO", lat: 30.5852, lng: 36.2384 },
  { name: "Kazakhstan", code: "KZ", lat: 48.0196, lng: 66.9237 },
  { name: "Kenya", code: "KE", lat: -0.0236, lng: 37.9062 },
  { name: "Laos", code: "LA", lat: 19.8563, lng: 102.4955 },
  { name: "Libya", code: "LY", lat: 26.3351, lng: 17.2283 },
  { name: "Madagascar", code: "MG", lat: -18.7669, lng: 46.8691 },
  { name: "Malaysia", code: "MY", lat: 4.2105, lng: 101.9758 },
  { name: "Mali", code: "ML", lat: 17.5707, lng: -3.9962 },
  { name: "Mexico", code: "MX", lat: 23.6345, lng: -102.5528 },
  { name: "Mongolia", code: "MN", lat: 46.8625, lng: 103.8467 },
  { name: "Morocco", code: "MA", lat: 31.7917, lng: -7.0926 },
  { name: "Mozambique", code: "MZ", lat: -18.6657, lng: 35.5296 },
  { name: "Myanmar", code: "MM", lat: 21.9162, lng: 95.9560 },
  { name: "Nepal", code: "NP", lat: 28.3949, lng: 84.1240 },
  { name: "Netherlands", code: "NL", lat: 52.1326, lng: 5.2913 },
  { name: "New Zealand", code: "NZ", lat: -40.9006, lng: 174.8860 },
  { name: "Nicaragua", code: "NI", lat: 12.8654, lng: -85.2072 },
  { name: "Niger", code: "NE", lat: 17.6078, lng: 8.0817 },
  { name: "Nigeria", code: "NG", lat: 9.0820, lng: 8.6753 },
  { name: "North Korea", code: "KP", lat: 40.3399, lng: 127.5101 },
  { name: "Norway", code: "NO", lat: 60.4720, lng: 8.4689 },
  { name: "Pakistan", code: "PK", lat: 30.3753, lng: 69.3451 },
  { name: "Paraguay", code: "PY", lat: -23.4425, lng: -58.4438 },
  { name: "Peru", code: "PE", lat: -9.1900, lng: -75.0152 },
  { name: "Philippines", code: "PH", lat: 12.8797, lng: 121.7740 },
  { name: "Poland", code: "PL", lat: 51.9194, lng: 19.1451 },
  { name: "Portugal", code: "PT", lat: 39.3999, lng: -8.2245 },
  { name: "Romania", code: "RO", lat: 45.9432, lng: 24.9668 },
  { name: "Russia", code: "RU", lat: 61.5240, lng: 105.3188 },
  { name: "Saudi Arabia", code: "SA", lat: 23.8859, lng: 45.0792 },
  { name: "Senegal", code: "SN", lat: 14.4974, lng: -14.4524 },
  { name: "Serbia", code: "RS", lat: 44.0165, lng: 21.0059 },
  { name: "Slovakia", code: "SK", lat: 48.6690, lng: 19.6990 },
  { name: "Somalia", code: "SO", lat: 5.1521, lng: 46.1996 },
  { name: "South Africa", code: "ZA", lat: -30.5595, lng: 22.9375 },
  { name: "South Korea", code: "KR", lat: 35.9078, lng: 127.7669 },
  { name: "South Sudan", code: "SS", lat: 6.8770, lng: 31.3070 },
  { name: "Spain", code: "ES", lat: 40.4637, lng: -3.7492 },
  { name: "Sudan", code: "SD", lat: 12.8628, lng: 30.2176 },
  { name: "Sweden", code: "SE", lat: 60.1282, lng: 18.6435 },
  { name: "Switzerland", code: "CH", lat: 46.8182, lng: 8.2275 },
  { name: "Syria", code: "SY", lat: 34.8021, lng: 38.9968 },
  { name: "Taiwan", code: "TW", lat: 23.6978, lng: 120.9605 },
  { name: "Tanzania", code: "TZ", lat: -6.3690, lng: 34.8888 },
  { name: "Thailand", code: "TH", lat: 15.8700, lng: 100.9925 },
  { name: "Turkey", code: "TR", lat: 38.9637, lng: 35.2433 },
  { name: "Uganda", code: "UG", lat: 1.3733, lng: 32.2903 },
  { name: "Ukraine", code: "UA", lat: 48.3794, lng: 31.1656 },
  { name: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.4360 },
  { name: "United States", code: "US", lat: 37.0902, lng: -95.7129 },
  { name: "Uruguay", code: "UY", lat: -32.5228, lng: -55.7658 },
  { name: "Uzbekistan", code: "UZ", lat: 41.3775, lng: 64.5853 },
  { name: "Venezuela", code: "VE", lat: 6.4238, lng: -66.5897 },
  { name: "Vietnam", code: "VN", lat: 14.0583, lng: 108.2772 },
  { name: "Yemen", code: "YE", lat: 15.5527, lng: 48.5164 },
  { name: "Zambia", code: "ZM", lat: -13.1339, lng: 27.8493 },
  { name: "Zimbabwe", code: "ZW", lat: -19.0154, lng: 29.1549 },
];

// Country code to list of bordering country codes
export const BORDERS: Record<string, string[]> = {
  AF: ["IR","PK","TM","UZ","TJ","CN"],
  AL: ["RS","MK","GR","ME","XK"],
  DZ: ["TN","LY","NE","ML","MR","EH","MA"],
  AO: ["CD","ZM","NA","CG"],
  AR: ["CL","BO","PY","BR","UY"],
  AT: ["DE","CZ","SK","HU","SI","IT","LI","CH"],
  AZ: ["RU","GE","AM","IR","TR"],
  BA: ["HR","RS","ME"],
  BD: ["IN","MM"],
  BE: ["NL","DE","LU","FR"],
  BG: ["RO","RS","MK","GR","TR"],
  BO: ["PE","CL","AR","PY","BR"],
  BR: ["VE","GY","SR","GF","CO","PE","BO","PY","AR","UY"],
  BY: ["RU","UA","PL","LT","LV"],
  CA: ["US"],
  CD: ["CF","SS","UG","RW","BI","TZ","ZM","AO","CG","CM"],
  CL: ["PE","BO","AR"],
  CN: ["RU","MN","KZ","KG","TJ","AF","PK","IN","NP","BT","MM","LA","VN","KP"],
  CO: ["VE","BR","PE","EC","PA"],
  CZ: ["DE","PL","SK","AT"],
  DE: ["DK","NL","BE","LU","FR","CH","AT","CZ","PL"],
  DK: ["DE"],
  EC: ["CO","PE"],
  EG: ["LY","SD","IL","PS"],
  ES: ["PT","FR","AD"],
  ET: ["ER","DJ","SO","KE","SS","SD"],
  FI: ["NO","SE","RU"],
  FR: ["BE","LU","DE","CH","IT","MC","ES","AD"],
  GH: ["CI","BF","TG"],
  GR: ["AL","MK","BG","TR"],
  GT: ["MX","BZ","HN","SV"],
  HR: ["SI","HU","RS","BA","ME"],
  HU: ["AT","SK","UA","RO","RS","HR","SI"],
  ID: ["MY","PG","TL"],
  IL: ["LB","SY","JO","EG","PS"],
  IN: ["PK","CN","NP","BT","BD","MM"],
  IQ: ["TR","SY","JO","SA","KW","IR"],
  IR: ["TR","IQ","SY","TM","AF","PK","AZ","AM"],
  IE: ["GB"],
  IT: ["FR","CH","AT","SI","SM","VA"],
  JO: ["SY","IQ","SA","IL","PS"],
  JP: [],
  KE: ["ET","SS","UG","TZ","SO"],
  KP: ["CN","RU","KR"],
  KR: ["KP"],
  KZ: ["RU","CN","KG","UZ","TM"],
  LA: ["CN","VN","KH","TH","MM"],
  LY: ["TN","DZ","NE","SD","EG"],
  MG: [],
  ML: ["DZ","NE","BF","CI","GN","SN","MR"],
  MA: ["DZ","ES"],
  MM: ["CN","LA","TH","BD","IN"],
  MN: ["RU","CN"],
  MX: ["US","GT","BZ"],
  MZ: ["TZ","MW","ZM","ZW","ZA","SZ"],
  NE: ["DZ","LY","SD","NG","BJ","BF","ML"],
  NG: ["NE","TD","CM","BJ"],
  NL: ["DE","BE"],
  NO: ["SE","FI","RU"],
  NP: ["CN","IN"],
  NZ: [],
  NI: ["HN","CR"],
  PH: [],
  PK: ["IN","AF","IR","CN"],
  PL: ["DE","CZ","SK","UA","BY","LT","RU"],
  PT: ["ES"],
  PE: ["EC","CO","BR","BO","CL"],
  PY: ["AR","BO","BR"],
  RO: ["HU","UA","MD","BG","RS"],
  RU: ["NO","FI","EE","LV","BY","UA","PL","LT","KZ","MN","CN","KP","AZ","GE"],
  SA: ["JO","IQ","KW","QA","AE","OM","YE"],
  SE: ["NO","FI"],
  SK: ["CZ","PL","UA","HU","AT"],
  SN: ["MR","ML","GN","GW","GM"],
  SO: ["ET","KE","DJ"],
  SS: ["SD","ET","KE","UG","CD","CF"],
  SD: ["EG","LY","NE","NG","SS","ET","ER"],
  SY: ["TR","IQ","JO","IL","LB"],
  TH: ["MM","LA","KH","MY"],
  TN: ["DZ","LY"],
  TR: ["GR","BG","GE","AM","AZ","IR","IQ","SY"],
  TZ: ["KE","UG","RW","BI","CD","ZM","MW","MZ"],
  UA: ["RU","BY","PL","SK","HU","RO","MD"],
  UG: ["SS","KE","TZ","RW","CD"],
  UY: ["AR","BR"],
  UZ: ["KZ","KG","TJ","AF","TM"],
  VE: ["CO","BR","GY"],
  VN: ["CN","LA","KH"],
  YE: ["SA","OM"],
  ZA: ["NA","BW","ZW","MZ","SZ","LS"],
  ZM: ["CD","TZ","MW","MZ","ZW","BW","NA","AO"],
  ZW: ["ZA","BW","ZM","MZ"],
  GB: ["IE"],
  US: ["CA","MX"],
  AU: [],
  CU: [],
  TW: [],
};

// Get daily seed based on date + gameSlug
export function getDailySeed(gameSlug: string): number {
  const date = new Date().toISOString().slice(0, 10);
  const str = `${date}-${gameSlug}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

export function getCountryByIndex(seed: number): Country {
  return COUNTRIES[seed % COUNTRIES.length];
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function bearingDeg(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const la1 = lat1 * Math.PI / 180;
  const la2 = lat2 * Math.PI / 180;
  const x = Math.sin(dLng) * Math.cos(la2);
  const y = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLng);
  return ((Math.atan2(x, y) * 180 / Math.PI) + 360) % 360;
}

export function proximityPct(distKm: number): number {
  return Math.max(0, Math.round(100 - distKm / 200));
}

export function bearingArrow(deg: number): string {
  const dirs = ["↑","↗","→","↘","↓","↙","←","↖"];
  return dirs[Math.round(deg / 45) % 8];
}

export function FLAG_URL(code: string): string {
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}

export function SHAPE_URL(code: string): string {
  return `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${code.toLowerCase()}/vector.svg`;
}

// BFS to find shortest path between two countries via borders
export function findPath(start: string, end: string): string[] | null {
  if (start === end) return [start];
  const queue: string[][] = [[start]];
  const visited = new Set<string>([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const cur = path[path.length - 1];
    for (const neighbor of (BORDERS[cur] || [])) {
      if (neighbor === end) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

// Find two countries that are exactly N hops apart via BFS
export function findPuzzlePair(seed: number, minHops = 3, maxHops = 7): [Country, Country] {
  const candidates = COUNTRIES.filter(c => (BORDERS[c.code] || []).length > 0);
  let attempt = seed;
  for (let i = 0; i < 200; i++) {
    const start = candidates[attempt % candidates.length];
    attempt = (attempt * 1664525 + 1013904223) & 0x7fffffff;
    const end = candidates[attempt % candidates.length];
    if (start.code === end.code) continue;
    const path = findPath(start.code, end.code);
    if (path && path.length - 1 >= minHops && path.length - 1 <= maxHops) {
      return [start, end];
    }
    attempt = (attempt * 1664525 + 1013904223) & 0x7fffffff;
  }
  // fallback
  return [COUNTRIES[seed % COUNTRIES.length], COUNTRIES[(seed + 37) % COUNTRIES.length]];
}
