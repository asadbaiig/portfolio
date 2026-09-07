import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
if (!existsSync(new URL('index.html', dist))) throw new Error('Run the Vite build before publishing.');
// Keep Pages' root entry compiled; the development entry lives in app/.
cpSync(fileURLToPath(dist), fileURLToPath(root), { recursive: true });
console.log('Updated GitHub Pages files from the production build.');
