#!/usr/bin/env node
/**
 * UI smoke test via agent-browser CLI, against the six-doors home and the reader.
 * Run: pnpm dev, then pnpm test:browser
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '.browser-test');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const results = [];

/**
 * Own session per run. `agent-browser errors --clear` is a no-op — it prints the
 * buffer and leaves it — so a shared session carries every error any other
 * browsing left behind, and the two error assertions below fail on somebody
 * else's stack traces. A fresh session is the only way to start empty.
 */
const SESSION = `geometry-e2e-${process.pid}`;
const abEnv = { ...process.env, AGENT_BROWSER_SESSION: SESSION };

function ab(cmd) {
  try {
    return execSync(`agent-browser ${cmd}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: abEnv,
    }).trim();
  } catch (e) {
    const msg = e.stderr?.trim() || e.stdout?.trim() || e.message;
    throw new Error(`agent-browser ${cmd}\n${msg}`);
  }
}

// Runs on the failure path too, so a throw mid-suite cannot leak the session.
process.on('exit', () => {
  try {
    execSync('agent-browser close', { stdio: 'ignore', env: abEnv });
  } catch {
    // Already gone, or never opened.
  }
});

/** Uncaught page errors as readable text — plain `errors` prints each as a bare ✗. */
const pageErrors = () =>
  JSON.parse(ab('errors --json')).data.errors.map((e) => e.text?.trim()).filter(Boolean);

const snap = () => JSON.parse(ab('snapshot -i --json')).data;
const pageText = () => (JSON.parse(ab('snapshot --json')).data.snapshot || '').toLowerCase();
const shot = (file) => ab(`screenshot ${join(outDir, file)}`);
const evaljs = (js) => ab(`eval "${js.replace(/"/g, '\\"')}"`).replace(/^"|"$/g, '');

/** Hard navigation — agent-browser open can no-op on SPA history. */
const goto = (path) => {
  ab(`eval "window.location.assign('${BASE}${path}')"`);
  ab('wait 1200');
};

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
  console.log(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
}

function assert(name, cond, detail = '') {
  if (cond) pass(name, detail);
  else fail(name, detail);
}

function refByName(data, pattern) {
  const re = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
  for (const [ref, meta] of Object.entries(data.refs)) {
    if (re.test(meta.name ?? '')) return ref;
  }
  return null;
}

function clickNamed(pattern) {
  const ref = refByName(snap(), pattern);
  if (!ref) throw new Error(`control not found: ${pattern}`);
  ab(`click ${ref}`);
  ab('wait 500');
}

/* —— 1. the home renders, and renders clean —— */

ab(`open ${BASE}/`);
ab('wait 2000');
ab('console --clear');
ab('reload');
ab('wait 2000');

assert('home loads', /toni/i.test(ab('get title')), ab('get title'));
const homeErrors = pageErrors();
assert('page errors', homeErrors.length === 0, homeErrors.join(' | ').slice(0, 300));
const consoleErrors = ab('console')
  .split('\n')
  .filter((l) => /^\s*(error|severe)/i.test(l));
assert('console clean', consoleErrors.length === 0, consoleErrors.join(' | ').slice(0, 200));
shot('01-home.png');

/* —— 2. six doors, each opening its own room —— */

const DOORS = [
  ['WHO', /bounded learner|ape_toni/i],
  ['ESSAYS', /the container|the cut/i],
  ['WORK', /spec v1|archive/i],
  ['PLAY', /point cloud/i],
  ['NOW', /updated/i],
  ['HI', /hi@toni\.ltd/i],
];

const doorRefs = Object.entries(snap().refs).filter(
  ([, m]) => m.role === 'button' && /\b(WHO|ESSAYS|WORK|PLAY|NOW|HI)$/.test(m.name ?? ''),
);
assert('six doors present', doorRefs.length === 6, `${doorRefs.length} doors`);

for (const [label, marker] of DOORS) {
  clickNamed(new RegExp(`\\b${label}$`));
  assert(`door ${label.toLowerCase()} opens its room`, marker.test(pageText()));
}
shot('02-doors.png');

/* —— 3. the compression dial walks full → line → word —— */

goto('/');
const dialState = () => evaljs("document.querySelector('.nx-dial__state')?.textContent?.trim() || ''");
assert('dial starts full', dialState() === 'full', dialState());
assert(
  'expand disabled at full',
  /true/i.test(evaljs("String(document.querySelector('.nx-dial button:last-of-type')?.disabled)")),
);
clickNamed('Compress the argument');
assert('compress → line', dialState() === 'line', dialState());
clickNamed('Compress the argument');
assert('compress → word', dialState() === 'word', dialState());
assert(
  'compress disabled at word',
  /true/i.test(evaljs("String(document.querySelector('.nx-dial button:first-of-type')?.disabled)")),
);
clickNamed('Expand the argument');
assert('expand → line', dialState() === 'line', dialState());
shot('03-dial.png');

/* —— 4. the theme toggle flips the ground and remembers it —— */

goto('/');
const isDark = () => /true/i.test(evaljs("String(document.documentElement.classList.contains('nx-dark'))"));
const before = isDark();
clickNamed(/Switch to (light|dark)/);
assert('theme toggle flips', isDark() !== before, `${before} → ${isDark()}`);
assert(
  'theme persists to storage',
  evaljs("localStorage.getItem('nx-theme')") === (isDark() ? 'dark' : 'light'),
  evaljs("localStorage.getItem('nx-theme')"),
);
ab('reload');
ab('wait 1500');
assert('theme survives reload', isDark() !== before);
shot('04-theme.png');
clickNamed(/Switch to (light|dark)/);

/* —— 5. an essay card opens the reader, carried by the sweep ——
   The provider is mounted in App but does nothing until a click drives it, so this
   asserts the driver: the route swaps without a document load, and glimm's WebGL
   canvas appears while it does. Both were silently absent once. */

goto('/');
evaljs(
  "window.__spa = 'alive'; window.__sawCanvas = 0;" +
    'new MutationObserver(() => { const n = document.querySelectorAll(\'canvas\').length;' +
    ' if (n > window.__sawCanvas) window.__sawCanvas = n; })' +
    '.observe(document.documentElement, { childList: true, subtree: true })',
);
clickNamed(/the container.*read/is);
assert('essay card opens reader', ab('get url').includes('/read/the-container'), ab('get url'));
assert('essay open is client-side', evaljs('String(window.__spa)') === 'alive');
assert('sweep canvas plays on entry', Number(evaljs('String(window.__sawCanvas)')) > 0);

/* the band runs the other way on the way out, and the home opens at the argument */
evaljs("window.__spaBack = 'alive'; window.__sawBack = 0; window.scrollTo(0, 600);");
evaljs(
  'new MutationObserver(() => { const n = document.querySelectorAll(\'canvas\').length;' +
    ' if (n > window.__sawBack) window.__sawBack = n; })' +
    '.observe(document.documentElement, { childList: true, subtree: true })',
);
clickNamed(/toni\.ltd/i);
assert('back link returns home', new URL(ab('get url')).pathname === '/', ab('get url'));
assert('return is client-side', evaljs('String(window.__spaBack)') === 'alive');
assert('sweep canvas plays on return', Number(evaljs('String(window.__sawBack)')) > 0);
assert('home reopens at top', evaljs('String(window.scrollY)') === '0', evaljs('String(window.scrollY)'));

/* continuing inside the writing carries the band too, and lands at the top */
goto('/read/the-cut');
evaljs("window.__spaOn = 'alive'; window.__sawOn = 0; window.scrollTo(0, 900);");
evaljs(
  'new MutationObserver(() => { const n = document.querySelectorAll(\'canvas\').length;' +
    ' if (n > window.__sawOn) window.__sawOn = n; })' +
    '.observe(document.documentElement, { childList: true, subtree: true })',
);
clickNamed(/^(pairs|leads to|← older|newer →)/i);
assert('onward link opens another essay', /\/read\/[a-z-]+$/.test(ab('get url')), ab('get url'));
assert('onward is client-side', evaljs('String(window.__spaOn)') === 'alive');
assert('sweep canvas plays essay → essay', Number(evaljs('String(window.__sawOn)')) > 0);
assert('next essay opens at top', evaljs('String(window.scrollY)') === '0', evaljs('String(window.scrollY)'));

/* a modified click stays the browser's business */
goto('/');
const modified = evaljs(
  "(() => { const a = document.querySelector('.nxp-featured');" +
    " const e = new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true, button: 0 });" +
    ' a.dispatchEvent(e); return String(e.defaultPrevented); })()',
);
assert('cmd-click is not swallowed', modified === 'false', `defaultPrevented=${modified}`);

/* —— 6. the reader carries its apparatus —— */

goto('/read/the-cut');
const readerText = pageText();
assert('reader renders the essay', readerText.includes('the cut'));
const sections = Number(evaljs("String(document.querySelectorAll('a[href^=\\'#\\']').length)"));
assert('reader rail has section marks', /§01/.test(readerText), `${sections} anchors`);
assert('reader next-nav', /where to go next|pairs|leads to/i.test(readerText));
const readerErrors = pageErrors();
assert('reader page errors', readerErrors.length === 0, readerErrors.join(' | ').slice(0, 300));
shot('05-reader.png');

/* —— 7. retired URLs still land somewhere —— */

goto('/writing/the-cut');
assert('legacy /writing/:id redirects', ab('get url').includes('/read/the-cut'), ab('get url'));
goto('/read/the-cut/full');
assert('legacy /full redirects', !ab('get url').includes('/full'), ab('get url'));
goto('/no-such-page');
assert('unknown route falls home', new URL(ab('get url')).pathname === '/', ab('get url'));

/* —— 8. the phone —— */

ab('set viewport 390 844');
for (const [label, path] of [
  ['home', '/'],
  ['reader', '/read/the-cut'],
]) {
  goto(path);
  const overflow = evaljs(
    'String(document.documentElement.scrollWidth - document.documentElement.clientWidth)',
  );
  assert(`${label}: no horizontal overflow at 390px`, Number(overflow) <= 0, `${overflow}px over`);
}
shot('06-mobile-reader.png');

/* —— 9. WCAG 2.5.8 — every control at least 24px square —— */

goto('/');
const small = evaljs(`(() => {
  const out = [];
  document.querySelectorAll('a,button').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return;
    if (r.height < 24 || r.width < 24) {
      out.push(((el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24)) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
  });
  return out.join('; ');
})()`);
assert('home tap targets >= 24px', small === '', small.slice(0, 200));
shot('07-mobile-home.png');
ab('set viewport 1280 800');

/* —— report —— */

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
writeFileSync(
  join(outDir, 'report.json'),
  JSON.stringify({ passed, total: results.length, results }, null, 2),
);

console.log(`\n--- ${passed}/${results.length} passed ---`);
if (failed.length) {
  console.log('Failures:');
  for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
  process.exit(1);
}
