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
    kicker: "مطوّر Full-Stack · Next.js · WordPress",
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
        title: "تطوير المواقع",
        description: "مواقع حديثة ومتجاوبة مبنية حول أهداف عملك.",
      },
      {
        index: "02",
        title: "تطوير المتاجر الإلكترونية",
        description:
          "متاجر إلكترونية متكاملة تشمل عرض المنتجات والسلّة وإتمام الطلب وتجربة الدفع.",
      },
      {
        index: "03",
        title: "تطوير ووردبريس",
        description: "مواقع ووردبريس وWooCommerce مخصّصة حسب احتياجك.",
      },
      {
        index: "04",
        title: "تحسين الأداء وتجربة المستخدم وتحسين محركات البحث",
        description:
          "تحسين سرعة الموقع وسهولة استخدامه وأدائه وظهوره في نتائج البحث.",
      },
      {
        index: "05",
        title: "تطوير لوحات التحكم وإدارة المحتوى",
        description:
          "لوحات تحكم مخصّصة لإدارة محتوى الموقع والبيانات بسهولة دون الحاجة للتعديل على الكود.",
      },
      {
        index: "06",
        title: "النشر وإعداد الخادم",
        description:
          "نشر موقعك وتهيئته مع النطاق وشهادة SSL وبيئة الخادم.",
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
          "منصة تجارة إلكترونية Headless لعلامة تجارية للعناية بالسيارات. بنيت المتجر كاملاً بـ Next.js فوق WooCommerce: تصفح المنتجات، والبحث والتصفية، وعربة التسوق، وإتمام الشراء، وحسابات العملاء، وتتبع الطلبات، والدفع عبر Stripe.",
        tech: ["Next.js", "TypeScript", "Headless WooCommerce", "Stripe", "Tailwind CSS"],
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
          "دراسة هندسة البرمجيات مع التركيز على البرمجة وهياكل البيانات والخوارزميات وتطوير البرمجيات وأساسيات الهندسة.",
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
        question: "هل تقدّم دعماً فنياً بعد التسليم؟",
        answer:
          "نعم. يشمل المشروع دعماً فنياً مجانياً لمدّة 6 أشهر بعد التسليم للمساعدة في حلّ المشكلات الفنية وإبقاء الموقع يعمل بسلاسة.",
      },
      {
        index: "02",
        question: "هل تقدّم إدارة الموقع بعد الإطلاق؟",
        answer:
          "نعم. يمكنني إدارة محتوى الموقع وتحديثاته وصيانته بعد الإطلاق حسب احتياجك.",
      },
      {
        index: "03",
        question: "هل يمكنني طلب تعديلات بعد تسليم الموقع؟",
        answer:
          "نعم. يمكن طلب التعديلات والتحسينات والميزات الجديدة بعد الإطلاق بشكل منفصل حسب نطاق العمل.",
      },
      {
        index: "04",
        question: "هل تتولّى نشر الموقع وإعداد الخادم؟",
        answer:
          "نعم. يمكنني تولّي نشر الموقع وتهيئة الخادم والنطاق وشهادة SSL.",
      },
      {
        index: "05",
        question: "هل يمكنك تحسين أداء موقع قائم؟",
        answer:
          "نعم. يمكنني تحليل وتحسين أداء موقعك وتجربة المستخدم وتحسين محركات البحث.",
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
