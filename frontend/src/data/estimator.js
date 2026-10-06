export const PROJECT_TYPES = [
  { id: "mobile", label: "Мобилно приложение", weeks: 6, hours: 240 },
  { id: "web", label: "Уеб приложение / сайт", weeks: 4, hours: 160 },
  { id: "chatbot", label: "AI чатбот / асистент", weeks: 3, hours: 120 },
  { id: "agent", label: "AI агент / автоматизация", weeks: 4, hours: 160 },
  { id: "docs", label: "Анализ на документи", weeks: 3, hours: 120 },
];

export const PLATFORMS = [
  { id: "android", label: "Android", mult: 1 },
  { id: "ios", label: "iOS", mult: 1 },
  { id: "both", label: "Android + iOS", mult: 1.4 },
];

export const FEATURES = [
  { id: "ai", label: "AI интеграция (OpenAI / Claude / Gemini)", weeks: 1.5, hours: 60 },
  { id: "rag", label: "RAG върху ваши документи", weeks: 2, hours: 80 },
  { id: "auth", label: "Потребители и вход", weeks: 1, hours: 40 },
  { id: "payments", label: "Плащания", weeks: 1, hours: 40 },
  { id: "admin", label: "Админ панел", weeks: 1.5, hours: 60 },
  { id: "integrations", label: "Връзка с външни системи / API", weeks: 1.5, hours: 60 },
  { id: "vision", label: "Компютърно зрение / камера", weeks: 2, hours: 80 },
  { id: "stores", label: "Публикуване в Play Store / App Store", weeks: 1, hours: 30 },
  { id: "i18n", label: "Многоезичност", weeks: 0.5, hours: 20 },
];

export const SCALES = [
  { id: "prototype", label: "Прототип", hint: "Доказваме идеята за седмици", mult: 0.6 },
  { id: "mvp", label: "MVP", hint: "Работещ продукт за първи клиенти", mult: 1 },
  { id: "full", label: "Пълен продукт", hint: "Готов за мащабиране и поддръжка", mult: 1.5 },
];

export const URGENCY = [
  { id: "standard", label: "Стандартен срок", weeks: 1, hours: 1 },
  { id: "fast", label: "Ускорен срок", weeks: 0.75, hours: 1.15 },
];

const SCOPE = [
  { max: 120, label: "S", title: "Малък обем", text: "Фокусирано решение с една ключова функция." },
  { max: 260, label: "M", title: "Среден обем", text: "Пълноценен продукт с няколко свързани модула." },
  { max: 460, label: "L", title: "Голям обем", text: "Комплексна система с интеграции и администрация." },
  { max: Infinity, label: "XL", title: "Много голям обем", text: "Платформа на етапи — препоръчвам старт с MVP." },
];

const round = (n, step = 1) => Math.round(n / step) * step;

export const computeEstimate = ({ type, platform, features, scale, urgency }) => {
  const t = PROJECT_TYPES.find((x) => x.id === type);
  const s = SCALES.find((x) => x.id === scale);
  const u = URGENCY.find((x) => x.id === urgency);
  const pm = type === "mobile" ? PLATFORMS.find((x) => x.id === platform)?.mult ?? 1 : 1;
  const extra = FEATURES.filter((f) => features.includes(f.id));

  let hours = (t.hours + extra.reduce((a, f) => a + f.hours, 0)) * pm * s.mult * u.hours;
  let weeks = (t.weeks + extra.reduce((a, f) => a + f.weeks, 0) * 0.7) * (0.8 + pm * 0.2) * (0.7 + s.mult * 0.3) * u.weeks;
  hours = Math.max(40, hours);
  weeks = Math.max(2, weeks);

  const scope = SCOPE.find((x) => hours <= x.max);
  const phases = [
    { label: "Консултация и план", weeks: Math.max(0.5, round(weeks * 0.12, 0.5)) },
    { label: "Дизайн и прототип", weeks: Math.max(0.5, round(weeks * 0.18, 0.5)) },
    { label: "Разработка", weeks: Math.max(1, round(weeks * 0.5, 0.5)) },
    { label: "Тестове и публикуване", weeks: Math.max(0.5, round(weeks * 0.2, 0.5)) },
  ];

  return {
    hoursMin: round(hours * 0.85, 10),
    hoursMax: round(hours * 1.15, 10),
    weeksMin: Math.max(2, round(weeks * 0.85, 1)),
    weeksMax: round(weeks * 1.15, 1),
    scope,
    phases,
  };
};

export const summarizeEstimate = (sel, est) => {
  const t = PROJECT_TYPES.find((x) => x.id === sel.type)?.label;
  const platform = sel.type === "mobile" ? ` (${PLATFORMS.find((x) => x.id === sel.platform)?.label})` : "";
  const feats = FEATURES.filter((f) => sel.features.includes(f.id)).map((f) => f.label).join(", ") || "без допълнителни модули";
  const scale = SCALES.find((x) => x.id === sel.scale)?.label;
  return `Проект: ${t}${platform}\nОбхват: ${scale} · ${est.scope.title} (${est.scope.label})\nМодули: ${feats}\nОриентировъчно: ${est.weeksMin}–${est.weeksMax} седмици, ${est.hoursMin}–${est.hoursMax} часа работа.`;
};
