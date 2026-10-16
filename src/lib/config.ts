// Central business settings. Replace the placeholder contact details with the real ones.
export const siteConfig = {
  name: "DELOWAR AL KHALIJ CO.",
  nameAr: "شركة ديلوار آل خليج",
  url: "https://www.delowaralkhalij.com",
  phone: "+966 55 821 2396",
  whatsapp: "966558212396", // international format, digits only
  email: "delowarcom.ksa@gmail.com",
  address: {
    en: "Ar Rass, As Sinaiyah Dist.",
    ar: "الرس، حي الصناعية",
  },
  mapQuery: "الصناعية، الرس، القصيم", // Google Maps search (embed + directions); resolves to Al Sina'iyah, Ar Rass
  hours: {
    en: "Sat – Thu, 9:00 AM – 6:00 PM",
    ar: "السبت – الخميس، 9 صباحًا – 6 مساءً",
  },
  // Shown in the footer only when filled in.
  commercialRegistration: "",
  vatNumber: "",
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
  // Prices in the catalogue are stored in the base currency.
  baseCurrency: "SAR",
  rates: { SAR: 1, USD: 0.2667, EUR: 0.2457 },
  freeShippingThreshold: 5000, // in base currency
  minOrderArea: 1.5, // m²
  installationRate: 45, // base currency per m², used for "supply & installation" estimates
  kitchen: { wastePercent: 10, transportPerM2: 15, cuttingPerM2: 20 },
  quoteValidityDays: 14,
  stats: { factories: 100, products: 1000, stoneTypes: 50 },
  // Aluminium division stats bar — replace with your real figures.
  aluminiumStats: { projects: 300, years: 10 },
} as const;

export type Currency = keyof typeof siteConfig.rates;
export const currencies = Object.keys(siteConfig.rates) as Currency[];
