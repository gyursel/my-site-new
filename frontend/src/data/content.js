export const BRAND = "Гюрсел Исмаилов";

export const IMAGES = {
  portrait: "/portrait.webp",
  projects: [
    "https://images.unsplash.com/photo-1689443111130-6e9c7dfd8f9e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZ2xvd2luZyUyMGxpbmVzJTIwYmx1ZSUyMHB1cnBsZXxlbnwwfHx8fDE3OTExNTk1NzF8MA&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1620207418302-439b387441b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHxkYXJrJTIwZnV0dXJpc3RpYyUyMGRpZ2l0YWwlMjBhcnQlMjBibHVlJTIwdmlvbGV0JTIwbmVvbiUyMGFic3RyYWN0fGVufDB8fHx8MTc5MTE1OTU3MXww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1651870364199-fc5f9f46ac85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhdGElMjB2aXN1YWxpemF0aW9uJTIwYmx1ZSUyMHB1cnBsZSUyMG5lb24lMjB3YXZlc3xlbnwwfHx8fDE3OTExNTk1NzF8MA&ixlib=rb-4.1.0&q=85",
  ],
};

export const NAV_LINKS = [
  { id: "ai", label: "AI решения" },
  { id: "services", label: "Услуги" },
  { id: "projects", label: "Проекти" },
  { id: "about", label: "За мен" },
  { id: "contact", label: "Контакти" },
];

export const HERO = {
  badge: "Наличен за нови AI проекти",
  name: "Гюрсел Исмаилов",
  titleStart: "Създавам AI",
  rotating: ["чатботове", "AI агенти", "автоматизации", "умни приложения"],
  titleEnd: "за вашия бизнес",
  lead: [
    "Вграждам изкуствен интелект в ",
    { b: "мобилни приложения" },
    ", ",
    { b: "уебсайтове" },
    " и работни процеси — от първата идея до публикацията, с чист код и прецизен дизайн.",
  ],
  cta: "Обсъдете проекта си",
  tags: ["OpenAI", "Claude", "Gemini", "RAG", "Kotlin", "Swift", "React"],
  caption: {
    code: "MODEL.ANSWER(«ИДЕЯ»)",
    left: "AI · Android · iOS · Уеб",
    rightTitle: "От идея до продукт",
    rightSub: "PLAY STORE · APP STORE",
  },
};

export const TECH_ITEMS = [
  "React", "TypeScript", "FastAPI", "Node.js", "MongoDB", "Play Store", "App Store",
  "OpenAI", "Claude", "Gemini", "RAG", "AI агенти", "Kotlin", "Jetpack Compose", "Swift", "SwiftUI",
];

export const AI_SECTION = {
  eyebrow: "// AI решения",
  title: ["Изкуственият интелект,", "приложен в реален бизнес"],
  lead: "Не само експерименти: изграждам работещи AI продукти, които спестяват време, повишават продажбите и подобряват обслужването.",
  askLabel: "Питай AI асистента",
};

export const AI_SOLUTIONS = [
  {
    icon: "MessageSquareText",
    title: "AI чатботове и асистенти",
    text: "Асистент, който познава вашия бизнес: отговаря на клиенти 24/7 на базата на вашите документи, цени и често задавани въпроси (RAG).",
    meta: "Поддръжка, продажби, вътрешен помощник за екипа",
    prompt: "Как един AI чатбот с RAG може да отговаря на клиентите ми 24/7 на базата на моите документи?",
    wide: true,
  },
  {
    icon: "Workflow",
    title: "AI агенти и автоматизации",
    text: "Агенти, които сами извършват рутинна работа: подготвят оферти, сортират имейли, попълват данни и свързват вашите системи.",
    meta: "Спестени часове ръчна работа всяка седмица",
    prompt: "Какви рутинни задачи в един малък бизнес могат да се автоматизират с AI агенти?",
    wide: true,
  },
  {
    icon: "FileText",
    title: "Анализ на документи",
    text: "Извличане на данни от фактури, договори и PDF файлове, резюмета и търсене на отговори директно в документите.",
    meta: "Фактури, договори, отчети",
    prompt: "Как работи AI анализът на фактури и договори? Мога ли да прикача PDF, за да ми го покажеш?",
  },
  {
    icon: "ScanEye",
    title: "Компютърно зрение",
    text: "Разпознаване на обекти, текст и продукти през камерата на телефона — директно в мобилното приложение.",
    meta: "Сканиране, инвентар, контрол на качеството",
    prompt: "Как може компютърното зрение да помогне за инвентаризация или контрол на качеството в мобилно приложение?",
  },
  {
    icon: "Smartphone",
    title: "AI в мобилни приложения",
    text: "Умни функции в Android и iOS приложения: персонализация, гласови команди, препоръки и генеративно съдържание.",
    meta: "Android · iOS",
    prompt: "Какви AI функции мога да добавя в моето Android или iOS приложение?",
  },
];

export const SERVICES_SECTION = {
  eyebrow: "// Услуги",
  title: "Какво създавам за вас",
  lead: "Пълният цикъл — от първата консултация до публикацията в магазина и поддръжката след старта.",
};

export const SERVICES = [
  {
    icon: "Smartphone",
    title: "Мобилни приложения",
    text: "Нативни Android (Kotlin, Jetpack Compose) и iOS (Swift, SwiftUI) приложения с публикуване в Play Store и App Store.",
    meta: "Kotlin · Swift · Compose · SwiftUI",
  },
  {
    icon: "Globe",
    title: "Уеб приложения и сайтове",
    text: "Бързи и модерни уеб продукти с React и TypeScript, FastAPI или Node.js бекенд и MongoDB.",
    meta: "React · FastAPI · Node.js · MongoDB",
  },
  {
    icon: "Bot",
    title: "AI интеграции",
    text: "Вграждане на OpenAI, Claude и Gemini в съществуващи продукти — чат, анализ, генериране на съдържание.",
    meta: "OpenAI · Claude · Gemini",
  },
  {
    icon: "Database",
    title: "RAG и работа с данни",
    text: "Търсене и отговори върху вашите документи, векторни бази и интеграция с вътрешни системи.",
    meta: "Embeddings · Векторни бази · API",
  },
  {
    icon: "Rocket",
    title: "Публикуване и поддръжка",
    text: "Подготовка за магазините, CI/CD, мониторинг и развитие на продукта след старта.",
    meta: "Play Store · App Store · DevOps",
  },
  {
    icon: "Compass",
    title: "Консултация и стратегия",
    text: "Оценка къде AI носи реална стойност за бизнеса ви, план за внедряване и прототип за седмици.",
    meta: "Анализ · Прототип · План",
  },
];

export const PROJECTS_SECTION = {
  eyebrow: "// Проекти",
  title: "Избрани проекти",
  lead: "Реални продукти в употреба — от AI асистенти до мобилни приложения в магазините.",
};

export const PROJECTS = [
  {
    title: "AI асистент за онлайн магазин",
    tag: "RAG чатбот",
    text: "Чатбот, обучен върху каталога и правилата на магазина, който поема 70% от повтарящите се клиентски запитвания.",
    stack: ["OpenAI", "RAG", "React", "FastAPI"],
  },
  {
    title: "Мобилно приложение за сканиране на фактури",
    tag: "Android · iOS",
    text: "Снимаш фактурата — приложението извлича данните, категоризира разхода и го изпраща към счетоводството.",
    stack: ["Kotlin", "Swift", "Gemini", "Vision"],
  },
  {
    title: "Автоматизация на оферти",
    tag: "AI агент",
    text: "Агент, който чете запитванията по имейл, подготвя оферта по ценоразпис и я изпраща за одобрение за минути.",
    stack: ["Claude", "Node.js", "MongoDB"],
  },
];

export const ABOUT = {
  eyebrow: "// За мен",
  title: "Разработчик с фокус върху реалния резултат",
  paragraphs: [
    "Казвам се Гюрсел Исмаилов. Създавам мобилни и уеб приложения и вграждам в тях изкуствен интелект, който решава конкретни бизнес задачи — не демонстрации, а продукти, които клиентите ползват всеки ден.",
    "Работя с целия цикъл: от първата консултация и прототипа, през чист и поддържан код, до публикацията в Play Store и App Store и развитието след старта.",
  ],
  stats: [
    { value: "10+", label: "години опит" },
    { value: "30+", label: "завършени проекта" },
    { value: "2", label: "магазина за приложения" },
    { value: "24/7", label: "работещи AI асистенти" },
  ],
};

export const CONTACT = {
  eyebrow: "// Контакти",
  title: "Обсъдете проекта си",
  lead: "Разкажете ми за идеята си и ще се свържа с вас в рамките на един работен ден.",
  email: "peter200419@gmail.com",
  phone: "+359 88 000 0000",
  location: "София, България",
};
