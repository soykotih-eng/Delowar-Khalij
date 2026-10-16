import type { L } from "@/lib/i18n";

export type Category = {
  slug: string;
  name: L;
  short?: L; // compact label for the main navigation
  description: L;
  image: string;
  parent?: string;
};

const p = (slug: string) => `/images/products/${slug}.webp`;

export const categories: Category[] = [
  // Groups
  {
    slug: "natural-stone",
    name: { en: "Natural Stone Materials", ar: "الخامات الطبيعية" },
    short: { en: "Natural Stone", ar: "الخامات الطبيعية" },
    description: {
      en: "Marble, granite, basalt, limestone and raw blocks sourced directly from trusted quarries.",
      ar: "رخام وجرانيت وبازلت وحجر جيري وبلوكات خام من أفضل المحاجر الموثوقة مباشرة.",
    },
    image: "/images/scenes/quarry-terraces.webp",
  },
  {
    slug: "manufactured-materials",
    name: { en: "Manufactured Materials", ar: "الخامات المصنّعة" },
    short: { en: "Engineered Stone", ar: "الخامات المصنّعة" },
    description: {
      en: "Engineered quartz, terrazzo and artificial marble with consistent colour and high performance.",
      ar: "كوارتز صناعي وتيرازو ورخام صناعي بألوان ثابتة وأداء عالٍ.",
    },
    image: "/images/scenes/terrazzo-grey.webp",
  },
  {
    slug: "stone-products",
    name: { en: "Manufactured Stone Products", ar: "منتجات الحجر المصنّعة" },
    short: { en: "Stone Products", ar: "منتجات حجرية" },
    description: {
      en: "Cladding, mosaics, waterjet inlays and carved panels crafted by skilled artisans and CNC machines.",
      ar: "تكسيات وموزاييك وترصيعات ووترجت ولوحات محفورة بأيدي حرفيين مهرة وماكينات CNC.",
    },
    image: p("cnc-floral-panel"),
  },
  // Natural stone
  { slug: "marble", parent: "natural-stone", name: { en: "Marble", ar: "الرخام" }, description: { en: "Italian, Spanish, Egyptian and exotic marbles for floors, walls and kitchens.", ar: "رخام إيطالي وإسباني ومصري ونادر للأرضيات والحوائط والمطابخ." }, image: p("statuario-white") },
  { slug: "granite", parent: "natural-stone", name: { en: "Granite", ar: "الجرانيت" }, description: { en: "Hard-wearing granite for countertops, stairs, façades and paving.", ar: "جرانيت شديد التحمل لأسطح المطابخ والسلالم والواجهات والأرضيات." }, image: p("royal-red-granite") },
  { slug: "basalt", parent: "natural-stone", name: { en: "Basalt", ar: "البازلت" }, description: { en: "Dense volcanic basalt for landscapes, pools and contemporary interiors.", ar: "بازلت بركاني كثيف للاند سكيب وحمامات السباحة والتصاميم العصرية." }, image: p("basalt-cobble-pavers") },
  { slug: "blocks", parent: "natural-stone", name: { en: "Blocks", ar: "البلوكات" }, description: { en: "Quarry-direct blocks for factories and processing workshops.", ar: "بلوكات مباشرة من المحجر للمصانع وورش التشغيل." }, image: p("raw-marble-blocks") },
  { slug: "limestone", parent: "natural-stone", name: { en: "Limestone", ar: "الحجر الجيري" }, description: { en: "Warm limestones for villa façades, walls and calm interiors.", ar: "أحجار جيرية دافئة لواجهات الفلل والجدران والمساحات الهادئة." }, image: p("riyadh-limestone") },
  // Manufactured materials
  { slug: "terrazzo", parent: "manufactured-materials", name: { en: "Terrazzo", ar: "التيرازو" }, description: { en: "Durable terrazzo tiles and slabs in classic and modern chip blends.", ar: "بلاط وألواح تيرازو متينة بخلطات حبيبات كلاسيكية وعصرية." }, image: p("venetian-terrazzo") },
  { slug: "quartz", parent: "manufactured-materials", name: { en: "Quartz", ar: "الكوارتز" }, description: { en: "Non-porous engineered quartz for worktops and vanities.", ar: "كوارتز صناعي غير مسامي لأسطح المطابخ والمغاسل." }, image: p("cloud-white-quartz") },
  { slug: "artificial-marble", parent: "manufactured-materials", name: { en: "Artificial Marble", ar: "الرخام الصناعي" }, description: { en: "Cost-effective artificial marble with luxurious veining.", ar: "رخام صناعي اقتصادي بعروق فاخرة." }, image: p("gold-vein-artificial-marble") },
  // Stone products
  { slug: "split-face", parent: "stone-products", name: { en: "Split-Face Stone", ar: "حجر سبليت فيس" }, description: { en: "Textured split-face panels for feature walls and façades.", ar: "ألواح سبليت فيس بملمس طبيعي للجدران المميزة والواجهات." }, image: p("grey-split-face-stone") },
  { slug: "mosaic", parent: "stone-products", name: { en: "Mosaic Stone", ar: "الموزاييك الحجري" }, description: { en: "Marble mosaics laid by hand for floors and walls.", ar: "موزاييك رخامي مُركّب يدويًا للأرضيات والحوائط." }, image: p("palladiana-marble-mosaic") },
  { slug: "cone-stone", parent: "stone-products", name: { en: "Cone Stone", ar: "حجر الكون" }, description: { en: "Hand-dressed cone stone for rustic walls and gardens.", ar: "حجر كون مشغول يدويًا للجدران الريفية والحدائق." }, image: p("rustic-cone-stone") },
  { slug: "waterjet", parent: "stone-products", name: { en: "Waterjet Stone", ar: "حجر الووترجت" }, description: { en: "Precision waterjet inlays, medallions and borders.", ar: "ترصيعات وميداليات وبرديرات ووترجت عالية الدقة." }, image: p("waterjet-floral-inlay") },
  { slug: "cnc-carved", parent: "stone-products", name: { en: "CNC Carved Stone", ar: "حفر CNC" }, description: { en: "CNC-carved panels and reliefs made to measure.", ar: "لوحات ونقوش محفورة بالـCNC حسب المقاس." }, image: p("cnc-floral-panel") },
  { slug: "wet-cast", parent: "stone-products", name: { en: "Wet Cast Stone", ar: "الحجر المصبوب" }, description: { en: "Wet-cast panels, screens and architectural elements.", ar: "ألواح وسواتر وعناصر معمارية من الحجر المصبوب." }, image: p("arabesque-wet-cast-panel") },
  { slug: "hand-carved", parent: "stone-products", name: { en: "Hand-Carved Stone", ar: "النحت اليدوي" }, description: { en: "Bespoke reliefs and ornaments carved by master craftsmen.", ar: "نقوش وزخارف حسب الطلب بأيدي حرفيين مهرة." }, image: p("hand-carved-floral-relief") },
];

export const categoryGroups = categories.filter((c) => !c.parent);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const childCategories = (parent: string) => categories.filter((c) => c.parent === parent);

/** Leaf category slugs covered by a category (itself, or its children for a group). */
export const leafSlugs = (slug: string) => {
  const children = childCategories(slug);
  return children.length ? children.map((c) => c.slug) : [slug];
};
