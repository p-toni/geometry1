import { createRoot } from 'react-dom/client';
import App from './App';
import { loadHomeVendors } from './home/loadVendors';
import './index.css';

const rootNode = document.getElementById('root');
if (!rootNode) {
  throw new Error('Root element #root not found');
}
const container: HTMLElement = rootNode;

// Pre-set so home paints without a scroll-lock flash; HomeLayout owns it thereafter.
const SYSTEM_ROUTE = /^\/(essay-system|read)(\/|$)/;
if (!SYSTEM_ROUTE.test(window.location.pathname)) {
  document.documentElement.classList.add('home-mode');
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
