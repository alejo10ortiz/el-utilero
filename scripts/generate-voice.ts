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
import { PRE_LEAD, STING_SECONDS, MIN_SCENE, TAIL_CIERRE, TAIL_DEFAULT, Timeline, WordTiming } from '../src/lib/timeline';
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

async function tts(text: string, cfg: VoiceCfg, key: string): Promise<{ mp3: Buffer; alignment: Alignment }> {
  const body: Record<string, unknown> = { text, model_id: cfg.model_id, voice_settings: cfg.voice_settings };
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

  const timeline: Timeline = { source: 'elevenlabs', totalSeconds: 0, scenes: [] };
  const wavs: string[] = [];
  let cursor = 0;

  for (let i = 0; i < ep.escenas.length; i++) {
    const esc = ep.escenas[i];
    const start = cursor;
    const wav = path.join(work, `scene-${String(i).padStart(2, '0')}.wav`);
    let dur: number;
    let words: WordTiming[] = [];

    if (esc.voz) {
      const hash = crypto.createHash('sha1').update(JSON.stringify([cfg.voice_id, cfg.model_id, cfg.voice_settings, esc.voz])).digest('hex').slice(0, 10);
      const mp3 = path.join(clips, `line-${String(i).padStart(2, '0')}-${hash}.mp3`);
      const alf = mp3.replace(/\.mp3$/, '.json');
      if (force || !fs.existsSync(mp3) || !fs.existsSync(alf)) {
        console.log(` ♪ [${i}] ${esc.tipo}: generando…`);
        const r = await tts(esc.voz, cfg, key);
        fs.writeFileSync(mp3, r.mp3);
        fs.writeFileSync(alf, JSON.stringify(r.alignment));
      } else console.log(` · [${i}] ${esc.tipo}: caché`);
      const clipDur = ffprobeDur(mp3);
      const tail = esc.tipo === 'cierre' ? TAIL_CIERRE : TAIL_DEFAULT;
      dur = aFrames(PRE_LEAD + clipDur + tail);
      words = alignmentToWords(JSON.parse(fs.readFileSync(alf, 'utf8')), start + PRE_LEAD);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp3, '-af', `adelay=${Math.round(PRE_LEAD * 1000)}:all=1,apad=whole_dur=${dur}`, '-t', String(dur), '-ar', '44100', '-ac', '1', wav]);
    } else {
      dur = esc.tipo === 'sting' ? STING_SECONDS : aFrames(MIN_SCENE);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(dur), wav]);
    }
    wavs.push(wav);
    timeline.scenes.push({ index: i, tipo: esc.tipo, start, end: start + dur, words });
    cursor += dur;
  }
  timeline.totalSeconds = cursor;

  const list = path.join(work, 'concat.txt');
  fs.writeFileSync(list, wavs.map((w) => `file '${w}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'libmp3lame', '-b:a', '192k', path.join(dir, 'voice.mp3')]);
  fs.writeFileSync(path.join(dir, 'words.json'), JSON.stringify(timeline, null, 1));
  console.log(`✓ voice.mp3 + words.json → assets/episodes/${slug}/  (${cursor.toFixed(1)} s)`);
  if (cursor > 45) console.log('! Pasa de 45 s: considera subir "speed" en config/voice.json o recortar el guion.');
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  if (String(e.message) === 'fetch failed' && process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY)
    console.error('  Pista: en este entorno Node necesita NODE_USE_ENV_PROXY=1 para usar el proxy.');
  process.exit(1);
});
