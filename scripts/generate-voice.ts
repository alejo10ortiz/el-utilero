/**
 * episode.json → assets/episodes/<slug>/voice.mp3 + words.json  (BRAND.md §5.7, §9.3)
 *
 *   npm run voice -- 001            genera (usa caché por texto+voz: no gasta créditos dos veces)
 *   npm run voice -- 001 --dry      solo muestra textos y caracteres (créditos estimados)
 *   npm run voice -- 001 --force    ignora la caché
 *   npm run voice -- --test         genera solo la línea de prueba → out/voice-test.mp3
 *
 * Requiere ELEVENLABS_API_KEY (en .env) y config/voice.json → voice_id.
 * La duración de cada escena sale de la duración REAL del audio, alineada a frames (1/30 s).
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { FPS } from '../config/brand';
import { BEAT_SECONDS, LARGO_TAIL, leadFor, quantBeat, SILENCIO_SEGUNDOS, MIN_SCENE, TAIL_CIERRE, TAIL_DEFAULT, Timeline, tokenize, WordTiming } from '../src/lib/timeline';
import { ROOT, episodeMediaDir, flag, loadEnv, loadEpisode, positional, resolveSlug } from './lib';

type VoiceCfg = {
  voice_id: string | null;
  model_id: string;
  language_code?: string;
  voice_settings: Record<string, unknown>;
  _linea_de_prueba?: string;
};

const aFrames = (s: number) => Math.ceil(s * FPS - 1e-6) / FPS;

const ffprobeDur = (f: string) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };

async function tts(text: string, cfg: VoiceCfg, key: string, contexto?: { previous?: string; next?: string }): Promise<{ mp3: Buffer; alignment: Alignment }> {
  const body: Record<string, unknown> = { text, model_id: cfg.model_id, voice_settings: cfg.voice_settings };
  // videos largos: las líneas vecinas dan continuidad de entonación entre escenas
  if (contexto?.previous) body.previous_text = contexto.previous;
  if (contexto?.next) body.next_text = contexto.next;
  if (cfg.language_code && /v2_5|v3|flash|turbo/.test(cfg.model_id)) body.language_code = cfg.language_code;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { audio_base64: string; alignment: Alignment; normalized_alignment?: Alignment };
  return { mp3: Buffer.from(j.audio_base64, 'base64'), alignment: j.alignment ?? j.normalized_alignment! };
}

/** Caracteres con tiempo → palabras con tiempo (la puntuación queda pegada a su palabra). */
export function alignmentToWords(al: Alignment, offset: number): WordTiming[] {
  const words: WordTiming[] = [];
  let cur = '';
  let s = 0;
  let e = 0;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (cur) words.push({ text: cur, start: offset + s, end: offset + e });
      cur = '';
    } else {
      if (!cur) s = al.character_start_times_seconds[i];
      cur += ch;
      e = al.character_end_times_seconds[i];
    }
  });
  if (cur) words.push({ text: cur, start: offset + s, end: offset + e });
  return words;
}

async function main() {
  loadEnv();
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/voice.json'), 'utf8')) as VoiceCfg;
  const key = process.env.ELEVENLABS_API_KEY;
  const dry = !!flag('dry');
  const force = !!flag('force');

  if (flag('test')) {
    if (!key || !cfg.voice_id) throw new Error('Falta ELEVENLABS_API_KEY o voice_id en config/voice.json');
    const { mp3 } = await tts(cfg._linea_de_prueba ?? 'Cierren la puerta, que les cuento.', cfg, key);
    fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'out/voice-test.mp3'), mp3);
    console.log('→ out/voice-test.mp3');
    return;
  }

  const slug = resolveSlug(positional()[0]);
  const ep = loadEpisode(slug);
  const dir = episodeMediaDir(slug);
  const clips = path.join(dir, 'clips'); // caché de las líneas (mp3 + alineación): se versiona para no gastar créditos dos veces
  const work = path.join(ROOT, 'out', 'voice-work', slug); // temporales (wav por escena): no van a assets/ ni a git
  fs.mkdirSync(clips, { recursive: true });
  fs.mkdirSync(work, { recursive: true });

  const chars = ep.escenas.reduce((a, e) => a + (e.voz?.length ?? 0), 0);
  console.log(`Episodio ${slug}: ${ep.escenas.filter((e) => e.voz).length} líneas, ${chars} caracteres (≈ ${chars} créditos si no hay caché)`);
  if (dry) {
    ep.escenas.forEach((e, i) => e.voz && console.log(` ${String(i).padStart(2)} [${e.tipo}] ${e.voz}`));
    return;
  }
  if (!key) throw new Error('Falta ELEVENLABS_API_KEY (cópialo de .env.example a .env)');
  if (!cfg.voice_id) throw new Error('Falta voice_id en config/voice.json (diseña la voz: BRAND.md §5.7)');

  const largo = ep.formato === 'largo';
  const timeline: Timeline = { source: 'elevenlabs', totalSeconds: 0, scenes: [] };
  const wavs: string[] = [];
  let cursor = 0;

  // Grupos de escenas consecutivas que comparten una sola línea de voz (`grupo`): se corta el montaje, no el audio.
  const grupos: number[][] = [];
  ep.escenas.forEach((e, i) => {
    const ult = grupos[grupos.length - 1];
    if (e.grupo && ult && ep.escenas[ult[0]].grupo === e.grupo) ult.push(i);
    else grupos.push([i]);
  });
  const textoDe = (g?: number[]) => {
    const partes = (g ?? []).map((i) => ep.escenas[i].voz).filter(Boolean) as string[];
    return partes.length ? partes.join(' ') : undefined;
  };
  const buscarClip = (hash: string) => fs.readdirSync(clips).find((f) => f.endsWith(`-${hash}.mp3`));

  for (let gi = 0; gi < grupos.length; gi++) {
    const g = grupos[gi];
    const i = g[0];
    const esc = ep.escenas[i];
    const start = cursor;
    const wav = path.join(work, `scene-${String(i).padStart(2, '0')}.wav`);
    const texto = textoDe(g);
    let dur: number;
    let words: WordTiming[] = [];

    if (texto) {
      // contexto de entonación (solo largos): final de la línea anterior y comienzo de la siguiente
      const previous = largo ? textoDe(grupos[gi - 1])?.slice(-250) : undefined;
      const next = largo ? textoDe(grupos[gi + 1])?.slice(0, 250) : undefined;
      const hash = crypto.createHash('sha1').update(JSON.stringify(largo ? [cfg.voice_id, cfg.model_id, cfg.voice_settings, texto, previous, next] : [cfg.voice_id, cfg.model_id, cfg.voice_settings, texto])).digest('hex').slice(0, 10);
      const existente = buscarClip(hash);
      const mp3 = path.join(clips, existente ?? `line-${String(i).padStart(2, '0')}-${hash}.mp3`);
      const alf = mp3.replace(/\.mp3$/, '.json');
      if (force || !fs.existsSync(mp3) || !fs.existsSync(alf)) {
        console.log(` ♪ [${i}] ${esc.tipo}: generando…`);
        const r = await tts(texto, cfg, key, largo ? { previous, next } : undefined);
        fs.writeFileSync(mp3, r.mp3);
        fs.writeFileSync(alf, JSON.stringify(r.alignment));
      } else console.log(` · [${i}] ${esc.tipo}${g.length > 1 ? ` ×${g.length}` : ''}: caché`);
      const clipDur = ffprobeDur(mp3);
      const tail = esc.tipo === 'cierre' && !largo ? TAIL_CIERRE : largo ? LARGO_TAIL : TAIL_DEFAULT;
      const lead = leadFor(i, largo);
      dur = aFrames(quantBeat(lead + clipDur + tail)); // el grupo dura un número entero de beats (100 BPM)
      words = alignmentToWords(JSON.parse(fs.readFileSync(alf, 'utf8')), start + lead);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp3, '-af', `adelay=${Math.round(lead * 1000)}:all=1,apad=whole_dur=${dur}`, '-t', String(dur), '-ar', '44100', '-ac', '1', wav]);
    } else {
      dur = SILENCIO_SEGUNDOS[esc.tipo] !== undefined ? aFrames(quantBeat(SILENCIO_SEGUNDOS[esc.tipo])) : aFrames(quantBeat(MIN_SCENE));
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(dur), wav]);
    }
    wavs.push(wav);

    if (g.length === 1) {
      timeline.scenes.push({ index: i, tipo: esc.tipo, start, end: start + dur, words });
    } else {
      // reparte las palabras entre las escenas del grupo y corta en el beat más cercano al hueco entre frases
      const ntok = g.map((k) => tokenize(ep.escenas[k].voz ?? '').length);
      if (words.length !== ntok.reduce((a, b) => a + b, 0))
        throw new Error(`El grupo «${esc.grupo}» (escena ${i}): ${words.length} palabras alineadas ≠ ${ntok.reduce((a, b) => a + b, 0)} del texto. Revisa la puntuación.`);
      const cortes: number[] = [];
      let idx = 0;
      for (let k = 0; k < g.length - 1; k++) {
        idx += ntok[k];
        const hueco = [words[idx - 1].end, words[idx].start];
        const mid = (hueco[0] + hueco[1]) / 2;
        const minimo = (cortes[k - 1] ?? start) + 1.2;
        const maximo = start + dur - 1.2;
        const m0 = Math.round((mid - start) / BEAT_SECONDS);
        const cand = [m0 - 2, m0 - 1, m0, m0 + 1, m0 + 2].map((m) => aFrames(start + m * BEAT_SECONDS)).filter((t) => t >= minimo - 1e-6 && t <= maximo + 1e-6);
        const dentro = cand.filter((t) => t >= hueco[0] - 0.05 && t <= hueco[1] + 0.05);
        const pool = dentro.length ? dentro : cand;
        if (!pool.length) throw new Error(`No hay hueco para cortar el grupo «${esc.grupo}» en la escena ${g[k]}`);
        cortes.push(pool.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a)));
      }
      let w0 = 0;
      g.forEach((k, j) => {
        const s0 = j === 0 ? start : cortes[j - 1];
        const e0 = j === g.length - 1 ? start + dur : cortes[j];
        timeline.scenes.push({ index: k, tipo: ep.escenas[k].tipo, start: s0, end: e0, words: words.slice(w0, w0 + ntok[j]) });
        w0 += ntok[j];
      });
    }
    cursor += dur;
  }
  timeline.totalSeconds = cursor;

  const list = path.join(work, 'concat.txt');
  fs.writeFileSync(list, wavs.map((w) => `file '${w}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'libmp3lame', '-b:a', '192k', path.join(dir, 'voice.mp3')]);
  fs.writeFileSync(path.join(dir, 'words.json'), JSON.stringify(timeline, null, 1));
  console.log(`✓ voice.mp3 + words.json → assets/episodes/${slug}/  (${cursor.toFixed(1)} s)`);
  if (!largo && cursor > 45) console.log('! Pasa de 45 s: considera subir "speed" en config/voice.json o recortar el guion.');
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  if (String(e.message) === 'fetch failed' && process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY)
    console.error('  Pista: en este entorno Node necesita NODE_USE_ENV_PROXY=1 para usar el proxy.');
  process.exit(1);
});
