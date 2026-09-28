import { contactLinks } from "@/data/contact";
import type { Dictionary } from "./types";

/**
 * Arabic dictionary. Brand and technology names (React, Next.js, WordPress …)
 * are intentionally left in Latin script, matching how they're written in
 * Arabic technical writing. Digits stay Western (2024) for the same reason.
 */
export const ar: Dictionary = {
  name: "عبد الرحمن البّري",
  dir: "rtl",
  switchLabel: "English",
  switchGlyph: "EN",
  switchAria: "التبديل إلى الإنجليزية",

  nav: [
    { label: "نبذة", href: "#about" },
    { label: "الخدمات", href: "#services" },
    { label: "المهارات", href: "#techstack" },
    { label: "المشاريع", href: "#projects" },
    { label: "الخبرة", href: "#experience" },
    { label: "الأسئلة الشائعة", href: "#faq" },
    { label: "تواصل", href: "#contact" },
  ],
  logo: { primary: "البّري", secondary: "مطوّر Full-Stack" },
  skipToContent: "تخطَّ إلى المحتوى",
  homeAria: "عبد الرحمن البّري — الصفحة الرئيسية",
  navAria: "الرئيسية",
  menuOpen: "افتح القائمة",
  menuClose: "أغلق القائمة",

  hero: {
    kicker: "Next.js · Headless WordPress",
    titleLines: ["عبد الرحمن", "البّري"],
    roles: ["مهندس برمجيات ومطوّر Full-Stack"],
    tagline:
      "أبني مواقع وتطبيقات ويب متكاملة من الألف إلى الياء باستخدام Next.js و React وووردبريس Headless — من التصميم والتطوير إلى إدارة المحتوى والربط مع الخدمات والإطلاق.",
    viewProjects: "عرض المشاريع",
    contactMe: "تواصل معي",
    scroll: "مرّر للأسفل",
  },

  about: {
    eyebrow: "نبذة",
    heading:
      "بناء حلول ويب متكاملة، من الفكرة الأولى حتى الإطلاق.",
    paragraphs: [
      "أنا مطوّر Full-Stack وطالب هندسة برمجيات بخبرة تزيد عن عامين في بناء مواقع وتطبيقات ويب للشركات والمؤسسات.",
      "أعمل بـ Next.js و React و TypeScript وووردبريس Headless لبناء حلول ويب متكاملة — من تخطيط البنية وتطوير الواجهة إلى ربط أنظمة إدارة المحتوى والـ APIs ولوحات التحكم والربط مع الخدمات الخارجية وتحسين الأداء والنشر.",
      "عملت على مشاريع لعملاء دوليين في ألمانيا والسعودية والإمارات والعراق، تشمل متاجر إلكترونية ومواقع شركات ومنصّات حجز ولوحات تحكم مخصّصة.",
      "أركّز على بناء مواقع ليست حديثة ومتجاوبة فحسب، بل سهلة الإدارة وسريعة ومتوافقة مع أهداف العمل.",
    ],
    facts: [
      { value: "+2", label: "سنوات الخبرة" },
      { value: "+7", label: "مشاريع منجزة" },
      { value: "E2E", label: "تسليم متكامل من الفكرة للإطلاق" },
      { value: "International", label: "عملاء دوليون" },
    ],
  },

  services: {
    eyebrow: "الخدمات",
    title: "ما الذي يمكنني مساعدتك في بنائه.",
    items: [
      {
        index: "01",
        title: "تطوير مواقع متكاملة من الألف إلى الياء",
        description:
          "من الفكرة حتى الإطلاق: تصميم الواجهات، وواجهة سريعة مبنية بـ Next.js، ونظام خلفي Headless WordPress مع لوحة تحكم مخصّصة تديرها بنفسك، والنشر مع الدومين وشهادة SSL. مواقع الشركات ومنصات الحجز والمواقع القائمة على المحتوى.",
      },
      {
        index: "02",
        title: "تطوير المتاجر الإلكترونية",
        description:
          "متاجر إلكترونية متكاملة مبنية بـ Next.js وHeadless WooCommerce: كتالوج المنتجات، والبحث والتصفية، وعربة التسوق، وإتمام الشراء، وحسابات العملاء، وتتبع الطلبات، والربط مع بوابات الدفع مثل Stripe.",
      },
      {
        index: "03",
        title: "لوحات تحكم مخصّصة وربط مع الخدمات",
        description:
          "لوحات تحكم مخصّصة لإدارة المحتوى والحجوزات والبيانات دون لمس الكود، مع الربط مع بوابات الدفع وأنظمة الحجز والبريد الإلكتروني ومساعدات الذكاء الاصطناعي.",
      },
    ],
  },

  projects: {
    eyebrow: "أعمال مختارة",
    title: "مشاريع بنيتُها، من الهدف إلى الإطلاق.",
    roleLabel: "الدور",
    items: [
      {
        title: "DigitStone",
        tag: "مواقع شركات / Next.js",
        description:
          "موقع لشركة برمجيات ألمانية، بنيته بالكامل باستخدام Next.js وHeadless WordPress: عرض ديناميكي للخدمات ودراسات الحالة، ودعم تعدد اللغات، ونظام لحجز المواعيد، ولوحة تحكم مخصصة لإدارة المحتوى دون الحاجة لتعديل الكود.",
        tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS"],
        links: [{ label: "زيارة الموقع المباشر", href: "https://digitstone.tech/" }],
        image: "/projects/digitstone.png",
        country: "ألمانيا",
        role: "تطوير Full-Stack",
      },
      {
        title: "Nextzett",
        tag: "تجارة إلكترونية / Next.js",
        description:
          "منصة تجارة إلكترونية لعلامة تجارية للعناية بالسيارات، بنيتها بالكامل باستخدام Next.js وHeadless WordPress مع WooCommerce: تصفح المنتجات، والبحث والتصفية، وعربة التسوق، وإتمام الشراء، وحسابات العملاء، وتتبع الطلبات، والدفع عبر Stripe.",
        tech: ["Next.js", "TypeScript", "Headless WordPress", "WooCommerce", "Stripe", "Tailwind CSS"],
        links: [{ label: "قريباً", href: "" }],
        image: "/projects/nextzett.png",
        country: "العراق",
        role: "تطوير Full-Stack",
      },
      {
        title: "Bombo Car Wash",
        tag: "حجوزات / Next.js",
        description:
          "منصة لخدمات غسيل السيارات، بنيتها بالكامل باستخدام Next.js وHeadless WordPress: نظام حجز مواعيد متعدد الخطوات، وإدارة ديناميكية للخدمات، وآراء العملاء، ولوحة تحكم مخصصة لإدارة محتوى الموقع والحجوزات.",
        tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS", "Framer Motion"],
        links: [{ label: "قريباً", href: "" }],
        image: "/projects/bombo.png",
        country: "العراق",
        role: "تطوير Full-Stack",
      },
      {
        title: "MAHAM",
        tag: "مواقع شركات / Next.js",
        description:
          "موقع لعرض أعمال شركة هندسية، بنيته بالكامل باستخدام Next.js وHeadless WordPress: عرض ديناميكي لمحتوى المشاريع، ودعم تعدد اللغات، ولوحة تحكم مخصصة لإدارة محتوى الموقع.",
        tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS"],
        links: [{ label: "زيارة الموقع المباشر", href: "https://mahameng.com/" }],
        image: "/projects/maham.png",
        country: "إيطاليا",
        role: "تطوير Full-Stack",
      },
      {
        title: "Marasil",
        tag: "خدمات لوجستية / React.js",
        description:
          "منصة لوجستية لإدارة الشحنات وأسعار الشحن وتتبع الطلبات، والتكامل مع كبرى منصات التجارة الإلكترونية والتوصيل. عملت على الواجهة الأمامية بـ React وربطها مع الـ REST APIs الخاصة بالمنصة.",
        tech: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
        links: [{ label: "زيارة الموقع المباشر", href: "https://www.marasil.sa/" }],
        image: "/projects/marasil.png",
        country: "السعودية",
        role: "تطوير الواجهة الأمامية (React)",
      },
      {
        title: "Aurodia",
        tag: "تجارة إلكترونية / WordPress",
        description:
          "موقع تجارة إلكترونية لمجوهرات فاخرة مبني بـ WordPress وWooCommerce، يتضمّن استكشاف المنتجات، وتجربة تسوّق متجاوبة، وحسابات للعملاء، ومسار دفع متكامل.",
        tech: ["WordPress", "WooCommerce", "Elementor", "JavaScript"],
        links: [{ label: "زيارة الموقع المباشر", href: "https://aurodia.de/" }],
        image: "/projects/aurodia.png",
        country: "ألمانيا",
        role: "تطوير WordPress",
      },
      {
        title: "Terra Group",
        tag: "مواقع شركات / React.js",
        description:
          "موقع شركة لمكتب استشارات هندسية وتصميم. بنيت الواجهة الأمامية بـ React وTypeScript بتخطيطات متجاوبة ومكوّنات واجهة قابلة لإعادة الاستخدام.",
        tech: ["React", "TypeScript", "Tailwind CSS"],
        links: [{ label: "زيارة الموقع المباشر", href: "https://beta.terragroup.ae/" }],
        image: "/projects/terra.png",
        country: "الإمارات",
        role: "تطوير الواجهة الأمامية (React)",
      },
      {
        title: "PPSMS",
        tag: "نظام إدارة / React.js",
        description:
          "نظام لإدارة جمعية غير ربحية في ماليزيا: طلبات الأعضاء، وبيانات الأزواج والعائلات، والوثائق، ومتابعة حالات IMM13 وبطاقات UNHCR، وتوليد ملفات PDF، والتقارير وإحصائيات البرامج. بنيت الواجهة الأمامية بـ React وMaterial UI.",
        tech: ["React.js", "Material UI"],
        links: [{ label: "نظام داخلي", href: "" }],
        image: "/projects/ppsms.png",
        country: "ماليزيا",
        role: "تطوير الواجهة الأمامية (React)",
      },
    ],
  },

  experience: {
    eyebrow: "الخبرة والتعليم",
    title: "مسار صنعه البناء والتعلّم.",
    items: [
      {
        date: "2024 — الآن",
        role: "مطوّر Full-Stack",
        description:
          "بناء مواقع وتطبيقات ويب متكاملة للشركات والمؤسسات، والعمل على كامل مراحل التطوير من التخطيط وتنفيذ الواجهات إلى ربط أنظمة إدارة المحتوى والـ APIs ولوحات التحكم والربط مع الخدمات والأداء والنشر.",
      },
      {
        date: "2022 — الآن",
        role: "طالب هندسة برمجيات",
        org: "جامعة قاسيون الخاصة",
        description:
          "أتابع دراسة البكالوريوس في هندسة البرمجيات، مع التركيز على تطوير البرمجيات، وتقنيات الويب، والتعلم العملي القائم على المشاريع.",
      },
    ],
  },

  techStack: {
    eyebrow: "التقنيات",
    title: "التقنيات التي أبني بها.",
    groups: [
      {
        title: "الواجهة الأمامية",
        items: ["React.js", "Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "React Query"],
      },
      {
        title: "الخلفية والـ APIs",
        items: ["Next.js API Routes", "Server Components", "REST APIs", "المصادقة والـ Middleware"],
      },
      {
        title: "إدارة المحتوى والتجارة الإلكترونية",
        items: ["Headless WordPress", "WordPress", "WooCommerce", "لوحات تحكم مخصّصة"],
      },
      {
        title: "الربط مع الخدمات",
        items: ["مدفوعات Stripe", "البريد / SMTP", "مساعدات ذكاء اصطناعي", "أنظمة الحجز"],
      },
      {
        title: "النشر والاستضافة",
        items: ["Netlify", "Vercel", "الدومين و DNS و SSL", "Git و GitHub"],
      },
      {
        title: "الممارسات",
        items: ["الأداء", "تحسين محركات البحث", "سهولة الوصول", "تصميم متجاوب"],
      },
    ],
  },

  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات قبل أن تسأل.",
    items: [
      {
        index: "01",
        question: "ماذا يشمل العمل «من الألف إلى الياء»؟",
        answer:
          "كل ما يحتاجه موقعك من الفكرة حتى الإطلاق: التخطيط، والتصميم، والتطوير، ولوحة تحكم مخصّصة، والربط مع خدمات مثل الدفع والحجز، ونشر الموقع على الدومين الخاص بك. تتعامل مع شخص واحد طوال المشروع.",
      },
      {
        index: "02",
        question: "هل أستطيع تعديل المحتوى بنفسي؟",
        answer:
          "نعم. أبني لك لوحة تحكم بسيطة مصمّمة لموقعك، فتعدّل النصوص والصور والخدمات والمشاريع بنفسك دون لمس الكود.",
      },
      {
        index: "03",
        question: "لماذا Next.js مع Headless WordPress؟",
        answer:
          "Next.js يجعل موقعك سريعاً وآمناً وسهل الظهور في جوجل، وWordPress يعمل في الخلفية لحفظ المحتوى وإدارته بشكل موثوق. فتحصل على السرعة ونظام مجرّب في الوقت نفسه.",
      },
      {
        index: "04",
        question: "كم يستغرق المشروع، وكم يكلّف؟",
        answer:
          "يعتمد ذلك على حجم المشروع وميزاته. بعد أن نتحدث عن احتياجاتك، أرسل لك عرضاً واضحاً بالمدة والسعر قبل البدء بأي عمل.",
      },
      {
        index: "05",
        question: "ماذا يحدث بعد الإطلاق؟",
        answer:
          "تحصل على دعم فني مجاني لمدة 6 أشهر لحل أي مشكلة. بعدها يمكنني متابعة إدارة موقعك وتحديثه، ويمكنك طلب ميزات جديدة متى احتجت.",
      },
      {
        index: "06",
        question: "هل تعمل مع عملاء من دول أخرى؟",
        answer:
          "نعم. أعمل عن بُعد مع عملاء من أي دولة، ويمكنني بناء موقعك بأي لغة، بما فيها العربية والمواقع متعددة اللغات.",
      },
      {
        index: "07",
        question: "هل يمكنك تحسين موقع موجود لديّ؟",
        answer:
          "نعم. يمكنني مراجعة موقعك الحالي وتحسين سرعته وتصميمه وظهوره في جوجل، أو إعادة بنائه بتقنيات حديثة إذا كان ذلك الخيار الأفضل.",
      },
      {
        index: "08",
        question: "هل تصمّم أيضاً، أم أحتاج إلى تصميم جاهز؟",
        answer:
          "الخياران متاحان. يمكنني تصميم موقعك من الصفر، أو تنفيذه تماماً حسب تصميم جاهز لديك.",
      },
      {
        index: "09",
        question: "هل يصبح الكود والاستضافة ملكي؟",
        answer:
          "حسب الاتفاق. تُحدَّد ملكية الكود والاستضافة والدومين بوضوح في العرض قبل البدء، فلا توجد مفاجآت.",
      },
    ],
  },

  contact: {
    eyebrow: "تواصل معي",
    heading: ["لديك فكرة؟", "لنبنِها معاً."],
    text: "سواء كان متجراً إلكترونياً، أو موقع شركة، أو منصّة حجوزات، أو مشروع ووردبريس Headless، فأنا منفتح على العمل الحر والتعاون.",
    links: contactLinks({
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
    }),
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      message: "تفاصيل المشروع",
      messagePlaceholder: "أخبرني عن مشروعك...",
      send: "إرسال الرسالة",
      sending: "جارٍ الإرسال…",
      success: "شكراً — رسالتك في طريقها إليّ.",
      error: "يرجى تعبئة جميع الحقول مع بريد إلكتروني صحيح.",
      networkError: "تعذّر إرسال رسالتك — حاول مجدداً أو راسلني على البريد مباشرة.",
      subject: "رسالة من الموقع الشخصي من {name}",
    },
  },

  footer: {
    builtBy: "تصميم وتطوير {name}",
  },
};
