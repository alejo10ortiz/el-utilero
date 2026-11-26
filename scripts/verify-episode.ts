/**
 * Verificador editorial (BRAND.md §10). Bloquea el render si el episodio no cumple la regla de oro.
 *   npx tsx scripts/verify-episode.ts 001            # estructura + 2 fuentes de dominios distintos
 *   npx tsx scripts/verify-episode.ts 001 --online   # además comprueba que las fuentes respondan
 * Sale con código 1 si hay errores.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ZodError } from 'zod';
import { flag, loadEpisode, positional, resolveSlug } from './lib';
import { estimateTimeline, tokenize } from '../src/lib/timeline';
import { HANDLE } from '../config/brand';
import { cargarEpisodios } from './rotacion';

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

  const esPres = ep.formato === 'presentacion';
  const esLargo = ep.formato === 'largo';

  if (!esPres) {
    // ── Regla de oro: dos fuentes por dato, de dominios distintos
    const dominios = new Set(ep.fuentes.map((u) => new URL(u).hostname.replace(/^www\./, '')));
    if (dominios.size < 2) err(`regla de oro: ${ep.fuentes.length} fuente(s) pero solo ${dominios.size} dominio(s) distinto(s); se necesitan ≥ 2`);
    else ok(`${ep.fuentes.length} fuentes, ${dominios.size} dominios distintos`);
    if (ep.estado !== 'verificado') err(`estado = "${ep.estado}": marcar "verificado" solo después de contrastar los datos con las fuentes`);
  } else {
    // Una presentación no trae datos nuevos: no hay fuentes que contrastar, pero tampoco puede afirmar hechos.
    ok('presentación: sin datos deportivos que verificar');
    ep.escenas.forEach((e, i) => {
      if (e.voz && /\b(1[89]|20)\d{2}\b/.test(e.voz) && !/dicen|mito|personaje|ficci[oó]n/i.test(e.voz))
        err(`escena ${i}: nombra un año sin declarar que es cuento del personaje ("dicen…", "mito", "personaje"): ${e.voz}`);
    });
    if (ep.fuentes.length) warn('una presentación no necesita fuentes; si afirma un dato real conviértela en episodio');
  }

  // ── Estructura (§7)
  const tipos = ep.escenas.map((e) => e.tipo);
  if (!esLargo && tipos[0] !== 'gancho') warn('la primera escena debería ser el gancho (0–3 s)');
  if (tipos[tipos.length - 1] !== 'cierre') err('la última escena debe ser el cierre');
  // Los episodios con escenas explicativas (contador, mapa, versus, cronología, recorte) omiten a propósito el sting y el giro del objeto.
  const explicativo = tipos.some((t) => ['contador', 'mapa', 'versus', 'cronologia', 'recorte'].includes(t));
  // (el sting se eliminó: 2,4 s de puerta muda; regla de ritmo del 26-nov-2026)
  if (!esPres && !esLargo && !explicativo && !ep.escenas.some((e) => e.tipo === 'giro')) warn('falta la escena de giro (objeto del día)');
  const cierre = ep.escenas.find((e) => e.tipo === 'cierre');
  // (el cierre ahora es una pregunta A/B que invita a responder; ver reglas de ritmo más abajo)
  if (ep.textoFinal.split(' · ')[0] !== HANDLE) err(`textoFinal debe empezar con el @usuario oficial ${HANDLE}`);

  // ── Rotación de guion (BRAND.md §7b): avisos, nunca bloquean
  if (!esPres && !esLargo) {
    if (!ep.guion) warn('anota `guion: {gancho, apertura, formato, cierre}` en episode.json (BRAND.md §7b) para poder rotar recursos');
    else {
      const previos = cargarEpisodios().filter((x) => x.id < ep.id).slice(-3);
      const ult2 = previos.slice(-2);
      if (ep.guion.gancho && ult2.some((x) => x.gancho === ep.guion!.gancho)) warn(`gancho «${ep.guion.gancho}» repetido en uno de los 2 episodios anteriores: rota el tipo de gancho`);
      if (ep.guion.formato && ult2.some((x) => x.formato === ep.guion!.formato)) warn(`formato «${ep.guion.formato}» repetido en uno de los 2 episodios anteriores`);
      if (ep.guion.apertura === 'firma' && previos.filter((x) => x.apertura === 'firma').length >= 2) warn('la frase firma «Cierren la puerta, que les cuento.» salió en 2 de los 3 episodios anteriores: usa apertura corta, íntima o directa');
      if (ep.guion.cierre === 'firma' && ult2.filter((x) => x.cierre === 'firma').length >= 1) warn('el cierre «Yo estaba ahí. Bueno… casi.» ya salió en el episodio anterior (máx. 1 de cada 3)');
      const cierre = ep.escenas.find((e) => e.tipo === 'cierre')?.voz ?? '';
      if (/pa[ií]s/i.test(cierre) && previos.slice(-1).some((x) => /pa[ií]s/i.test(x.cierreVoz))) warn('el cierre pide «su país» como el del episodio anterior: usa una pregunta propia de la historia');
      const musicaActual = ep.musica?.match(/-([a-e])\.mp3$/)?.[1];
      if (musicaActual && previos.slice(-1).some((x) => x.musica === musicaActual)) warn(`cama de música «${musicaActual}» igual a la del episodio anterior`);
      const temaActual = (ep as { tema?: string }).tema ?? 'clasico';
      if (ult2.some((x) => x.tema === temaActual)) warn(`tema visual «${temaActual}» repetido en uno de los 2 episodios anteriores: rota la superficie (cuaderno, kraft, plano, periodico; BRAND §2.6)`);
    }
  }

  // ── Fotos con licencia libre (solo videos largos): archivo presente y crédito con licencia reconocible
  const fotos = ep.escenas.flatMap((e) => e.fotos ?? []);
  if (fotos.length) {
    if (!esLargo) err('fotos reales solo se permiten en videos largos (BRAND.md §10 regla 3)');
    for (const f of fotos) {
      if (!fs.existsSync(path.resolve(__dirname, '..', 'assets', f.foto))) err(`foto «${f.foto}»: el archivo no existe en assets/`);
      if (!/CC BY|CC0|dominio público|public domain/i.test(f.credito)) err(`foto «${f.foto}»: el crédito debe nombrar una licencia libre (CC BY, CC BY-SA, CC0 o dominio público): «${f.credito}»`);
      if (/getty|\bap\b|reuters|mirrorpix|\bpa media|shutterstock/i.test(f.credito)) err(`foto «${f.foto}»: las fotos de agencia no están permitidas`);
    }
    ok(`${fotos.length} fotos con crédito y licencia libre`);
  }

  // ── Duración (30–45 s objetivo)
  const palabras = ep.escenas.reduce((a, e) => a + (e.voz ? tokenize(e.voz).length : 0), 0);
  const wjReal = path.resolve(__dirname, '..', 'assets', 'episodes', `${ep.id}-${ep.slug}`, 'words.json');
  const tl = fs.existsSync(wjReal) ? (JSON.parse(fs.readFileSync(wjReal, 'utf8')) as ReturnType<typeof estimateTimeline>) : estimateTimeline(ep);
  const msg = `${palabras} palabras de voz → ~${tl.totalSeconds.toFixed(0)} s (según la voz real si existe) (objetivo 28–33 s, máx. 35; análisis de YouTube 26-nov-2026)`;
  if (esLargo) ok(`video largo: ${palabras} palabras de voz, ~${(tl.totalSeconds / 60).toFixed(1)} min estimados (la historia decide la duración; ver la real con npm run timeline)`);
  else if (tl.totalSeconds > 40) warn(msg + ' — recortar guion (los Shorts de 40+ s perdían a la gente antes del primer dato)');
  else if (tl.totalSeconds > 35) warn(msg + ' — algo largo; recortar relleno');
  else ok(msg);

  // ── Reglas de ritmo (solo Shorts): sin sting, primer dato pronto, cierre con pregunta A/B
  if (!esLargo && !esPres) {
    if (ep.escenas.some((e) => e.tipo === 'sting')) warn('hay escena «sting» (2,4 s de puerta muda): quitarla (regla de ritmo del 26-nov-2026)');
    const cierre = ep.escenas.find((e) => e.tipo === 'cierre');
    if (cierre?.voz && !/¿[^?]*\?/.test(cierre.voz)) warn('el cierre no es una pregunta: usa una pregunta de elección A/B («¿X o Y?», «¿Sí o no?»)');
    if (/comenten su pa[ií]s/i.test(cierre?.voz ?? '')) warn('cierre genérico «comenten su país»: sustituir por una pregunta A/B');
  }

  // ── Reglas de plataforma (§10)
  const visible = ep.escenas.flatMap((e) => [e.texto, e.ficha, e.sello, e.cinta, e.palabraGigante, e.marcador]).filter(Boolean).join(' ');
  if (/\bfifa\b|world\s*cup/i.test(visible)) warn('texto en pantalla menciona FIFA/World Cup: evitar logos/nombres oficiales en la marca visual');
  if (!esLargo && ep.escenas.some((e) => e.voz && e.voz.length > 260)) warn('hay líneas de voz muy largas (>260 caracteres); mejor partir en dos escenas');

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
