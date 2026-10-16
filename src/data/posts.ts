import type { L } from "@/lib/i18n";

export type Post = {
  slug: string;
  date: string;
  image: string;
  readMinutes: number;
  topic: L;
  title: L;
  excerpt: L;
  sections: { heading: L; body: L }[];
};

export const posts: Post[] = [
  {
    slug: "marble-vs-granite-vs-quartz-for-kitchens",
    date: "2026-10-10",
    image: "/images/scenes/kitchen-white.webp",
    readMinutes: 5,
    topic: { en: "Kitchens", ar: "المطابخ" },
    title: { en: "Marble, Granite or Quartz: Which Worktop Suits Your Kitchen?", ar: "رخام أم جرانيت أم كوارتز: أي سطح يناسب مطبخك؟" },
    excerpt: {
      en: "A practical comparison of the three most popular kitchen worktop materials — durability, maintenance, looks and budget.",
      ar: "مقارنة عملية بين أشهر ثلاث خامات لأسطح المطابخ من حيث المتانة والعناية والشكل والميزانية.",
    },
    sections: [
      {
        heading: { en: "Granite: the hard-working classic", ar: "الجرانيت: الكلاسيكي العملي" },
        body: {
          en: "Granite is one of the hardest natural stones available. It resists heat, scratches and daily wear, which makes it the most practical choice for busy family kitchens. Darker granites such as Black Galaxy hide marks especially well, and a simple sealing once a year keeps the surface protected.",
          ar: "الجرانيت من أصلب الأحجار الطبيعية، فهو يتحمل الحرارة والخدوش والاستخدام اليومي، مما يجعله الخيار الأكثر عملية لمطابخ العائلات المزدحمة. وتُخفي ألوان الجرانيت الداكنة مثل بلاك جالاكسي العلامات بشكل ممتاز، ويكفي عزل السطح مرة واحدة سنويًا للحفاظ عليه.",
        },
      },
      {
        heading: { en: "Marble: unmatched elegance", ar: "الرخام: أناقة لا تُضاهى" },
        body: {
          en: "Nothing matches the depth and veining of real marble. It is softer than granite and more sensitive to acids such as lemon juice and vinegar, so it suits homeowners who appreciate a natural patina over time. Honed finishes hide etching better than polished ones.",
          ar: "لا شيء يضاهي عمق الرخام الطبيعي وجمال عروقه. لكنه أقل صلابة من الجرانيت وأكثر حساسية للأحماض مثل الليمون والخل، لذلك يناسب من يقدّر التغيّر الطبيعي للسطح مع الوقت. والتشطيب المطفي يُخفي آثار الأحماض أفضل من اللامع.",
        },
      },
      {
        heading: { en: "Quartz: low maintenance, consistent colour", ar: "الكوارتز: عناية أقل ولون ثابت" },
        body: {
          en: "Engineered quartz is non-porous, so it never needs sealing and resists stains. Colours are consistent from slab to slab, which helps on large projects. It should be protected from very hot pans and direct, prolonged sunlight.",
          ar: "الكوارتز الصناعي غير مسامي، فلا يحتاج إلى عزل ويقاوم البقع، كما أن ألوانه ثابتة من لوح لآخر، وهذا مفيد في المشاريع الكبيرة. لكن يجب حمايته من الأواني شديدة السخونة وأشعة الشمس المباشرة لفترات طويلة.",
        },
      },
      {
        heading: { en: "How to decide", ar: "كيف تختار؟" },
        body: {
          en: "Start with how you cook, then your budget and style. Use our Kitchen Cost Calculator to compare materials using your real measurements, or send us your drawings and our team will prepare a detailed quotation.",
          ar: "ابدأ بطريقة استخدامك للمطبخ، ثم الميزانية والطابع المطلوب. استخدم حاسبة تكلفة المطبخ لمقارنة الخامات بمقاساتك الفعلية، أو أرسل لنا الرسومات وسيُعد فريقنا عرض سعر تفصيليًا.",
        },
      },
    ],
  },
  {
    slug: "guide-to-stone-finishes",
    date: "2026-10-09",
    image: "/images/scenes/stone-columns.webp",
    readMinutes: 4,
    topic: { en: "Materials", ar: "الخامات" },
    title: { en: "Polished, Honed, Flamed or Leathered? A Guide to Stone Finishes", ar: "لامع أم مطفي أم مُلهّب أم جلدي؟ دليلك لتشطيبات الحجر" },
    excerpt: {
      en: "The finish changes how a stone looks, feels and performs. Here is how to choose the right one for each space.",
      ar: "التشطيب يغيّر شكل الحجر وملمسه وأداءه. إليك كيف تختار التشطيب المناسب لكل مساحة.",
    },
    sections: [
      {
        heading: { en: "Polished", ar: "التشطيب اللامع" },
        body: {
          en: "A mirror-like surface that intensifies colour and veining. Ideal for walls, vanities and indoor floors in low-traffic areas. Polished floors can be slippery when wet, so avoid them for bathrooms and entrances.",
          ar: "سطح عاكس كالمرآة يُبرز الألوان والعروق. مثالي للجدران والمغاسل والأرضيات الداخلية قليلة الحركة. لكن الأرضيات اللامعة قد تكون زلقة عند البلل، لذا يُفضّل تجنبها في الحمامات والمداخل.",
        },
      },
      {
        heading: { en: "Honed", ar: "التشطيب المطفي" },
        body: {
          en: "A smooth, matte surface with a soft, contemporary look. Honed stone shows fewer scratches and etch marks, making it a great choice for kitchens and busy floors.",
          ar: "سطح ناعم غير لامع بطابع عصري هادئ. يُظهر الحجر المطفي خدوشًا وآثار أحماض أقل، مما يجعله خيارًا ممتازًا للمطابخ والأرضيات كثيرة الحركة.",
        },
      },
      {
        heading: { en: "Flamed and tumbled", ar: "المُلهّب والمعتّق" },
        body: {
          en: "Flaming uses intense heat to create a rough, slip-resistant texture — perfect for granite paving, stairs and pool decks. Tumbling softens edges for a weathered, rustic character.",
          ar: "يعتمد التلهيب على حرارة عالية لإنتاج ملمس خشن مانع للانزلاق، وهو مثالي لأرضيات الجرانيت الخارجية والسلالم ومحيط حمامات السباحة. أما التعتيق فيُنعّم الحواف ليمنح الحجر طابعًا ريفيًا قديمًا.",
        },
      },
      {
        heading: { en: "Leathered", ar: "التشطيب الجلدي" },
        body: {
          en: "A soft-touch texture that follows the natural relief of the stone. It hides fingerprints and water spots, and is increasingly popular on dark granite kitchen islands.",
          ar: "ملمس ناعم يتبع التضاريس الطبيعية للحجر، ويُخفي بصمات الأصابع وبقع الماء، وقد أصبح شائعًا جدًا في جزر المطابخ المصنوعة من الجرانيت الداكن.",
        },
      },
    ],
  },
  {
    slug: "caring-for-natural-stone-in-hot-climates",
    date: "2026-10-08",
    image: "/images/scenes/bathroom-light.webp",
    readMinutes: 4,
    topic: { en: "Maintenance", ar: "العناية" },
    title: { en: "How to Care for Natural Stone in Hot Climates", ar: "كيف تعتني بالحجر الطبيعي في الأجواء الحارة" },
    excerpt: {
      en: "Heat, dust and hard water are tough on stone surfaces. Follow these simple habits to keep marble and granite looking new.",
      ar: "الحرارة والغبار والمياه العسرة تؤثر على أسطح الحجر. اتبع هذه العادات البسيطة ليبقى الرخام والجرانيت كالجديد.",
    },
    sections: [
      {
        heading: { en: "Seal regularly", ar: "اعزل السطح بانتظام" },
        body: {
          en: "A quality penetrating sealer protects stone from stains and moisture. Most marbles need resealing every 6–12 months, while dense granites can go longer. A quick water-drop test shows when it is time.",
          ar: "يحمي العازل المخترق عالي الجودة الحجر من البقع والرطوبة. يحتاج معظم الرخام إلى إعادة العزل كل 6 إلى 12 شهرًا، بينما يتحمل الجرانيت الكثيف مدة أطول. واختبار قطرة الماء البسيط يخبرك بموعد إعادة العزل.",
        },
      },
      {
        heading: { en: "Clean gently", ar: "نظّف بلطف" },
        body: {
          en: "Use pH-neutral stone cleaners and soft microfibre cloths. Avoid vinegar, lemon and bleach-based products, which dull polished marble. Sweep sand and dust often — it acts like sandpaper underfoot.",
          ar: "استخدم منظفات متعادلة مخصصة للحجر وقطع قماش ناعمة من الألياف الدقيقة. وتجنب الخل والليمون والمنتجات المحتوية على الكلور لأنها تُفقد الرخام لمعانه. واكنس الرمل والغبار باستمرار فهو يعمل كورق الصنفرة تحت الأقدام.",
        },
      },
      {
        heading: { en: "Handle hard water", ar: "تعامل مع المياه العسرة" },
        body: {
          en: "Mineral deposits leave white spots around sinks and showers. Wipe surfaces dry after use and use a dedicated stone-safe limescale remover when needed.",
          ar: "تترك الأملاح المعدنية بقعًا بيضاء حول المغاسل والدش. جفف الأسطح بعد الاستخدام، واستخدم مزيلًا للترسبات آمنًا على الحجر عند الحاجة.",
        },
      },
      {
        heading: { en: "Restore when needed", ar: "الجلي والتلميع عند الحاجة" },
        body: {
          en: "Over time, professional polishing and crystallization bring back the original shine of marble floors. Our team provides on-site polishing and restoration services.",
          ar: "مع مرور الوقت، يعيد الجلي والتلميع والكريستال الاحترافي اللمعان الأصلي لأرضيات الرخام. ويوفر فريقنا خدمات الجلي والتلميع والترميم في الموقع.",
        },
      },
    ],
  },
  {
    slug: "how-to-choose-marble-for-your-home",
    date: "2026-10-06",
    image: "/images/scenes/kitchen-island.webp",
    readMinutes: 5,
    topic: { en: "Buying Guide", ar: "دليل الشراء" },
    title: { en: "How to Choose the Right Marble for Your Home", ar: "كيف تختار الرخام المناسب لمنزلك" },
    excerpt: {
      en: "From colour and veining to thickness and grade — the key points to check before you buy marble for any project.",
      ar: "من اللون والعروق إلى السُمك والدرجة — أهم النقاط التي يجب مراجعتها قبل شراء الرخام لأي مشروع.",
    },
    sections: [
      {
        heading: { en: "Start with the space", ar: "ابدأ بالمساحة" },
        body: {
          en: "Floors, walls, stairs and countertops each have different demands. High-traffic floors need harder, honed stones, while feature walls are the perfect place for dramatic, exotic slabs.",
          ar: "لكل من الأرضيات والجدران والسلالم والأسطح متطلبات مختلفة. فالأرضيات كثيرة الحركة تحتاج إلى أحجار أكثر صلابة بتشطيب مطفي، بينما الجدران المميزة هي المكان المثالي للألواح النادرة اللافتة.",
        },
      },
      {
        heading: { en: "See the real slabs", ar: "شاهد الألواح الحقيقية" },
        body: {
          en: "Natural stone varies from block to block. Always approve the actual slabs or high-resolution photos of your batch before cutting, especially for book-matched walls and large open areas.",
          ar: "يختلف الحجر الطبيعي من بلوك لآخر، لذا احرص دائمًا على اعتماد الألواح الفعلية أو صور عالية الدقة للدفعة الخاصة بك قبل القص، خاصة للجدران المتطابقة والمساحات الكبيرة المفتوحة.",
        },
      },
      {
        heading: { en: "Check thickness and grade", ar: "تحقق من السُمك والدرجة" },
        body: {
          en: "2 cm slabs suit most floors and walls, while 3 cm is preferred for worktops and stairs. Ask about the grade, filling and backing mesh — premium grades have fewer repairs and more consistent colour.",
          ar: "تناسب ألواح 2 سم معظم الأرضيات والجدران، بينما يُفضّل سُمك 3 سم للأسطح والسلالم. واسأل عن درجة الرخام ونسبة المعالجة والشبك الخلفي، فالدرجات الممتازة تحتوي على معالجات أقل وألوان أكثر تجانسًا.",
        },
      },
      {
        heading: { en: "Plan for waste and installation", ar: "خطط للهالك والتركيب" },
        body: {
          en: "Add 8–15% for cutting waste depending on layout. Professional installation with the right adhesive and expansion joints is as important as the stone itself.",
          ar: "أضف من 8 إلى 15% كنسبة هالك للقص حسب التصميم. والتركيب الاحترافي باستخدام اللاصق المناسب وفواصل التمدد لا يقل أهمية عن الحجر نفسه.",
        },
      },
    ],
  },
  {
    slug: "importing-natural-stone-guide",
    date: "2026-10-04",
    image: "/images/scenes/quarry-underground.webp",
    readMinutes: 6,
    topic: { en: "Trade & Export", ar: "التجارة والتصدير" },
    title: { en: "Importing Natural Stone: A Practical Guide for Contractors", ar: "استيراد الحجر الطبيعي: دليل عملي للمقاولين" },
    excerpt: {
      en: "Inspection, packing, shipping and customs — what to plan when importing marble and granite for large projects.",
      ar: "الفحص والتغليف والشحن والجمارك — ما الذي يجب التخطيط له عند استيراد الرخام والجرانيت للمشاريع الكبيرة.",
    },
    sections: [
      {
        heading: { en: "Define clear specifications", ar: "حدد مواصفات واضحة" },
        body: {
          en: "Write down the material name, origin, grade, finish, thickness, sizes and tolerances. Clear specifications are the basis for fair offers and protect both buyer and supplier.",
          ar: "دوّن اسم الخامة وبلد المنشأ والدرجة والتشطيب والسُمك والمقاسات والتفاوتات المسموحة. فالمواصفات الواضحة هي أساس العروض العادلة وتحمي المشتري والمورد معًا.",
        },
      },
      {
        heading: { en: "Inspect before loading", ar: "افحص قبل التحميل" },
        body: {
          en: "Pre-shipment inspection checks quantities, colour consistency and defects before the goods leave the factory. It is far cheaper than solving problems after arrival.",
          ar: "يتحقق الفحص قبل الشحن من الكميات وتجانس الألوان والعيوب قبل خروج البضاعة من المصنع، وهو أقل تكلفة بكثير من حل المشكلات بعد الوصول.",
        },
      },
      {
        heading: { en: "Pack and load correctly", ar: "التغليف والتحميل الصحيح" },
        body: {
          en: "Slabs should travel in fumigated wooden bundles or A-frames, properly braced inside the container. Correct packing prevents breakage and makes unloading safer.",
          ar: "يجب شحن الألواح في حزم خشبية معالجة أو حوامل على شكل حرف A، مع تثبيتها جيدًا داخل الحاوية. فالتغليف الصحيح يمنع الكسر ويجعل التفريغ أكثر أمانًا.",
        },
      },
      {
        heading: { en: "Prepare customs documents early", ar: "جهّز مستندات الجمارك مبكرًا" },
        body: {
          en: "Commercial invoice, packing list, certificate of origin and bill of lading are the essentials. Our logistics partners handle shipping and customs clearance end-to-end.",
          ar: "الفاتورة التجارية وقائمة التعبئة وشهادة المنشأ وبوليصة الشحن هي المستندات الأساسية. ويتولى شركاؤنا في الخدمات اللوجستية الشحن والتخليص الجمركي من البداية إلى النهاية.",
        },
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
