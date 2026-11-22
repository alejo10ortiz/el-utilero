/**
 * Genera los efectos definitivos con ElevenLabs Sound Effects (BRAND.md §5.6) → assets/sfx/*.wav
 *   npm run sfx -- --force                 reemplaza los placeholders sintetizados
 *   npm run sfx -- --only=keys,slam        solo algunos
 * Requiere ELEVENLABS_API_KEY. Cada archivo cuesta créditos: por eso no se pisa nada sin --force.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, flag, loadEnv } from './lib';

const SFX: Record<string, { text: string; dur: number; loop?: boolean }> = {
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
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', out]);
    fs.unlinkSync(tmp);
    console.log(` ✓ ${name}.wav`);
  }
}

main().catch((e) => {
  console.error('✗', e.message ?? e);
  if (String(e.message) === 'fetch failed' && process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY)
    console.error('  Pista: en este entorno Node necesita NODE_USE_ENV_PROXY=1 para usar el proxy.');
  process.exit(1);
});
