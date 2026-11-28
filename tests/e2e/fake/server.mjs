// #84: starts a Vite dev server of the site in demo mode, but with a fake Google sign-in (./firebase.js) for the
// store and the Profile page, so tests can reach the live-site sign-in code paths without Firebase or a network.
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const FAKE = resolve(here, 'firebase.js');
const USERS = [resolve(root, 'src/store.jsx'), resolve(root, 'src/pages/Profile.jsx')];

const fakeFirebase = () => ({
  name: 'fake-firebase',
  enforce: 'pre',
  resolveId(source, importer) {
    if (!importer || !/(^|\/)firebase\.js$/.test(source)) return null;
    const from = importer.split('?')[0];
    return USERS.includes(from) ? FAKE : null;
  },
});

export async function startFakeSite() {
  process.env.VITE_LOCAL_MODE = '1';
  const server = await createServer({
    configFile: false, root, base: '/', logLevel: 'error',
    plugins: [react(), fakeFirebase()],
    server: { port: 0, host: '127.0.0.1' },
    optimizeDeps: { holdUntilCrawlEnd: true },
  });
  await server.listen();
  const { port } = server.httpServer.address();
  return { url: `http://127.0.0.1:${port}/`, close: () => server.close() };
}
