import type { L } from "@/lib/i18n";

export const colors = {
  white: { en: "White", ar: "أبيض" },
  black: { en: "Black", ar: "أسود" },
  grey: { en: "Grey", ar: "رمادي" },
  beige: { en: "Beige", ar: "بيج" },
  brown: { en: "Brown", ar: "بني" },
  red: { en: "Red", ar: "أحمر" },
  pink: { en: "Pink", ar: "وردي" },
  green: { en: "Green", ar: "أخضر" },
  blue: { en: "Blue", ar: "أزرق" },
  multi: { en: "Multicolour", ar: "متعدد الألوان" },
} satisfies Record<string, L>;

export const finishes = {
  polished: { en: "Polished", ar: "لامع" },
  honed: { en: "Honed", ar: "مطفي" },
  flamed: { en: "Flamed", ar: "مُلهّب" },
  leathered: { en: "Leathered", ar: "جلدي" },
  tumbled: { en: "Tumbled", ar: "معتّق" },
  split: { en: "Split-face", ar: "مشقوق" },
  carved: { en: "Carved", ar: "منحوت" },
  natural: { en: "Natural / Raw", ar: "طبيعي / خام" },
} satisfies Record<string, L>;

export const origins = {
  italy: { en: "Italian", ar: "إيطالي" },
  spain: { en: "Spanish", ar: "إسباني" },
  portugal: { en: "Portuguese", ar: "برتغالي" },
  turkey: { en: "Turkish", ar: "تركي" },
  egypt: { en: "Egyptian", ar: "مصري" },
  india: { en: "Indian", ar: "هندي" },
  brazil: { en: "Brazilian", ar: "برازيلي" },
  iran: { en: "Iranian", ar: "إيراني" },
  saudi: { en: "Saudi", ar: "سعودي" },
  local: { en: "Local factory", ar: "تصنيع محلي" },
} satisfies Record<string, L>;

export const usages = {
  floors: { en: "Floors", ar: "أرضيات" },
  walls: { en: "Walls", ar: "حوائط" },
  kitchens: { en: "Kitchens", ar: "مطابخ" },
  bathrooms: { en: "Bathrooms", ar: "حمامات" },
  stairs: { en: "Stairs", ar: "سلالم" },
  facades: { en: "Facades", ar: "واجهات" },
  landscape: { en: "Landscape", ar: "لاند سكيب" },
  decor: { en: "Decor", ar: "ديكور" },
} satisfies Record<string, L>;

export const units = {
  m2: { en: "m²", ar: "م²" },
  m3: { en: "m³", ar: "م³" },
  piece: { en: "piece", ar: "قطعة" },
} satisfies Record<string, L>;

export type ColorKey = keyof typeof colors;
export type FinishKey = keyof typeof finishes;
export type OriginKey = keyof typeof origins;
export type UsageKey = keyof typeof usages;
export type UnitKey = keyof typeof units;
