/**
 * Verificador editorial (BRAND.md §10). Bloquea el render si el episodio no cumple la regla de oro.
 *   npx tsx scripts/verify-episode.ts 001            # estructura + 2 fuentes de dominios distintos
 *   npx tsx scripts/verify-episode.ts 001 --online   # además comprueba que las fuentes respondan
 * Sale con código 1 si hay errores.
 */
import { ZodError } from 'zod';
import { flag, loadEpisode, positional, resolveSlug } from './lib';
import { estimateTimeline, tokenize } from '../src/lib/timeline';

type Hallazgo = { nivel: 'ERROR' | 'AVISO' | 'OK'; msg: string };

export async function verificar(slug: string, online = false): Promise<Hallazgo[]> {
  const out: Hallazgo[] = [];
  const err = (msg: string) => out.push({ nivel: 'ERROR', msg });
  const warn = (msg: string) => out.push({ nivel: 'AVISO', msg });
  const ok = (msg: string) => out.push({ nivel: 'OK', msg });

  let ep;
  try {
    ep = loadEpisode(slug);
  } catch (e) {
    if (e instanceof ZodError) {
      for (const i of e.issues) err(`esquema: ${i.path.join('.') || '(raíz)'} — ${i.message}`);
    } else err(String(e));
    return out;
  }
  ok('esquema episode.json válido');

  // ── Regla de oro: dos fuentes por dato, de dominios distintos
  const dominios = new Set(ep.fuentes.map((u) => new URL(u).hostname.replace(/^www\./, '')));
  if (dominios.size < 2) err(`regla de oro: ${ep.fuentes.length} fuente(s) pero solo ${dominios.size} dominio(s) distinto(s); se necesitan ≥ 2`);
  else ok(`${ep.fuentes.length} fuentes, ${dominios.size} dominios distintos`);
  if (ep.estado !== 'verificado') err(`estado = "${ep.estado}": marcar "verificado" solo después de contrastar los datos con las fuentes`);

  // ── Estructura (§7)
  const tipos = ep.escenas.map((e) => e.tipo);
  if (tipos[0] !== 'gancho') warn('la primera escena debería ser el gancho (0–3 s)');
  if (tipos[tipos.length - 1] !== 'cierre') err('la última escena debe ser el cierre');
  if (!tipos.includes('sting')) warn('falta el sting (casillero que se abre)');
  if (!ep.escenas.some((e) => e.tipo === 'giro')) warn('falta la escena de giro (objeto del día)');
  const cierre = ep.escenas.find((e) => e.tipo === 'cierre');
  if (cierre && !/comenten|comenta/i.test(cierre.voz ?? '')) warn('el cierre debería invitar a comentar el país (comunidad, §1)');
  if (!/^@elutilero\b/.test(ep.textoFinal)) warn('textoFinal debería empezar con @elutilero');

  // ── Duración (30–45 s objetivo)
  const palabras = ep.escenas.reduce((a, e) => a + (e.voz ? tokenize(e.voz).length : 0), 0);
  const tl = estimateTimeline(ep);
  const msg = `${palabras} palabras de voz → ~${tl.totalSeconds.toFixed(0)} s estimados (objetivo 30–45 s)`;
  if (tl.totalSeconds > 50) warn(msg + ' — recortar guion o subir "speed" en config/voice.json');
  else if (tl.totalSeconds > 45) warn(msg + ' — algo largo; confirmar con la voz real');
  else ok(msg);

  // ── Reglas de plataforma (§10)
  const visible = ep.escenas.flatMap((e) => [e.texto, e.ficha, e.sello, e.cinta, e.palabraGigante, e.marcador]).filter(Boolean).join(' ');
  if (/\bfifa\b|world\s*cup/i.test(visible)) warn('texto en pantalla menciona FIFA/World Cup: evitar logos/nombres oficiales en la marca visual');
  if (ep.escenas.some((e) => e.voz && e.voz.length > 260)) warn('hay líneas de voz muy largas (>260 caracteres); mejor partir en dos escenas');

  // ── Fuentes en línea (opcional)
  if (online) {
    for (const url of ep.fuentes) {
      try {
        const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (verificador de fuentes)' }, signal: AbortSignal.timeout(15000) });
        if (r.ok) ok(`fuente responde ${r.status}: ${url}`);
        else warn(`fuente respondió ${r.status} (puede bloquear bots; revisar a mano): ${url}`);
      } catch (e) {
        warn(`no se pudo abrir la fuente (${(e as Error).message}): ${url}`);
      }
    }
  }
  return out;
}

async function main() {
  const slug = resolveSlug(positional()[0]);
  const res = await verificar(slug, !!flag('online'));
  const icono = { ERROR: '✗', AVISO: '!', OK: '✓' } as const;
  console.log(`Episodio ${slug}`);
  for (const h of res) console.log(` ${icono[h.nivel]} ${h.nivel === 'OK' ? '' : h.nivel + ': '}${h.msg}`);
  const errores = res.filter((h) => h.nivel === 'ERROR').length;
  console.log(errores ? `\n${errores} error(es): no se puede publicar.` : '\nSin errores bloqueantes.');
  process.exit(errores ? 1 : 0);
}

if (require.main === module) main();
