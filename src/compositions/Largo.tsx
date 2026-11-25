import React from 'react';
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, staticFile } from 'remotion';
import { ConFuentes } from '../components/ConFuentes';
import { Defs } from '../components/Defs';
import { Grano } from '../components/Grano';
import { MusicaLarga, SegmentoMusica } from '../components/MusicaLarga';
import { DUR_TRANSICION, TipoTransicion, Transicion } from '../components/Transiciones';
import { EPISODIOS } from '../episodes';
import type { Episode } from '../lib/episode';
import { LH, LW } from '../lib/largo';
import { AbsProvider } from '../lib/ritmo';
import { TEMAS, TemaId, TemaProvider } from '../lib/tema';
import { estimateTimeline, Timeline, timelineFrames, toFrames } from '../lib/timeline';
import { CapituloL } from '../scenes/largo/CapituloL';
import { ElementosL } from '../scenes/largo/ElementosL';
import { FotosL } from '../scenes/largo/FotosL';
import { CierreL } from '../scenes/largo/CierreL';
import { CronoL } from '../scenes/largo/CronoL';
import { CronologiaL } from '../scenes/largo/CronologiaL';
import { MapaL } from '../scenes/largo/MapaL';
import { RecorteL } from '../scenes/largo/RecorteL';
import { TitularL } from '../scenes/largo/TitularL';
import { VeredictoL } from '../scenes/largo/VeredictoL';
import { VersusL } from '../scenes/largo/VersusL';
import { JugadaL } from '../scenes/largo/JugadaL';
import { RadiografiaL } from '../scenes/largo/RadiografiaL';
import { PasilloL } from '../scenes/largo/PasilloL';
import { EstadioL } from '../scenes/largo/EstadioL';
import { ReglaL } from '../scenes/largo/ReglaL';
import { MarcadorL } from '../scenes/largo/MarcadorL';

const ESCENAS_L: Partial<Record<Episode['escenas'][number]['tipo'], React.FC<any>>> = {
  capitulo: CapituloL, crono: CronoL, titular: TitularL, mapa: MapaL, cronologia: CronologiaL, recorte: RecorteL, versus: VersusL, veredicto: VeredictoL, cierre: CierreL,
  jugada: JugadaL, radiografia: RadiografiaL, pasillo: PasilloL, estadio: EstadioL, regla: ReglaL, marcador: MarcadorL,
};

export type LargoProps = {
  slug: string;
  /** Solo para previsualizar: fuerza el tema visual. */
  tema?: TemaId;
  /** Intervalo de fotogramas a renderizar (lo usa scripts/render-largo.ts por capítulos; no cambia la composición). */
  episode?: Episode;
  timeline?: Timeline;
};

export const calcularLargo: CalculateMetadataFunction<LargoProps> = async ({ props }) => {
  const base = EPISODIOS[props.slug];
  if (!base) throw new Error(`Episodio desconocido: ${props.slug}. ¿Lo registraste en src/episodes.ts?`);
  const episode = props.tema ? { ...base, tema: props.tema } : base;
  let timeline = estimateTimeline(episode);
  try {
    const r = await fetch(staticFile(`episodes/${props.slug}/words.json`));
    if (r.ok) timeline = (await r.json()) as Timeline;
  } catch {
    /* sin voz todavía: se queda la estimación */
  }
  return { durationInFrames: timelineFrames(timeline), props: { ...props, episode, timeline } };
};

/** Las transiciones-objeto están dibujadas en vertical (1080×1920): se giran 90° para cubrir el cuadro 16:9. */
const TransicionL: React.FC<{ tipo: TipoTransicion; dur: number; tema: TemaId }> = ({ tipo, dur, tema }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translateX(${LW}px) rotate(90deg)`, pointerEvents: 'none' }}>
    <Transicion tipo={tipo} dur={dur} tema={tema} />
  </div>
);

/** VIDEO LARGO 16:9 — mismas piezas de marca que el Short (temas, transiciones-objeto, subtítulos, música a 100 BPM) con escenas horizontales. */
export const Largo: React.FC<LargoProps> = ({ slug, episode, timeline }) => {
  if (!episode || !timeline) return null;
  const total = timelineFrames(timeline);
  // camas de música: cada escena con `musica` abre un tramo que dura hasta la siguiente
  const marcas = episode.escenas.map((e, i) => ({ e, i })).filter((x) => x.e.musica);
  const segmentos: SegmentoMusica[] = marcas.map((m, k) => ({
    desde: toFrames(timeline.scenes[m.i].start),
    hasta: k < marcas.length - 1 ? toFrames(timeline.scenes[marcas[k + 1].i].start) : total,
    archivo: m.e.musica!,
  }));
  return (
    <ConFuentes>
      <AbsoluteFill style={{ background: '#16130F' }}>
        <Defs />
        {episode.escenas.map((esc, i) => {
          const t = timeline.scenes[i];
          const from = toFrames(t.start);
          const frames = Math.max(1, toFrames(t.end) - from);
          const Escena = ESCENAS_L[esc.tipo];
          if (!Escena) throw new Error(`La escena «${esc.tipo}» no existe en el formato largo (episodio ${slug}, escena ${i + 1})`);
          return (
            <Sequence key={i} from={from} durationInFrames={frames} name={`${i + 1}·${esc.tipo}`}>
              <TemaProvider id={(esc.tema ?? episode.tema) as TemaId}>
                <AbsProvider inicio={from}>
                  <Escena esc={esc} ep={episode} timing={t} frames={frames} width={LW} height={LH} />
                  {(esc.elementos || esc.flechas) && <ElementosL esc={esc} timing={t} frames={frames} />}
                  {esc.fotos && <FotosL esc={esc} timing={t} frames={frames} />}
                </AbsProvider>
              </TemaProvider>
            </Sequence>
          );
        })}
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(22,19,15,0) 55%, rgba(22,19,15,0.32) 100%)', mixBlendMode: 'multiply', pointerEvents: 'none' }} />
        {(episode.transiciones ?? []).map((tipo, i) => {
          const sig = timeline.scenes[i + 1];
          if (!sig || tipo === 'ninguna') return null;
          const temaSig = (episode.escenas[i + 1]?.tema ?? episode.tema) as TemaId;
          const set = TEMAS[temaSig].transiciones;
          let real = (tipo === 'auto' ? set[i % set.length] : tipo) as TipoTransicion;
          if (real === 'cinta' || real === 'hoja' || real === 'rotativa') real = 'flash'; // llevan texto: no se pueden girar
          const dur = DUR_TRANSICION[real];
          return (
            <Sequence key={`tr${i}`} from={Math.max(0, toFrames(sig.start) - Math.round(dur / 2))} durationInFrames={dur} name={`transición ${i + 1}→${i + 2}: ${real}`}>
              <TransicionL tipo={real} dur={dur} tema={temaSig} />
            </Sequence>
          );
        })}
        <Grano width={LW} height={LH} />
        {segmentos.length > 0 && <MusicaLarga segmentos={segmentos} palabras={timeline.scenes.flatMap((sc) => sc.words)} totalFrames={total} />}
        {timeline.source === 'elevenlabs' && <Audio src={staticFile(`episodes/${slug}/voice.mp3`)} />}
      </AbsoluteFill>
    </ConFuentes>
  );
};
