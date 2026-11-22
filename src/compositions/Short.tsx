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
import { GanchoPro } from '../scenes/pro/GanchoPro';
import { StingPro } from '../scenes/pro/StingPro';
import { AperturaPro } from '../scenes/pro/AperturaPro';
import { CamerinosPro } from '../scenes/pro/CamerinosPro';
import { CierrePro } from '../scenes/pro/CierrePro';
import { AbsProvider } from '../lib/ritmo';
import { Musica } from '../components/Musica';
import { DUR_TRANSICION, Transicion } from '../components/Transiciones';
import { Camerinos } from '../scenes/Camerinos';
import { Secreto } from '../scenes/Secreto';
import { Serie } from '../scenes/Serie';

/** Escenas del estilo 'pro' (montaje dinámico al ritmo). Las que no existan caen al estilo clásico. */
const ESCENAS_PRO: Partial<Record<keyof typeof ESCENAS, React.FC<any>>> = {
  gancho: GanchoPro, sting: StingPro, apertura: AperturaPro, camerinos: CamerinosPro, cierre: CierrePro,
};

export type ShortProps = {
  slug: string;
  /** Se completan en calculateMetadata. */
  episode?: Episode;
  timeline?: Timeline;
};

const ESCENAS = {
  gancho: Gancho, sting: Sting, apertura: Apertura, contexto: Contexto, giro: Giro, remate: Remate, cierre: Cierre,
  camerinos: Camerinos, serie: Serie, secreto: Secreto,
};

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
          const Escena = (episode.estilo === 'pro' && ESCENAS_PRO[esc.tipo]) || ESCENAS[esc.tipo];
          return (
            <Sequence key={i} from={from} durationInFrames={frames} name={`${i + 1}·${esc.tipo}`}>
              <AbsProvider inicio={from}>
                <Escena esc={esc} ep={episode} timing={t} frames={frames} />
              </AbsProvider>
            </Sequence>
          );
        })}
        {/* viñeta: oscurece las esquinas y da profundidad (no aplica a transiciones, que van encima) */}
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(22,19,15,0) 52%, rgba(22,19,15,0.34) 100%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
        {/* transiciones-objeto que tapan el corte entre escenas */}
        {(episode.transiciones ?? []).map((tipo, i) => {
          const sig = timeline.scenes[i + 1];
          if (!sig || tipo === 'ninguna') return null;
          const dur = DUR_TRANSICION[tipo];
          return (
            <Sequence key={`tr${i}`} from={Math.max(0, toFrames(sig.start) - Math.round(dur / 2))} durationInFrames={dur} name={`transición ${i + 1}→${i + 2}: ${tipo}`}>
              <Transicion tipo={tipo} dur={dur} />
            </Sequence>
          );
        })}
        <Grano />
        {episode.musica && (
          <Musica archivo={episode.musica} palabras={timeline.scenes.flatMap((sc) => sc.words)} totalFrames={timelineFrames(timeline)} />
        )}
        {timeline.source === 'elevenlabs' && <Audio src={staticFile(`episodes/${slug}/voice.mp3`)} />}
      </AbsoluteFill>
    </ConFuentes>
  );
};

export const FPS_SHORT = FPS;
