/**
 * Cuadros de cada transición alrededor de un corte (revisión visual).
 *   npx tsx scripts/stills-transiciones.ts <slug> <frameDelCorte> <transicion,...> [tema]
 * Salida: out/stills-trans/<slug>-<transicion>-<offset>.png
 */
import path from 'node:path';
import fs from 'node:fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { DUR_TRANSICION } from '../src/components/Transiciones';

const [slug, corteArg, tiposArg, tema] = process.argv.slice(2);
if (!slug || !corteArg || !tiposArg) {
  console.error('Uso: tsx scripts/stills-transiciones.ts <slug> <frameDelCorte> <tipo,tipo,...> [tema]');
  process.exit(1);
}
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out', 'stills-trans');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const chromeMode = browserExecutable ? ('chrome-for-testing' as const) : undefined;
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'assets') });
  const corte = Number(corteArg);
  for (const tipo of tiposArg.split(',')) {
    const inputProps: Record<string, unknown> = { slug, transicion: tipo };
    if (tema) inputProps.tema = tema;
    const comp = await selectComposition({ serveUrl, id: 'Short', inputProps, browserExecutable, chromeMode });
    const dur = (DUR_TRANSICION as Record<string, number>)[tipo] ?? 14;
    const mitad = Math.round(dur / 2);
    // 6 instantes: desde el inicio de la transición hasta el final
    const offs = [1, Math.round(mitad * 0.5), mitad - 1, mitad + 1, mitad + Math.round(mitad * 0.5), dur - 2];
    for (const o of offs) {
      const frame = corte - mitad + o;
      const output = path.join(outDir, `${slug}-${tipo}-${String(o).padStart(2, '0')}.png`);
      await renderStill({ serveUrl, composition: comp, inputProps, frame, output, browserExecutable, chromeMode });
      console.log('→', path.basename(output));
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
