/**
 * VARAH SYSTEMS — Zero-Dependency DevTools Console Overflow Detector
 * Copy and paste this snippet directly into any browser DevTools console
 * on any device (desktop, iPad, iPhone Web Inspector, or Android Chrome).
 */
(() => {
  const docWidth = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;
  console.log(
    "%c[VARAH OVERFLOW AUDIT]%c Viewport Client Width: " + docWidth + "px | Scroll Width: " + scrollWidth + "px",
    "background: #00f0ff; color: #000; font-weight: bold; padding: 3px 6px; border-radius: 3px;",
    "color: #fff; padding-left: 6px;"
  );

  // Temporarily disable backstop to locate root cause elements
  const prevHtml = document.documentElement.style.overflowX;
  const prevBody = document.body.style.overflowX;
  document.documentElement.style.overflowX = 'visible';
  document.body.style.overflowX = 'visible';

  const offenders = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth + 1.5 || rect.width > docWidth + 1.5) {
      offenders.push({
        element: el,
        tag: el.tagName.toLowerCase(),
        id: el.id ? '#' + el.id : '',
        class: el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '',
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        excess: Math.round(rect.right - docWidth)
      });
    }
  });

  // Restore backstop
  document.documentElement.style.overflowX = prevHtml;
  document.body.style.overflowX = prevBody;

  if (offenders.length === 0) {
    console.log(
      "%c✓ ZERO HORIZONTAL OVERFLOW: Layout is completely constrained within " + docWidth + "px.",
      "color: #10b981; font-weight: bold; font-size: 13px;"
    );
  } else {
    console.group("%c⚠️ OVERFLOW OFFENDERS DETECTED (" + offenders.length + "):", "color: #ef4444; font-weight: bold;");
    offenders.forEach((o, i) => {
      console.warn(
        `#${i + 1} <${o.tag}${o.id}${o.class}> right: ${o.right}px (+${o.excess}px beyond viewport)`
      );
    });
    console.groupEnd();
  }
})();
