// particle-scroll intentionally omitted — fixed scroller takeover caused
// load blink and vertical layout jumps. Re-add only with a non-invasive host.
const VENDORS = [
  '/vendor/thinking-orb.js',
  '/vendor/signal-marks.js',
  '/vendor/field-hero.js',
] as const;

let loadPromise: Promise<void> | null = null;

/** Load a `public/vendor/*.js` custom-element script once, shared across routes. */
export function loadVendorScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-home-vendor="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === '1') resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.dataset.homeVendor = src;
    el.onload = () => {
      el.dataset.loaded = '1';
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

/** Load home custom-element scripts once. */
export function loadHomeVendors(): Promise<void> {
  if (!loadPromise) {
    loadPromise = Promise.all(VENDORS.map((src) => loadVendorScript(src))).then(() => undefined);
  }
  return loadPromise;
}
