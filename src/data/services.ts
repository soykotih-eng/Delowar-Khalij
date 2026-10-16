import type { L } from "@/lib/i18n";

export type Service = {
  slug: string;
  icon: "search" | "truck" | "stamp" | "container" | "package" | "hammer" | "sparkles" | "scale" | "users";
  title: L;
  text: L;
};

export const services: Service[] = [
  {
    slug: "inspection", icon: "search",
    title: { en: "Inspection", ar: "الفحص والمعاينة" },
    text: { en: "We check goods against your request to verify quantities, sizes and quality before delivery or shipment.", ar: "نفحص البضاعة وفق طلبك للتحقق من الكميات والمقاسات والجودة قبل التسليم أو الشحن." },
  },
  {
    slug: "shipping", icon: "truck",
    title: { en: "Shipping & Transport", ar: "الشحن والنقل" },
    text: { en: "Safe transport of slabs and blocks from the pickup point to your site, planned around the nature of the shipment.", ar: "نقل آمن للألواح والبلوكات من نقطة الاستلام إلى موقعك، وفق طبيعة الشحنة." },
  },
  {
    slug: "customs", icon: "stamp",
    title: { en: "Customs Clearance", ar: "التخليص الجمركي" },
    text: { en: "We handle customs formalities and documentation through to final clearance of your goods.", ar: "نتولى الإجراءات والمستندات الجمركية حتى الإفراج النهائي عن بضاعتك." },
  },
  {
    slug: "container-loading", icon: "container",
    title: { en: "Container Loading", ar: "تحميل الحاويات" },
    text: { en: "Professional loading and bracing of containers to suit the goods and transport requirements.", ar: "تحميل وتثبيت احترافي للحاويات بما يناسب البضاعة ومتطلبات النقل." },
  },
  {
    slug: "packing", icon: "package",
    title: { en: "Packing & Crating", ar: "التغليف والتعبئة" },
    text: { en: "Wooden bundles, A-frames and protective wrapping prepared to suit each product and journey.", ar: "حزم خشبية وحوامل وتغليف واقٍ يناسب كل منتج وكل رحلة شحن." },
  },
  {
    slug: "installation", icon: "hammer",
    title: { en: "Installation & Finishing", ar: "التركيب والتشطيب" },
    text: { en: "Experienced teams install floors, walls, stairs, kitchens and façades with clean, precise finishing.", ar: "فرق متخصصة لتركيب الأرضيات والحوائط والسلالم والمطابخ والواجهات بتشطيب دقيق ونظيف." },
  },
  {
    slug: "polishing", icon: "sparkles",
    title: { en: "Polishing & Crystallization", ar: "الجلي والتلميع والكريستال" },
    text: { en: "On-site grinding, polishing and crystallization that restores the original shine of marble floors.", ar: "جلي وتلميع وكريستال في الموقع يعيد لأرضيات الرخام لمعانها الأصلي." },
  },
  {
    slug: "legal", icon: "scale",
    title: { en: "Legal Services", ar: "الخدمات القانونية" },
    text: { en: "Legal advice on commercial dealings, supply contracts and disputes, provided by specialised partners.", ar: "استشارات قانونية في التعاملات التجارية وعقود التوريد والنزاعات عبر شركاء متخصصين." },
  },
  {
    slug: "dispute-resolution", icon: "users",
    title: { en: "Dispute Resolution Committee", ar: "لجنة فض النزاعات" },
    text: { en: "An independent paid committee reviews disputes after amicable settlement fails. It is not arbitration, and the right to go to court is preserved.", ar: "لجنة مستقلة مدفوعة تنظر في النزاع بعد تعذر التسوية الودية، وهي ليست تحكيمًا ولا حكمًا قضائيًا، ويظل حق اللجوء للقضاء محفوظًا." },
  },
];
