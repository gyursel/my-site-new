export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
};

// Let a closing dialog release the body scroll lock before navigating.
export const scrollAfterClose = (id) => {
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
};