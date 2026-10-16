import type { L } from "@/lib/i18n";
import type { ColorKey, FinishKey, OriginKey, UnitKey, UsageKey } from "./attributes";
import { leafSlugs } from "./categories";

export type Product = {
  slug: string;
  sku: string;
  name: L;
  category: string;
  origin: OriginKey;
  color: ColorKey;
  finish: FinishKey;
  thickness: number | null; // cm, null = custom
  usage: UsageKey[];
  price: number | null; // base currency per unit, null = on request
  unit: UnitKey;
  inStock: boolean;
  featured?: boolean;
  short: L;
};

export const productImage = (slug: string) => `/images/products/${slug}.webp`;

export const products: Product[] = [
  // Marble
  {
    slug: "statuario-white", sku: "DK-MRB-101", category: "marble", origin: "italy", color: "white", finish: "polished",
    thickness: 2, usage: ["floors", "walls", "kitchens", "bathrooms"], price: 690, unit: "m2", inStock: true, featured: true,
    name: { en: "Statuario White", ar: "ستاتواريو أبيض" },
    short: { en: "Iconic Italian white marble with bold grey veining — the signature choice for luxury floors, walls and feature islands.", ar: "رخام إيطالي أبيض أيقوني بعروق رمادية جريئة — الخيار الأمثل للأرضيات والجدران والجزر الفاخرة." },
  },
  {
    slug: "carrara-white", sku: "DK-MRB-102", category: "marble", origin: "italy", color: "white", finish: "polished",
    thickness: 2, usage: ["floors", "walls", "bathrooms", "kitchens"], price: 280, unit: "m2", inStock: true, featured: true,
    name: { en: "Carrara White", ar: "كرارا أبيض" },
    short: { en: "Timeless soft-white marble with delicate feathered grey veins, ideal for elegant floors, bathrooms and vanity tops.", ar: "رخام أبيض ناعم خالد بعروق رمادية رقيقة، مثالي للأرضيات الأنيقة والحمامات وأسطح المغاسل." },
  },
  {
    slug: "nero-marquina", sku: "DK-MRB-103", category: "marble", origin: "spain", color: "black", finish: "polished",
    thickness: 2, usage: ["walls", "bathrooms", "floors", "decor"], price: 340, unit: "m2", inStock: true, featured: true,
    name: { en: "Nero Marquina", ar: "نيرو ماركينا" },
    short: { en: "Deep black Spanish marble with striking white veins that brings drama to bathrooms, feature walls and furniture.", ar: "رخام إسباني أسود عميق بعروق بيضاء لافتة يضفي فخامة على الحمامات والجدران المميزة وقطع الأثاث." },
  },
  {
    slug: "sunny-menia", sku: "DK-MRB-104", category: "marble", origin: "egypt", color: "beige", finish: "polished",
    thickness: 2, usage: ["floors", "stairs", "walls"], price: 95, unit: "m2", inStock: true, featured: true,
    name: { en: "Sunny Menia", ar: "صني منيا" },
    short: { en: "Warm golden-beige Egyptian marble with natural veining — a durable, budget-friendly favourite for floors and stairs.", ar: "رخام مصري بلون بيج ذهبي دافئ وعروق طبيعية — خيار اقتصادي ومتين للأرضيات والسلالم." },
  },
  {
    slug: "verde-guatemala", sku: "DK-MRB-105", category: "marble", origin: "india", color: "green", finish: "polished",
    thickness: 2, usage: ["kitchens", "walls", "decor"], price: 360, unit: "m2", inStock: true,
    name: { en: "Verde Guatemala", ar: "فيردي جواتيمالا" },
    short: { en: "Rich forest-green marble with white veining that makes a statement on kitchen islands, feature walls and décor.", ar: "رخام أخضر غني بعروق بيضاء يصنع حضورًا لافتًا في جزر المطابخ والجدران المميزة وقطع الديكور." },
  },
  {
    slug: "brazilian-blue", sku: "DK-MRB-106", category: "marble", origin: "brazil", color: "blue", finish: "polished",
    thickness: 2, usage: ["walls", "decor", "bathrooms"], price: 1450, unit: "m2", inStock: true, featured: true,
    name: { en: "Brazilian Blue", ar: "أزرق برازيلي" },
    short: { en: "Rare deep-blue exotic stone with crystalline depth, reserved for statement walls, vanities and bespoke furniture.", ar: "حجر نادر بلون أزرق عميق وعمق بلوري، مخصص للجدران المميزة والمغاسل وقطع الأثاث الحصرية." },
  },
  {
    slug: "rosa-portogallo", sku: "DK-MRB-107", category: "marble", origin: "portugal", color: "pink", finish: "honed",
    thickness: 2, usage: ["floors", "bathrooms", "walls"], price: 410, unit: "m2", inStock: true,
    name: { en: "Rosa Portogallo", ar: "روزا بورتوغالو" },
    short: { en: "Soft salmon-pink Portuguese marble with gentle movement, bringing warmth to bathrooms, floors and accent walls.", ar: "رخام برتغالي بلون وردي سلموني ناعم وحركة هادئة، يضفي دفئًا على الحمامات والأرضيات والجدران." },
  },
  {
    slug: "green-striped-onyx", sku: "DK-MRB-108", category: "marble", origin: "brazil", color: "green", finish: "polished",
    thickness: 2, usage: ["walls", "decor"], price: 1650, unit: "m2", inStock: false, featured: true,
    name: { en: "Green Striped Onyx", ar: "أونيكس أخضر مخطط" },
    short: { en: "Exotic banded green onyx with vivid natural stripes — spectacular when backlit on walls, bars and reception desks.", ar: "أونيكس أخضر فاخر بخطوط طبيعية زاهية — مذهل عند إضاءته من الخلف على الجدران والكاونترات ومكاتب الاستقبال." },
  },
  {
    slug: "honey-white-onyx", sku: "DK-MRB-109", category: "marble", origin: "iran", color: "beige", finish: "polished",
    thickness: 2, usage: ["walls", "decor", "bathrooms"], price: 980, unit: "m2", inStock: true,
    name: { en: "Honey White Onyx", ar: "أونيكس أبيض عسلي" },
    short: { en: "Translucent honey-white onyx with crystalline swirls that glows beautifully under light.", ar: "أونيكس شفاف بلون أبيض عسلي ودوامات بلورية يتوهج بجمال تحت الإضاءة." },
  },
  {
    slug: "silver-emperador", sku: "DK-MRB-110", category: "marble", origin: "turkey", color: "grey", finish: "polished",
    thickness: 2, usage: ["floors", "walls", "bathrooms"], price: 230, unit: "m2", inStock: true,
    name: { en: "Silver Emperador", ar: "إمبرادور فضي" },
    short: { en: "Elegant grey marble with fine golden and white veins, a modern alternative to classic Emperador.", ar: "رخام رمادي أنيق بعروق ذهبية وبيضاء دقيقة، بديل عصري للإمبرادور الكلاسيكي." },
  },
  // Granite
  {
    slug: "royal-red-granite", sku: "DK-GRN-201", category: "granite", origin: "india", color: "red", finish: "polished",
    thickness: 3, usage: ["kitchens", "facades", "floors", "stairs"], price: 180, unit: "m2", inStock: true, featured: true,
    name: { en: "Royal Red Granite", ar: "جرانيت رويال ريد" },
    short: { en: "Bold red granite with black and green crystals — extremely hard-wearing for countertops, stairs and façades.", ar: "جرانيت أحمر جريء ببلورات سوداء وخضراء — شديد التحمل لأسطح المطابخ والسلالم والواجهات." },
  },
  {
    slug: "red-aswan-granite", sku: "DK-GRN-202", category: "granite", origin: "egypt", color: "red", finish: "polished",
    thickness: 2, usage: ["floors", "stairs", "facades", "landscape"], price: 85, unit: "m2", inStock: true,
    name: { en: "Red Aswan Granite", ar: "جرانيت أحمر أسواني" },
    short: { en: "Classic fine-grained Egyptian red granite, prized for outdoor paving, stairs and building façades.", ar: "جرانيت مصري أحمر كلاسيكي ناعم الحبيبات، مثالي للأرضيات الخارجية والسلالم وواجهات المباني." },
  },
  {
    slug: "black-galaxy-granite", sku: "DK-GRN-203", category: "granite", origin: "india", color: "black", finish: "polished",
    thickness: 3, usage: ["kitchens", "floors", "bathrooms"], price: 260, unit: "m2", inStock: true, featured: true,
    name: { en: "Black Galaxy Granite", ar: "جرانيت بلاك جالاكسي" },
    short: { en: "Jet-black granite sparkling with bright flecks — the go-to choice for luxurious, low-maintenance kitchen tops.", ar: "جرانيت أسود لامع بنقاط متلألئة — الخيار الأول لأسطح المطابخ الفاخرة سهلة العناية." },
  },
  {
    slug: "safaga-white-granite", sku: "DK-GRN-204", category: "granite", origin: "egypt", color: "white", finish: "polished",
    thickness: 2, usage: ["floors", "kitchens", "stairs"], price: 90, unit: "m2", inStock: true,
    name: { en: "Safaga White Granite", ar: "جرانيت أبيض سفاجا" },
    short: { en: "Bright white granite with crisp black speckles, offering clean looks and excellent durability at a great price.", ar: "جرانيت أبيض ناصع بنقاط سوداء واضحة، يجمع بين المظهر النظيف والمتانة العالية وبسعر ممتاز." },
  },
  {
    slug: "halayeb-grey-granite", sku: "DK-GRN-205", category: "granite", origin: "egypt", color: "grey", finish: "flamed",
    thickness: 3, usage: ["landscape", "facades", "floors", "stairs"], price: 80, unit: "m2", inStock: true,
    name: { en: "Grey Halayeb Granite", ar: "جرانيت رمادي حلايب" },
    short: { en: "Uniform salt-and-pepper grey granite, available flamed for slip-resistant outdoor floors and stairs.", ar: "جرانيت رمادي متجانس بنقاط فاتحة وداكنة، متوفر بتشطيب مُلهّب لأرضيات وسلالم خارجية مانعة للانزلاق." },
  },
  {
    slug: "titanium-black-granite", sku: "DK-GRN-206", category: "granite", origin: "brazil", color: "black", finish: "leathered",
    thickness: 3, usage: ["kitchens", "walls", "decor"], price: 420, unit: "m2", inStock: false,
    name: { en: "Titanium Black Granite", ar: "جرانيت تيتانيوم أسود" },
    short: { en: "Dramatic black granite with flowing white and gold movement for show-stopping kitchen islands.", ar: "جرانيت أسود مميز بتموجات بيضاء وذهبية متدفقة لجزر مطابخ تخطف الأنظار." },
  },
  // Basalt
  {
    slug: "basalt-cobble-pavers", sku: "DK-BSL-301", category: "basalt", origin: "saudi", color: "grey", finish: "tumbled",
    thickness: null, usage: ["landscape", "floors"], price: null, unit: "m2", inStock: false, featured: true,
    name: { en: "Random Pattern Basalt Pavers", ar: "أرضية بازلت بنمط عشوائي" },
    short: { en: "Hard-wearing natural basalt pavers for driveways, garden paths and courtyards — cut to your required sizes.", ar: "أرضيات بازلت طبيعية شديدة التحمل لممرات السيارات والحدائق والأفنية — تُقص بالمقاسات المطلوبة." },
  },
  {
    slug: "black-basalt-tiles", sku: "DK-BSL-302", category: "basalt", origin: "saudi", color: "black", finish: "honed",
    thickness: 2, usage: ["floors", "walls", "landscape", "facades"], price: 150, unit: "m2", inStock: true,
    name: { en: "Black Basalt Tiles", ar: "بلاط بازلت أسود" },
    short: { en: "Honed black basalt tiles with a soft matte texture, perfect for contemporary interiors, pools and terraces.", ar: "بلاط بازلت أسود بتشطيب مطفي ناعم، مثالي للتصاميم العصرية وحمامات السباحة والتراسات." },
  },
  // Blocks
  {
    slug: "raw-marble-blocks", sku: "DK-BLK-401", category: "blocks", origin: "egypt", color: "white", finish: "natural",
    thickness: null, usage: [], price: null, unit: "m3", inStock: false,
    name: { en: "Raw Marble Blocks", ar: "بلوكات رخام خام" },
    short: { en: "Quarry-direct marble blocks for factories and processors, selected for size, soundness and colour consistency.", ar: "بلوكات رخام مباشرة من المحجر للمصانع والورش، مختارة بعناية من حيث الحجم والسلامة وثبات اللون." },
  },
  // Limestone
  {
    slug: "riyadh-limestone", sku: "DK-LMS-501", category: "limestone", origin: "saudi", color: "beige", finish: "natural",
    thickness: 3, usage: ["facades", "walls", "landscape"], price: 130, unit: "m2", inStock: true, featured: true,
    name: { en: "Riyadh Limestone Cladding", ar: "حجر رياض للواجهات" },
    short: { en: "Authentic Saudi limestone in warm desert tones — the classic choice for villa façades, boundary walls and courtyards.", ar: "حجر جيري سعودي أصيل بدرجات صحراوية دافئة — الخيار الكلاسيكي لواجهات الفلل والأسوار والأفنية." },
  },
  {
    slug: "ivory-wave-limestone", sku: "DK-LMS-502", category: "limestone", origin: "turkey", color: "beige", finish: "honed",
    thickness: 2, usage: ["floors", "walls", "bathrooms"], price: 160, unit: "m2", inStock: true,
    name: { en: "Ivory Wave Limestone", ar: "حجر جيري عاجي مموّج" },
    short: { en: "Creamy ivory limestone with soft wave patterns that creates calm, light-filled interiors.", ar: "حجر جيري بلون عاجي كريمي وتموجات ناعمة يمنح المساحات الداخلية هدوءًا وإشراقًا." },
  },
  // Terrazzo
  {
    slug: "classic-terrazzo", sku: "DK-TRZ-601", category: "terrazzo", origin: "local", color: "white", finish: "polished",
    thickness: 2, usage: ["floors", "walls", "bathrooms"], price: 150, unit: "m2", inStock: true,
    name: { en: "Classic White Terrazzo", ar: "تيرازو أبيض كلاسيك" },
    short: { en: "Crisp white terrazzo with black and terracotta chips, a modern classic for floors, walls and commercial spaces.", ar: "تيرازو أبيض بحبيبات سوداء وطوبية، كلاسيكية عصرية للأرضيات والجدران والمساحات التجارية." },
  },
  {
    slug: "venetian-terrazzo", sku: "DK-TRZ-602", category: "terrazzo", origin: "local", color: "multi", finish: "polished",
    thickness: 3, usage: ["floors", "stairs"], price: 210, unit: "m2", inStock: true,
    name: { en: "Venetian Terrazzo", ar: "تيرازو فينيسي" },
    short: { en: "Large-chip Venetian terrazzo blending marble fragments in rich tones for bold, durable floors.", ar: "تيرازو فينيسي بحبيبات رخامية كبيرة بألوان غنية لأرضيات جريئة ومتينة." },
  },
  // Quartz
  {
    slug: "cloud-white-quartz", sku: "DK-QTZ-701", category: "quartz", origin: "local", color: "white", finish: "polished",
    thickness: 2, usage: ["kitchens", "bathrooms"], price: 420, unit: "m2", inStock: true, featured: true,
    name: { en: "Cloud White Quartz", ar: "كوارتز أبيض غائم" },
    short: { en: "Non-porous engineered quartz with a soft cloudy marble look — stain-resistant and ideal for kitchen worktops.", ar: "كوارتز صناعي غير مسامي بمظهر رخامي غائم ناعم — مقاوم للبقع ومثالي لأسطح المطابخ." },
  },
  {
    slug: "sand-grey-quartz", sku: "DK-QTZ-702", category: "quartz", origin: "local", color: "grey", finish: "honed",
    thickness: 2, usage: ["kitchens", "bathrooms", "floors"], price: 380, unit: "m2", inStock: true,
    name: { en: "Sand Grey Quartz", ar: "كوارتز رمادي رملي" },
    short: { en: "Fine-grain grey quartz with a concrete-inspired finish for minimalist kitchens and vanities.", ar: "كوارتز رمادي ناعم الحبيبات بمظهر خرساني عصري للمطابخ والمغاسل البسيطة." },
  },
  // Artificial marble
  {
    slug: "gold-vein-artificial-marble", sku: "DK-ART-801", category: "artificial-marble", origin: "local", color: "white", finish: "polished",
    thickness: 1.8, usage: ["walls", "bathrooms", "decor"], price: 220, unit: "m2", inStock: true,
    name: { en: "Gold Vein Artificial Marble", ar: "رخام صناعي بعروق ذهبية" },
    short: { en: "Cost-effective artificial marble with luxurious white, grey and gold veining for walls and vanities.", ar: "رخام صناعي اقتصادي بعروق فاخرة بيضاء ورمادية وذهبية للجدران والمغاسل." },
  },
  // Stone products
  {
    slug: "grey-split-face-stone", sku: "DK-SPF-901", category: "split-face", origin: "local", color: "grey", finish: "split",
    thickness: null, usage: ["walls", "facades", "landscape"], price: 140, unit: "m2", inStock: true, featured: true,
    name: { en: "Grey Split-Face Stone", ar: "حجر سبليت فيس رمادي" },
    short: { en: "Stacked split-face panels with a rugged natural texture for feature walls, fences and exterior cladding.", ar: "ألواح حجرية سبليت فيس بملمس طبيعي خشن للجدران المميزة والأسوار وتكسيات الواجهات." },
  },
  {
    slug: "palladiana-marble-mosaic", sku: "DK-MOS-902", category: "mosaic", origin: "local", color: "multi", finish: "polished",
    thickness: 2, usage: ["floors", "walls", "bathrooms"], price: 260, unit: "m2", inStock: true,
    name: { en: "Palladiana Marble Mosaic", ar: "موزاييك رخام بالاديانا" },
    short: { en: "Hand-laid mosaic of irregular marble fragments that adds artisan character to floors and walls.", ar: "موزاييك يدوي من قطع رخام غير منتظمة يضفي طابعًا حرفيًا مميزًا على الأرضيات والجدران." },
  },
  {
    slug: "rustic-cone-stone", sku: "DK-CON-903", category: "cone-stone", origin: "local", color: "multi", finish: "natural",
    thickness: null, usage: ["walls", "facades", "landscape"], price: 120, unit: "m2", inStock: true,
    name: { en: "Rustic Cone Stone", ar: "حجر كون ريفي" },
    short: { en: "Hand-dressed cone stones in mixed natural colours for rustic walls, villas and garden features.", ar: "أحجار كون مشغولة يدويًا بألوان طبيعية متنوعة للجدران الريفية والفلل وعناصر الحدائق." },
  },
  {
    slug: "waterjet-floral-inlay", sku: "DK-WJT-904", category: "waterjet", origin: "local", color: "white", finish: "polished",
    thickness: 2, usage: ["floors", "stairs", "decor"], price: null, unit: "m2", inStock: false, featured: true,
    name: { en: "Waterjet Floral Inlay", ar: "ترصيع ووترجت بزخارف نباتية" },
    short: { en: "Precision waterjet-cut marble inlays with floral motifs for entrances, stairs and medallions.", ar: "ترصيعات رخامية مقصوصة بالووترجت بدقة وبزخارف نباتية للمداخل والسلالم والميداليات." },
  },
  {
    slug: "cnc-floral-panel", sku: "DK-CNC-905", category: "cnc-carved", origin: "local", color: "white", finish: "carved",
    thickness: 3, usage: ["walls", "decor"], price: null, unit: "piece", inStock: false,
    name: { en: "CNC Carved Floral Panel", ar: "لوحة حفر CNC بزخارف نباتية" },
    short: { en: "CNC-carved stone panel with deep floral relief — made to measure for feature walls and majlis interiors.", ar: "لوحة حجرية محفورة بالـCNC بنقوش نباتية بارزة — تُصنع حسب المقاس للجدران المميزة والمجالس." },
  },
  {
    slug: "arabesque-wet-cast-panel", sku: "DK-WCS-906", category: "wet-cast", origin: "local", color: "beige", finish: "natural",
    thickness: null, usage: ["walls", "facades", "decor"], price: 260, unit: "m2", inStock: true,
    name: { en: "Arabesque Wet-Cast Panel", ar: "لوحة أرابيسك مصبوبة" },
    short: { en: "Wet-cast stone panels with intricate arabesque patterns, ideal for façades, screens and boundary walls.", ar: "ألواح حجر مصبوب بزخارف أرابيسك دقيقة، مثالية للواجهات والسواتر والأسوار." },
  },
  {
    slug: "hand-carved-floral-relief", sku: "DK-HCV-907", category: "hand-carved", origin: "local", color: "beige", finish: "carved",
    thickness: null, usage: ["walls", "decor"], price: null, unit: "piece", inStock: false,
    name: { en: "Hand-Carved Floral Relief", ar: "نقش حجري يدوي بزخارف نباتية" },
    short: { en: "Bespoke hand-carved stone relief by master craftsmen — a unique centrepiece for palaces, villas and mosques.", ar: "نقش حجري يدوي حسب الطلب بأيدي حرفيين مهرة — قطعة فنية فريدة للقصور والفلل والمساجد." },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsInCategory = (slug: string) => {
  const leaves = leafSlugs(slug);
  return products.filter((p) => leaves.includes(p.category));
};

/** Priced slabs that can be used for kitchen worktops. */
export const kitchenMaterials = products.filter((p) => p.price !== null && p.usage.includes("kitchens"));
export const pricedProducts = products.filter((p) => p.price !== null);
