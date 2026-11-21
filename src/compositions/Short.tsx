import React from 'react';
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, staticFile } from 'remotion';
import { FPS } from '../../config/brand';
import { ConFuentes } from '../components/ConFuentes';
import { Defs } from '../components/Defs';
import { Grano } from '../components/Grano';
import { EPISODIOS } from '../episodes';
import type { Episode } from '../lib/episode';
import { estimateTimeline, Timeline, timelineFrames, toFrames } from '../lib/timeline';
import { Apertura } from '../scenes/Apertura';
import { Cierre } from '../scenes/Cierre';
import { Contexto } from '../scenes/Contexto';
import { Gancho } from '../scenes/Gancho';
import { Giro } from '../scenes/Giro';
import { Remate } from '../scenes/Remate';
import { Sting } from '../scenes/Sting';

export type ShortProps = {
  slug: string;
  /** Se completan en calculateMetadata. */
  episode?: Episode;
  timeline?: Timeline;
};

const ESCENAS = { gancho: Gancho, sting: Sting, apertura: Apertura, contexto: Contexto, giro: Giro, remate: Remate, cierre: Cierre };

/**
 * Duración y tiempos salen del audio real (words.json de generate-voice.ts).
 * Si todavía no hay voz, usa la estimación para poder previsualizar el episodio completo.
 */
export const calcularShort: CalculateMetadataFunction<ShortProps> = async ({ props }) => {
  const episode = EPISODIOS[props.slug];
  if (!episode) throw new Error(`Episodio desconocido: ${props.slug}. ¿Lo registraste en src/episodes.ts?`);
  let timeline = estimateTimeline(episode);
  try {
    const r = await fetch(staticFile(`episodes/${props.slug}/words.json`));
    if (r.ok) timeline = (await r.json()) as Timeline;
  } catch {
    /* sin voz todavía: se queda la estimación */
  }
  return { durationInFrames: timelineFrames(timeline), props: { ...props, episode, timeline } };
};

export const Short: React.FC<ShortProps> = ({ slug, episode, timeline }) => {
  if (!episode || !timeline) return null;
  return (
    <ConFuentes>
      <AbsoluteFill style={{ background: '#16130F' }}>
        <Defs />
        {episode.escenas.map((esc, i) => {
          const t = timeline.scenes[i];
          const from = toFrames(t.start);
          const frames = Math.max(1, toFrames(t.end) - from);
          const Escena = ESCENAS[esc.tipo];
          return (
            <Sequence key={i} from={from} durationInFrames={frames} name={`${i + 1}·${esc.tipo}`}>
              <Escena esc={esc} ep={episode} timing={t} frames={frames} />
            </Sequence>
          );
        })}
        <Grano />
        {timeline.source === 'elevenlabs' && <Audio src={staticFile(`episodes/${slug}/voice.mp3`)} />}
      </AbsoluteFill>
    </ConFuentes>
  );
};

export const FPS_SHORT = FPS;
