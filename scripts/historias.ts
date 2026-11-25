/**
 * Historias para redes (1080×1920) que promocionan un video largo.
 *   npx tsx scripts/historias.ts [1,2,3,4]
 * Salida: out/L01-trautmann/historias/historia-<n>.png
 */
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out', 'L01-trautmann', 'historias');
fs.mkdirSync(outDir, { recursive: true });
const ns = (process.argv[2] ?? '1,2,3,4').split(',').map(Number);

async function main() {
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'assets') });
  for (const n of ns) {
    const inputProps = { n };
    const composition = await selectComposition({ serveUrl, id: 'Historia', inputProps, browserExecutable, chromeMode });
    const output = path.join(outDir, `historia-${n}.png`);
    await renderStill({ serveUrl, composition, inputProps, output, browserExecutable, chromeMode });
    console.log('→', path.relative(root, output));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
