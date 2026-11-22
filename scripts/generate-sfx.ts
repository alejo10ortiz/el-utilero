/**
 * Genera los efectos definitivos con ElevenLabs Sound Effects (BRAND.md §5.6) → assets/sfx/*.wav
 *   npm run sfx -- --force                 reemplaza los placeholders sintetizados
 *   npm run sfx -- --only=keys,slam        solo algunos
 * Requiere ELEVENLABS_API_KEY. Cada archivo cuesta créditos: por eso no se pisa nada sin --force.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, flag, loadEnv } from './lib';

const SFX: Record<string, { text: string; dur: number; loop?: boolean; /** false = no recortar el inicio (risers que nacen del silencio) */ trim?: boolean }> = {
  sfx_keys: { text: 'Old bunch of metal keys jingling briefly, close microphone, dry, no reverb', dur: 1.0 },
  sfx_lock: { text: 'Heavy old metal locker bolt latch click, unlocking, short and dry', dur: 0.6 },
  sfx_creak: { text: 'Old rusty metal locker door creaking open slowly, hinge squeak', dur: 1.5 },
  sfx_slam: { text: 'Metal locker door slammed shut, dry hard bang with a short metallic ring', dur: 1.0 },
  sfx_whistle: { text: 'One short sharp referee whistle blast', dur: 0.8 },
  sfx_stamp: { text: 'Rubber stamp pressed hard onto paper on a wooden desk, single dry thud', dur: 0.6 },
  sfx_tape: { text: 'Masking tape pulled off the roll and stuck onto a surface, short rip', dur: 0.8 },
  sfx_type_loop: { text: 'Mechanical typewriter typing steadily, loopable keystrokes', dur: 2.0, loop: true },
  sfx_ding: { text: 'Typewriter bell ding, single clear ring', dur: 1.0 },
  sfx_chalk: { text: 'Chalk drawing a stroke on a blackboard, scratchy', dur: 0.8 },
  sfx_marker: { text: 'Felt marker drawing a circle on paper', dur: 0.8 },
  sfx_paper_slide: { text: 'A sheet of paper sliding across a wooden table, short', dur: 0.6 },
  sfx_thump: { text: 'Heavy soft low thump, a thick book dropped on a table', dur: 0.5 },
  sfx_wink: { text: 'Small soft sparkle chime, quick twinkle', dur: 0.6 },
  sfx_key_drop: { text: 'A single metal key dropped onto a table, short tinkle', dur: 0.5 },
  // ── transiciones e impactos (montaje al ritmo) ──
  sfx_whoosh: { text: 'Fast cinematic whoosh swoosh, air passing quickly, dry, isolated sound effect, no music', dur: 0.7 },
  sfx_whoosh_long: { text: 'Long smooth cinematic swoosh sweeping across, airy, isolated sound effect, no music', dur: 1.2 },
  sfx_impact: { text: 'Deep cinematic bass impact hit with a short tail, punchy sub boom, isolated sound effect, no music', dur: 1.6 },
  sfx_hit: { text: 'Short tight punchy thud impact, single hit, dry, isolated sound effect, no music', dur: 0.5 },
  sfx_riser: { text: 'Short tension riser, rising whoosh swell building up and stopping abruptly, isolated sound effect, no music', dur: 2.4, trim: false },
  sfx_pop: { text: 'Cartoon bubble pop, short snappy pop, isolated sound effect', dur: 0.5 },
  sfx_static: { text: 'Analog TV static burst, short glitch noise, isolated sound effect', dur: 0.5 },
  sfx_slap: { text: 'Masking tape slapped hard onto a wooden surface, short, dry', dur: 0.5 },
  sfx_clap: { text: 'A single sharp hand clap, dry', dur: 0.5 },
  sfx_swish: { text: 'Quick paper swish, a sheet of paper whipped through air, short', dur: 0.5 },
  // ── fútbol ──
  sfx_patada: { text: 'A soccer ball kicked hard, deep punchy thump of a football strike, short, dry, isolated sound effect', dur: 0.5 },
  sfx_hinchada: { text: 'Stadium crowd roar swelling up, football fans cheering and shouting, soccer match atmosphere, then fading, no music', dur: 3.0 },
  amb_locker_room: { text: 'Empty stadium locker room ambience, echo, distant water drip, very faint far-away crowd murmur', dur: 12, loop: true },
};

async function main() {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Falta ELEVENLABS_API_KEY (cópialo de .env.example a .env)');
  const only = typeof flag('only') === 'string' ? (flag('only') as string).split(',').map((s) => (s.startsWith('sfx_') || s.startsWith('amb_') ? s : `sfx_${s}`)) : null;
  const force = !!flag('force');
  const dir = path.join(ROOT, 'assets/sfx');
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, spec] of Object.entries(SFX)) {
    if (only && !only.includes(name)) continue;
    const out = path.join(dir, `${name}.wav`);
    if (fs.existsSync(out) && !force) {
      console.log(` · ${name}: ya existe (usa --force para reemplazar)`);
      continue;
    }
    const r = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
      method: 'POST',
      headers: { 'xi-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({ text: spec.text, duration_seconds: spec.dur, prompt_influence: 0.5, loop: spec.loop ?? false }),
    });
    if (!r.ok) throw new Error(`${name}: ElevenLabs ${r.status} ${await r.text()}`);
    const tmp = path.join(dir, `${name}.tmp.mp3`);
    fs.writeFileSync(tmp, Buffer.from(await r.arrayBuffer()));
    // Recorta el silencio inicial (el golpe debe caer en el fotograma exacto) y deja el pico en −2 dBFS.
    const trimmed = tmp.replace('.tmp.mp3', '.trim.wav');
    const base = ['-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-ar', '44100'];
    if (spec.trim !== false)
      execFileSync('ffmpeg', [...base, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.004', '-c:a', 'pcm_s16le', trimmed]);
    if (spec.trim === false || !fs.existsSync(trimmed) || fs.statSync(trimmed).size < 2000)
      execFileSync('ffmpeg', [...base, '-c:a', 'pcm_s16le', trimmed]); // sin recorte (o respaldo si el recorte dejó el archivo vacío)
    const vd = spawnSync('ffmpeg', ['-hide_banner', '-i', trimmed, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
    const m = /max_volume: (-?[\d.]+) dB/.exec(vd.stderr);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', trimmed, '-af', `volume=${(-2 - parseFloat(m?.[1] ?? '-2')).toFixed(2)}dB`, '-c:a', 'pcm_s16le', out]);
    fs.unlinkSync(tmp);
    fs.unlinkSync(trimmed);
    console.log(` ✓ ${name}.wav`);
  }
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  if (String(e.message) === 'fetch failed' && process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY)
    console.error('  Pista: en este entorno Node necesita NODE_USE_ENV_PROXY=1 para usar el proxy.');
  process.exit(1);
});
