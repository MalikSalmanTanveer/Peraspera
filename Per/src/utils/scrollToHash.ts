const NAV_OFFSET = 148;

export function scrollToHashElement(id: string, maxAttempts = 24): void {
  if (!id) return;

  let attempts = 0;

  const tryScroll = () => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 100);
    }
  };

  window.setTimeout(tryScroll, 50);
}
