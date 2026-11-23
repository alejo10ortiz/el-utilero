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
  // misma receta, 60 s: para los videos de 30–50 s (la pista "a" dura 30 s)
  b: {
    text: COMUN + 'Locker-room stomp and clap groove: muffled punchy kick drum, layered hand claps on beats 2 and 4, dry plucked guitar riff in A minor, deep warm round bass, light shaker. Keep the same steady groove and energy for the whole length, gentle variation every 8 bars, no breakdown, no silence.',
    ms: 60000,
  },
  // ── variantes de ánimo (todas a 100 BPM para caer en la rejilla de 18 frames/beat) ──
  // c: tensión / misterio (robos, desapariciones, secuestros, giros oscuros)
  c: {
    text:
      'Instrumental only. Exactly 100 BPM, 4/4, rock-solid steady tempo. Dark, suspenseful investigative documentary groove, tense but cool. ' +
      'No vocals, tight dry mix. Starts immediately with a strong low hit on the first downbeat, no intro silence, no fade in. ' +
      'Low pulsing analog synth bass, ticking closed hi-hat, muted plucked strings in D minor, sparse felt piano stabs, deep sub hits on beat 1, subtle detuned drone. Keep the same steady energy for the whole track, no big drop.',
    ms: 60000,
  },
  // d: sobria / emotiva (tragedias, homenajes, historias delicadas) — sin golpe fuerte inicial
  d: {
    text:
      'Instrumental only. Exactly 100 BPM, 4/4, rock-solid steady tempo. Somber, respectful, restrained and quietly hopeful documentary underscore. ' +
      'No vocals. Starts immediately on the first downbeat with a soft note, no intro silence, no fade in. ' +
      'Soft felt piano playing slow arpeggios in A minor, warm sustained string pad, gentle muted kick on beats 1 and 3, very light brushed snare, no big drops, no hand claps. Keep the same calm intensity for the whole track.',
    ms: 60000,
  },
  // e: ligera / curiosa / humor (datos absurdos, anécdotas)
  e: {
    text:
      'Instrumental only. Exactly 100 BPM, 4/4, rock-solid steady tempo. Light, quirky, curious and comedic documentary groove. No vocals, tight punchy mix. ' +
      'Starts immediately with a bright hit on the first downbeat, no intro silence, no fade in. ' +
      'Pizzicato strings, bouncy marimba melody in C major, finger snaps on beats 2 and 4, upright walking bass, soft brushed drums. Keep the same playful energy for the whole track.',
    ms: 60000,
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
