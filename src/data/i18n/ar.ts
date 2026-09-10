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
    { label: "تواصل", href: "#contact" },
  ],
  logo: { primary: "البّري", secondary: "مطوّر واجهات أمامية" },
  skipToContent: "تخطَّ إلى المحتوى",
  homeAria: "عبد الرحمن البّري — الصفحة الرئيسية",
  menuOpen: "افتح القائمة",
  menuClose: "أغلق القائمة",

  hero: {
    kicker: "هندسة البرمجيات · واجهات أمامية · React",
    titleLines: ["عبد الرحمن", "البّري"],
    roles: ["مطوّر واجهات أمامية", "React و Next.js", "مهندس برمجيات"],
    tagline:
      "مطوّر واجهات أمامية متخصّص في React و Next.js و TypeScript وبناء تجارب ويب حديثة.",
    viewProjects: "عرض المشاريع",
    contactMe: "تواصل معي",
    scroll: "مرّر للأسفل",
  },

  about: {
    eyebrow: "نبذة",
    heading:
      "بناء واجهات حديثة مع التركيز على الجودة والأداء وتجربة المستخدم.",
    paragraphs: [
      "أنا طالب هندسة برمجيات ومطوّر واجهات أمامية بخبرة تقارب عامين في بناء مواقع وتطبيقات ويب حديثة ومتجاوبة تركّز على الأداء.",
      "أتخصّص في React و Next.js و TypeScript، مع تركيز قوي على واجهات نظيفة ومكوّنات قابلة لإعادة الاستخدام وتصميم متجاوب وأداء عالٍ وتجربة مستخدم متميّزة.",
      "تشمل أعمالي الأخيرة متاجر إلكترونية ومواقع شركات ومنصّات لحجز الخدمات، تجمع بين واجهات مدروسة ووظائف عملية واقعية.",
      "يهمّني بناء واجهات أمامية قابلة للصيانة بتدفّق بيانات واضح وتفاعلات سهلة الوصول وتجارب سريعة تعمل بسلاسة على مختلف الأجهزة.",
    ],
    facts: [
      { value: "+2", label: "سنوات الخبرة" },
      { value: "+6", label: "مشاريع منجزة" },
      { value: "SE", label: "طالب هندسة برمجيات" },
      { value: "TS", label: "تطوير يعتمد TypeScript أولاً" },
    ],
  },

  services: {
    eyebrow: "الخدمات",
    title: "ما الذي يمكنني مساعدتك في بنائه.",
    items: [
      {
        index: "01",
        title: "تطوير المواقع",
        description: "مواقع حديثة ومتجاوبة مصمّمة خصيصاً لأعمالك.",
      },
      {
        index: "02",
        title: "تطوير المتاجر الإلكترونية",
        description: "متاجر إلكترونية متكاملة مع تجربة تسوّق ومسار دفع.",
      },
      {
        index: "03",
        title: "تطوير ووردبريس",
        description: "مواقع ووردبريس وWooCommerce مخصّصة حسب احتياجك.",
      },
      {
        index: "04",
        title: "تحسين الأداء وتجربة المستخدم وتحسين محركات البحث",
        description: "تحسين السرعة وسهولة الاستخدام والظهور في نتائج البحث.",
      },
      {
        index: "05",
        title: "النشر وإعداد الخادم",
        description: "نشر موقعك وتهيئته على الخادم.",
      },
    ],
  },

  projects: {
    eyebrow: "أعمال مختارة",
    title: "مشاريع بنيتُها وأواصل تحسينها.",
    items: [
      {
        title: "Bombo Car Wash",
        tag: "خدمات / حجوزات / Next.js",
        description:
          "منصّة حديثة لخدمات غسيل السيارات مبنية بـ Next.js وووردبريس Headless، تتضمّن نظام حجز مواعيد متعدّد الخطوات، وإدارة ديناميكية للخدمات، وآراء العملاء، وإدارة للمحتوى، ومساعداً ذكياً للعملاء.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Headless WordPress", "Framer Motion"],
        links: [{ label: "قريباً", href: "" }],
        image: "/projects/bombo.png",
        country: "العراق",
      },
      {
        title: "Nextzett",
        tag: "تجارة إلكترونية / Next.js",
        description:
          "متجر إلكتروني حديث لمنتجات العناية بالسيارات مبني بـ Next.js وWooCommerce، يتضمّن استكشاف المنتجات، وبحثاً وتصفيةً متقدّمين، ومسار سلّة ودفع، وحسابات للعملاء، وتتبّع الطلبات، ومدفوعات Stripe.",
        tech: ["Next.js", "TypeScript", "WooCommerce", "Stripe", "Tailwind CSS"],
        links: [{ label: "قريباً", href: "" }],
        image: "/projects/nextzett.png",
        country: "العراق",
      },
      {
        title: "DigitStone",
        tag: "مواقع شركات / Next.js",
        description:
          "موقع لوكالة رقمية مبني بـ Next.js وووردبريس Headless، يتضمّن خدمات ديناميكية، ودراسات حالة، ومحتوى مدوّنة، ودعماً متعدّد اللغات، ومساعداً ذكياً للموقع.",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Headless WordPress"],
        links: [{ label: "زيارة المشروع", href: "https://digitstone.tech/" }],
        image: "/projects/digitstone.png",
        country: "ألمانيا",
      },
      {
        title: "Aurodia",
        tag: "تجارة إلكترونية / WordPress",
        description:
          "موقع تجارة إلكترونية لمجوهرات فاخرة مبني بـ WordPress وWooCommerce، يتضمّن استكشاف المنتجات، وتجربة تسوّق متجاوبة، وحسابات للعملاء، ومسار دفع متكامل.",
        tech: ["WordPress", "WooCommerce", "Elementor", "JavaScript"],
        links: [{ label: "زيارة المشروع", href: "https://aurodia.de/" }],
        image: "/projects/aurodia.png",
        country: "ألمانيا",
      },
      {
        title: "Marasil",
        tag: "خدمات لوجستية / React.js",
        description:
          "منصّة لوجستية حديثة لإدارة الشحنات وأسعار الشحن وتتبّع الطلبات، والتكامل مع كبرى منصّات التجارة الإلكترونية والتوصيل.",
        tech: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
        links: [{ label: "زيارة المشروع", href: "https://www.marasil.sa/" }],
        image: "/projects/marasil.png",
        country: "السعودية",
      },
      {
        title: "MAHAM",
        tag: "مواقع شركات / Next.js",
        description:
          "موقع شركة حديث لمكتب استشارات هندسية، مبني بـ Next.js وووردبريس Headless لتقديم خدمات منظَّمة ومحتوى الشركة والمقالات وتجربة استخدام متجاوبة.",
        tech: ["Next.js", "Headless WordPress", "TypeScript", "Tailwind CSS"],
        links: [{ label: "زيارة المشروع", href: "https://mahameng.com/" }],
        image: "/projects/maham.png",
        country: "إيطاليا",
      },
      {
        title: "Terra Group UAE",
        tag: "مواقع شركات / React.js",
        description:
          "موقع شركة لمكتب استشارات هندسية وتصميم في الإمارات، مبني بـ React وTypeScript بتخطيطات متجاوبة ومكوّنات واجهة قابلة لإعادة الاستخدام.",
        tech: ["React", "TypeScript", "Tailwind CSS"],
        links: [{ label: "زيارة المشروع", href: "https://beta.terragroup.ae/" }],
        image: "/projects/terra.png",
        country: "الإمارات",
      },
    ],
  },

  experience: {
    eyebrow: "الخبرة",
    title: "مسار صنعه البناء.",
    items: [
      {
        date: "2024 — الآن",
        role: "مطوّر واجهات أمامية",
        description:
          "بناء مواقع وتطبيقات ويب إنتاجية باستخدام React و Next.js و TypeScript وووردبريس Headless، تشمل التجارة الإلكترونية ومواقع الشركات ومنصّات الحجز.",
      },
      {
        date: "2022 — الآن",
        role: "طالب هندسة برمجيات",
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
        title: "أُطُر العمل",
        items: ["React.js", "Next.js (App Router)", "React Query"],
      },
      {
        title: "اللغات",
        items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
      },
      {
        title: "التنسيق",
        items: ["Tailwind CSS", "Framer Motion", "تصميم متجاوب", "CSS Modules"],
      },
      {
        title: "إدارة المحتوى والبيانات",
        items: ["Headless WordPress", "REST APIs", "WooCommerce"],
      },
      {
        title: "الأدوات",
        items: ["Git", "GitHub", "VS Code", "Vercel"],
      },
      {
        title: "الممارسات",
        items: [
          "مكوّنات قابلة لإعادة الاستخدام",
          "الأداء",
          "سهولة الوصول",
          "تحسين محركات البحث",
        ],
      },
    ],
  },

  education: {
    eyebrow: "التعليم",
    title: "بناء المعرفة عبر الدراسة.",
    items: [
      {
        index: "01",
        title: "بكالوريوس في هندسة البرمجيات",
        org: "جامعة قاسيون الخاصة",
        meta: "2022 — الآن",
      },
      {
        index: "02",
        title: "تطوير الواجهات الأمامية والويب",
        org: "تعلّم ذاتي قائم على المشاريع",
        meta: "React · Next.js · TypeScript · Headless WordPress",
      },
    ],
  },

  contact: {
    eyebrow: "تواصل معي",
    heading: ["لديك فكرة؟", "لنبنِها معاً."],
    text: "سواء كان متجراً إلكترونياً، أو موقع شركة، أو منصّة حجوزات، أو مشروع ووردبريس Headless، فأنا منفتح على العمل الحر والتعاون.",
    links: contactLinks({
      email: "البريد الإلكتروني",
      github: "جيت هب",
      linkedin: "لينكد إن",
      whatsapp: "واتساب",
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
