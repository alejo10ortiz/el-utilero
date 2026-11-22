/**
 * Renderiza varios cuadros de una composición (revisión visual rápida).
 *   npx tsx scripts/stills.ts <CompositionId> <frame,frame,...> [slug]
 * Ej.: npx tsx scripts/stills.ts Short 100,283,480 001-pickles
 */
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const [id, framesArg, slug] = process.argv.slice(2);
if (!id || !framesArg) {
  console.error('Uso: tsx scripts/stills.ts <CompositionId> <frame,frame,...> [slug]');
  process.exit(1);
}
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out', 'stills');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({
  entryPoint: path.join(root, 'src/index.ts'),
  publicDir: path.join(root, 'assets'),
});
const inputProps = slug ? { slug } : {};
const comp = await selectComposition({ serveUrl, id, inputProps, browserExecutable, chromeMode: browserExecutable ? 'chrome-for-testing' : undefined });
console.log(`${id}: ${comp.width}×${comp.height}, ${comp.durationInFrames} frames (${(comp.durationInFrames / comp.fps).toFixed(1)} s)`);
for (const f of framesArg.split(',').map(Number)) {
  const output = path.join(outDir, `${id}${slug ? '-' + slug : ''}-${String(f).padStart(5, '0')}.png`);
  await renderStill({ serveUrl, composition: comp, inputProps, frame: Math.min(f, comp.durationInFrames - 1), output, browserExecutable, chromeMode: browserExecutable ? 'chrome-for-testing' : undefined });
  console.log('→', path.relative(root, output));
}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
