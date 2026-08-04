/**
 * IconLibrary
 * -----------
 * The site's signature visual device: every bouquet is represented by a
 * single-line botanical mark instead of a photo. Each mark is drawn
 * procedurally from a small "recipe" (petal count, petal shape, size),
 * so every flower in the catalog reads as part of the same family while
 * still looking distinct. Also draws the recurring "sprig" motif used as
 * a section divider and the leaf-shaped showcase dots.
 */
(function (window) {
  class IconLibrary {
    /**
     * Draws a single-line botanical blossom.
     * @param {Object} config
     * @param {number} config.petals - number of petals
     * @param {"round"|"pointed"|"slim"} config.shape - petal silhouette
     * @param {number} [config.size=180] - viewport size
     */
    static bloom({ petals = 6, shape = "round", size = 180 } = {}) {
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.27;
      const petalPaths = [];

      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
        const tipX = cx + Math.cos(angle) * r * 1.9;
        const tipY = cy + Math.sin(angle) * r * 1.9;
        const spread = shape === "slim" ? 0.16 : shape === "pointed" ? 0.24 : 0.34;
        const a1 = angle - spread;
        const a2 = angle + spread;
        const c1x = cx + Math.cos(a1) * r * 1.05;
        const c1y = cy + Math.sin(a1) * r * 1.05;
        const c2x = cx + Math.cos(a2) * r * 1.05;
        const c2y = cy + Math.sin(a2) * r * 1.05;

        petalPaths.push(
          `<path d="M ${cx} ${cy} Q ${c1x} ${c1y} ${tipX} ${tipY} Q ${c2x} ${c2y} ${cx} ${cy}" />`
        );
      }

      const stemY1 = cy + r * 1.1;
      const stemY2 = size * 0.92;
      const leafY = cy + r * 1.9;

      return `
<svg viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="bloom-mark" aria-hidden="true">
  <g stroke="currentColor" stroke-width="${size * 0.011}" stroke-linecap="round" stroke-linejoin="round">
    ${petalPaths.join("\n    ")}
    <circle cx="${cx}" cy="${cy}" r="${size * 0.035}" fill="currentColor" stroke="none" />
    <path d="M ${cx} ${stemY1} C ${cx - size * 0.02} ${(stemY1 + stemY2) / 2}, ${cx + size * 0.02} ${(stemY1 + stemY2) / 2}, ${cx} ${stemY2}" />
    <path d="M ${cx} ${leafY} C ${cx - size * 0.16} ${leafY + size * 0.02}, ${cx - size * 0.18} ${leafY + size * 0.14}, ${cx - size * 0.02} ${leafY + size * 0.16}" />
    <path d="M ${cx} ${leafY + size * 0.06} C ${cx + size * 0.16} ${leafY + size * 0.08}, ${cx + size * 0.18} ${leafY + size * 0.2}, ${cx + size * 0.02} ${leafY + size * 0.22}" />
  </g>
</svg>`.trim();
    }

    /** The recurring stem-and-leaf divider used across sections. */
    static sprig() {
      return `
<svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
    <path d="M2 20c28-13 58 12 88 0" />
    <path d="M27 15c-5-8-13-9-18-3" />
    <path d="M55 25c4 8 12 9 18 3" />
    <path d="M83 14c5-7 13-7 17-1" />
  </g>
</svg>`.trim();
    }

    /** Small leaf-shaped marker used for showcase navigation dots. */
    static leafDot() {
      return `
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M8 14C3 12 2 6 4 2c6 0 10 4 10 9-2 3-4 4-6 3Z" fill="currentColor" />
</svg>`.trim();
    }
  }

  window.IconLibrary = IconLibrary;
})(window);
