/**
 * Genera una pista instrumental con ElevenLabs Music → out/music-raw/<nombre>.mp3
 *   npm run music -- a              (usa el prompt "a" de PROMPTS)
 * Después: bash scripts/make-music-bed.sh out/music-raw/a.mp3 assets/music/base-100bpm-a.mp3
 * La pista debe estar a 100 BPM (el montaje cae en rejilla de 18 frames por beat). Verificar con
 *   python3 scripts/analyze-beats.py out/music-raw/a.mp3
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, positional } from './lib';

const COMUN =
  'Instrumental only. Exactly 100 BPM, 4/4, rock-solid steady tempo. Playful, mischievous, confident, documentary sports energy. ' +
  'Tight punchy modern mix, no vocals, no reverb wash. Starts immediately with a strong hit on the first downbeat, no intro silence, no fade in. ';

const PROMPTS: Record<string, { text: string; ms: number }> = {
  a: {
    text: COMUN + 'Locker-room stomp and clap groove: muffled punchy kick drum, layered hand claps on beats 2 and 4, dry plucked guitar riff in A minor, deep warm round bass, light shaker.',
    ms: 30000,
  },
};

async function main() {
  const key = positional()[0] ?? 'a';
  const spec = PROMPTS[key];
  if (!spec) throw new Error(`Prompt desconocido "${key}". Disponibles: ${Object.keys(PROMPTS).join(', ')}`);
  const r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: spec.text, music_length_ms: spec.ms, force_instrumental: true }),
  });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
  const out = path.join(ROOT, 'out', 'music-raw', `${key}.mp3`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  console.log('→', path.relative(ROOT, out));
}
main().catch((e) => {
  console.error('✗', e.message ?? e);
  process.exit(1);
});
