import type { L } from "@/lib/i18n";

export type AluCategory = "facades" | "windows-doors" | "glass-interiors" | "skylights";

export type AluWork = {
  slug: string;
  w: number; // image size, used for layout without shifts
  h: number;
  category: AluCategory;
  title: L;
  system: L;
  image: string; // "/images/aluminium/…" for the starter photos, "/media/<id>" for uploads
  featured?: boolean;
};

export type AluService = {
  key: string;
  image: string;
  tag: L;
  title: L;
  text: L;
  points: L[];
};

export type AluHotspot = { x: number; y: number; title: L; text: L; work: string; labelAbove?: boolean };

export const aluImage = (slug: string) => `/images/aluminium/${slug}.webp`;

export const aluCategories: Record<AluCategory, L> = {
  facades: { en: "Facades & Curtain Walls", ar: "الواجهات والكرتن وول" },
  "windows-doors": { en: "Windows & Doors", ar: "النوافذ والأبواب" },
  "glass-interiors": { en: "Showers & Partitions", ar: "الشاور والقواطع" },
  skylights: { en: "Skylights", ar: "السكاي لايت" },
};

// Photos of our installations (enhanced copies live in /public/images/aluminium).
// Starter photos: copied into the database on first start; new work is uploaded in /admin.
const seedWorks: Omit<AluWork, "image">[] = [
  { slug: "palace-facade-glazing", w: 1210, h: 820, category: "facades", title: { en: "Palace Facade Glazing", ar: "زجاج واجهة قصر" }, system: { en: "Curtain wall · strip windows", ar: "كرتن وول · نوافذ طولية" } },
  { slug: "black-glass-curtain-wall", w: 870, h: 1010, category: "facades", title: { en: "Black Glass Curtain Wall", ar: "كرتن وول بزجاج أسود" }, system: { en: "Structural glazing · black reflective", ar: "زجاج إنشائي · أسود عاكس" } },
  { slug: "clear-shower-marble-bench", w: 960, h: 1220, category: "glass-interiors", title: { en: "Clear Shower with Marble Bench", ar: "شاور شفاف مع مقعد رخام" }, system: { en: "Frameless · clear tempered glass", ar: "بدون إطار · سيكوريت شفاف" } },
  { slug: "curved-bay-glazing", w: 1280, h: 760, category: "facades", title: { en: "Curved Bay Glazing", ar: "واجهة زجاجية منحنية" }, system: { en: "Curved curtain wall · blue glass", ar: "كرتن وول منحني · زجاج أزرق" } },
  { slug: "arched-entrance-door", w: 960, h: 1235, category: "windows-doors", title: { en: "Arched Entrance Door", ar: "باب مدخل مقوّس" }, system: { en: "Hinged door · arched transom", ar: "باب مفصلي · قوس علوي" } },
  { slug: "pyramid-skylight", w: 1280, h: 1114, category: "skylights", title: { en: "Pyramid Skylight", ar: "سكاي لايت هرمي" }, system: { en: "Glass roof · black frame", ar: "سقف زجاجي · إطار أسود" } },
  { slug: "villa-sliding-window", w: 960, h: 620, category: "windows-doors", title: { en: "Villa Sliding Window", ar: "نافذة سحاب لفيلا" }, system: { en: "Sliding system · reflective glass", ar: "نظام سحاب · زجاج عاكس" } },
  { slug: "blue-reflective-facade", w: 742, h: 1115, category: "facades", title: { en: "Blue Reflective Facade", ar: "واجهة زجاج أزرق عاكس" }, system: { en: "Fortex structural glazing", ar: "زجاج إنشائي فورتكس" } },
  { slug: "black-frame-shower", w: 960, h: 1250, category: "glass-interiors", title: { en: "Black-Frame Shower Cabin", ar: "كابينة شاور بإطار أسود" }, system: { en: "Clear glass · black hardware", ar: "زجاج شفاف · إكسسوارات سوداء" } },
  { slug: "pool-house-glass-front", w: 1280, h: 910, category: "facades", title: { en: "Pool House Glass Front", ar: "واجهة زجاجية لاستراحة" }, system: { en: "Frameless door · fixed glazing", ar: "باب بدون إطار · زجاج ثابت" } },
  { slug: "double-height-window", w: 720, h: 1030, category: "windows-doors", title: { en: "Double-Height Feature Window", ar: "نافذة مزدوجة الارتفاع" }, system: { en: "Fixed glazing · black frame", ar: "زجاج ثابت · إطار أسود" } },
  { slug: "glass-office-partition", w: 720, h: 800, category: "glass-interiors", title: { en: "Glass Office Partition", ar: "قواطع زجاجية لمكتب" }, system: { en: "Tempered glass · frosted film", ar: "زجاج سيكوريت · ستيكر مطفي" } },
  { slug: "bronze-glass-bay", w: 834, h: 697, category: "facades", title: { en: "Bronze Glass Bay", ar: "واجهة زجاج برونزي" }, system: { en: "SG-50 silicone joints", ar: "فواصل سيليكون SG-50" } },
  { slug: "rooftop-window-wall", w: 900, h: 760, category: "windows-doors", title: { en: "Rooftop Window Wall", ar: "واجهة نوافذ للسطح" }, system: { en: "Casement & top-hung sashes", ar: "فتحات مفصلية وقلّابة" } },
  { slug: "striped-shower-corner", w: 720, h: 1190, category: "glass-interiors", title: { en: "Striped Corner Shower", ar: "شاور زاوية مخطط" }, system: { en: "Corner cabin · stripe film", ar: "كابينة زاوية · ستيكر مخطط" } },
  { slug: "facade-installation", w: 960, h: 1150, category: "facades", title: { en: "Curtain Wall Installation", ar: "تركيب واجهة كرتن وول" }, system: { en: "On-site installation", ar: "تركيب في الموقع" } },
  { slug: "modern-villa-windows", w: 960, h: 830, category: "windows-doors", title: { en: "Modern Villa Windows", ar: "نوافذ فيلا حديثة" }, system: { en: "Fixed & slot windows", ar: "نوافذ ثابتة وطولية" } },
  { slug: "sliding-frosted-shower", w: 1067, h: 1280, category: "glass-interiors", title: { en: "Sliding Frosted Shower", ar: "شاور سحاب مطفي" }, system: { en: "Sliding rail · frosted glass", ar: "مجرى سحاب · زجاج مطفي" } },
  { slug: "pool-view-sliding-doors", w: 933, h: 1280, category: "windows-doors", title: { en: "Pool-View Sliding Doors", ar: "أبواب سحاب مطلة على المسبح" }, system: { en: "Slim sliding system", ar: "نظام سحاب نحيف" } },
  { slug: "stripe-film-shower-bench", w: 960, h: 1050, category: "glass-interiors", title: { en: "Shower with Stripe Film", ar: "شاور بستيكر مخطط" }, system: { en: "Sliding system · stripe film", ar: "نظام سحاب · ستيكر مخطط" } },
  { slug: "modern-glass-villa", w: 868, h: 1280, category: "windows-doors", title: { en: "Modern Glass Villa", ar: "فيلا زجاجية حديثة" }, system: { en: "Large fixed & sliding glazing", ar: "زجاج ثابت وسحاب كبير" } },
  { slug: "frosted-shower-cabin", w: 720, h: 1000, category: "glass-interiors", title: { en: "Frosted Shower Cabin", ar: "كابينة شاور مطفية" }, system: { en: "Hinged · frosted glass", ar: "مفصلي · زجاج مطفي" } },
  { slug: "stripe-film-sliding-shower", w: 960, h: 1050, category: "glass-interiors", title: { en: "Stripe-Film Sliding Shower", ar: "شاور سحاب بستيكر مخطط" }, system: { en: "Sliding rail · stripe film", ar: "مجرى سحاب · ستيكر مخطط" } },
  { slug: "frosted-shower-freestanding-bath", w: 960, h: 1240, category: "glass-interiors", title: { en: "Frosted Shower & Freestanding Bath", ar: "شاور مطفي مع بانيو" }, system: { en: "Hinged · frosted tempered glass", ar: "مفصلي · سيكوريت مطفي" } },
];

const featuredSeed = ["palace-facade-glazing", "curved-bay-glazing", "pool-house-glass-front", "clear-shower-marble-bench"];

export const seedAluWorks: AluWork[] = seedWorks.map((w) => ({
  ...w,
  image: aluImage(w.slug),
  featured: featuredSeed.includes(w.slug),
}));

/** Starter work by slug — used by fixed page elements (system map) that must never disappear. */
export const getSeedWork = (slug: string) => seedAluWorks.find((w) => w.slug === slug)!;

export const aluServices: AluService[] = [
  {
    key: "windows", image: "villa-sliding-window",
    tag: { en: "Windows · sliding / casement", ar: "نوافذ · سحاب / مفصلي" },
    title: { en: "Aluminium Windows", ar: "نوافذ الألمنيوم" },
    text: { en: "Sliding, casement, tilt-and-turn and fixed windows in Thai aluminium profiles with powder-coated finishes.", ar: "نوافذ سحاب ومفصلية وقلّابة وثابتة من قطاعات الألمنيوم التايلندي بألوان بودرة حرارية." },
    points: [
      { en: "Sliding, casement & tilt-turn systems", ar: "أنظمة سحاب ومفصلي وقلّاب" },
      { en: "Reflective, tinted & double glazing", ar: "زجاج عاكس وملوّن ومزدوج" },
      { en: "Powder-coated colours to match your facade", ar: "ألوان بودرة تناسب واجهتك" },
      { en: "Insect screens & security options", ar: "شبك حشرات وخيارات أمان" },
    ],
  },
  {
    key: "doors", image: "arched-entrance-door",
    tag: { en: "Doors · hinged / sliding", ar: "أبواب · مفصلي / سحاب" },
    title: { en: "Aluminium Doors", ar: "أبواب الألمنيوم" },
    text: { en: "Entrance, sliding and folding doors — including arched designs — with smooth hardware and secure locking.", ar: "أبواب مداخل وسحاب وطيّ — بما فيها التصاميم المقوّسة — بإكسسوارات ناعمة وأقفال آمنة." },
    points: [
      { en: "Hinged entrance & arched doors", ar: "أبواب مداخل مفصلية ومقوّسة" },
      { en: "Large sliding & folding glass doors", ar: "أبواب زجاجية سحاب وطيّ كبيرة" },
      { en: "Multi-point locks & quality hardware", ar: "أقفال متعددة النقاط وإكسسوارات عالية الجودة" },
      { en: "Clear, tinted or frosted glass", ar: "زجاج شفاف أو ملوّن أو مطفي" },
    ],
  },
  {
    key: "facades", image: "palace-facade-glazing",
    tag: { en: "Curtain wall · structural glazing", ar: "كرتن وول · زجاج إنشائي" },
    title: { en: "Glass Facades & Curtain Walls", ar: "الواجهات الزجاجية والكرتن وول" },
    text: { en: "Structural glazing with SG-50 silicone joints, Fortex systems and curved bays for villas, palaces and commercial buildings.", ar: "زجاج إنشائي بفواصل سيليكون SG-50 وأنظمة فورتكس وواجهات منحنية للفلل والقصور والمباني التجارية." },
    points: [
      { en: "Structural silicone glazing (SG-50)", ar: "زجاج إنشائي بفواصل سيليكون (SG-50)" },
      { en: "Fortex & curtain wall systems", ar: "أنظمة فورتكس والكرتن وول" },
      { en: "Curved and corner bay glazing", ar: "واجهات زجاجية منحنية وزوايا" },
      { en: "Black, blue, bronze & reflective glass", ar: "زجاج أسود وأزرق وبرونزي وعاكس" },
    ],
  },
  {
    key: "showers", image: "clear-shower-marble-bench",
    tag: { en: "Showers · partitions", ar: "شاور · قواطع" },
    title: { en: "Shower Enclosures & Glass Partitions", ar: "كبائن الشاور والقواطع الزجاجية" },
    text: { en: "Frameless and framed shower cabins, sliding showers and office partitions in tempered safety glass.", ar: "كبائن شاور بإطار وبدون إطار وشاور سحاب وقواطع مكاتب من زجاج السيكوريت الآمن." },
    points: [
      { en: "Hinged & sliding shower systems", ar: "أنظمة شاور مفصلية وسحاب" },
      { en: "Clear, frosted & striped films", ar: "زجاج شفاف ومطفي وستيكر مخطط" },
      { en: "Stainless steel & black hardware", ar: "إكسسوارات ستانلس ستيل وسوداء" },
      { en: "Office and shop glass partitions", ar: "قواطع زجاجية للمكاتب والمحلات" },
    ],
  },
  {
    key: "skylights", image: "pyramid-skylight",
    tag: { en: "Skylights · glass roofs", ar: "سكاي لايت · أسقف زجاجية" },
    title: { en: "Skylights & Glass Roofs", ar: "السكاي لايت والأسقف الزجاجية" },
    text: { en: "Pyramid, ridge and flat skylights that bring natural light deep into villas and stairwells.", ar: "سكاي لايت هرمي وجملوني ومسطح يُدخل الضوء الطبيعي إلى عمق الفلل وبيوت الدرج." },
    points: [
      { en: "Pyramid & hipped skylights", ar: "سكاي لايت هرمي ومائل" },
      { en: "Heat-reflective glass", ar: "زجاج عاكس للحرارة" },
      { en: "Watertight aluminium framing", ar: "إطارات ألمنيوم محكمة ضد التسرب" },
      { en: "Custom shapes & sizes", ar: "أشكال ومقاسات حسب الطلب" },
    ],
  },
  {
    key: "contracting", image: "facade-installation",
    tag: { en: "Design · contracting", ar: "تصميم · مقاولات" },
    title: { en: "Home Design & Contracting", ar: "تصميم المنازل والمقاولات" },
    text: { en: "Our expert engineers design and build complete homes and take full contracts — from structure to the final finish.", ar: "يصمم مهندسونا الخبراء المنازل وينفذونها بالكامل ونتولى العقود كاملة — من الهيكل حتى التشطيب النهائي." },
    points: [
      { en: "Architectural & structural design", ar: "تصميم معماري وإنشائي" },
      { en: "Turnkey villa & home contracting", ar: "مقاولات فلل ومنازل تسليم مفتاح" },
      { en: "Shop drawings & site supervision", ar: "مخططات تنفيذية وإشراف في الموقع" },
      { en: "Aluminium, glass & stone finishing", ar: "تشطيبات ألمنيوم وزجاج وحجر" },
    ],
  },
];

// Hotspots on /images/aluminium/modern-glass-villa.webp (x/y in % of the image).
export const aluHotspots: AluHotspot[] = [
  {
    x: 31, y: 28, work: "modern-villa-windows",
    title: { en: "Picture Windows", ar: "نوافذ بانورامية" },
    text: { en: "Large fixed glazing that frames the view and floods living spaces with light.", ar: "زجاج ثابت كبير يؤطر المنظر ويملأ المساحات بالضوء الطبيعي." },
  },
  {
    x: 70, y: 33, work: "bronze-glass-bay",
    title: { en: "Box & Bay Glazing", ar: "واجهات زجاجية بارزة" },
    text: { en: "Projecting glass bays with slim frames or silicone joints for a seamless look.", ar: "واجهات زجاجية بارزة بإطارات نحيفة أو فواصل سيليكون لمظهر متصل." },
  },
  {
    x: 25, y: 61, work: "pool-view-sliding-doors",
    title: { en: "Sliding Glass Walls", ar: "جدران زجاجية سحاب" },
    text: { en: "Wide sliding panels that open the living room to the garden and pool.", ar: "ألواح سحاب عريضة تفتح المعيشة على الحديقة والمسبح." },
  },
  {
    x: 63, y: 60, work: "arched-entrance-door",
    title: { en: "Entrance Doors", ar: "أبواب المداخل" },
    text: { en: "Glazed hinged doors with quality hardware — straight or arched.", ar: "أبواب زجاجية مفصلية بإكسسوارات عالية الجودة — مستقيمة أو مقوّسة." },
  },
  {
    x: 88, y: 61, work: "pool-house-glass-front", labelAbove: true,
    title: { en: "Corner Glass Fronts", ar: "واجهات زجاجية للزوايا" },
    text: { en: "Floor-to-ceiling corner glazing for majlis, lounges and pool houses.", ar: "زجاج من الأرض للسقف في الزوايا للمجالس والاستراحات وبيوت المسابح." },
  },
];
