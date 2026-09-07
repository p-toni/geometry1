import { createRoot } from 'react-dom/client';
import App from './App';
import { loadHomeVendors } from './home/loadVendors';
import './index.css';

const rootNode = document.getElementById('root');
if (!rootNode) {
  throw new Error('Root element #root not found');
}
const container: HTMLElement = rootNode;

// Pre-set the ground before React mounts, or a remembered dark theme opens on white.
// NextHome owns the class thereafter and reads the same key.
const SYSTEM_ROUTE = /^\/(essay-system|read)(\/|$)/;
if (!SYSTEM_ROUTE.test(window.location.pathname)) {
  try {
    const saved = window.localStorage.getItem('nx-theme');
    const dark =
      saved === 'dark' ||
      (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('nx-dark');
  } catch {
    /* private mode or blocked storage — fall through to the light ground */
  }
}

async function boot() {
  try {
    await loadHomeVendors();
  } catch {
    // thinking-orb / signal-mark optional if scripts fail
  }
  createRoot(container).render(<App />);
}

void boot();
