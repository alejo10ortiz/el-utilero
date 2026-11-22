import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { CAMERINO_W, Camerino, SonidosApertura, apertura } from '../../components/Camerino';
import { TituloImpacto } from '../../components/Cinetica';
import { Chispas, Destello, Impacto, Onda, Particulas } from '../../components/Fx';
import { Objeto } from '../../components/Objeto';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, tw } from '../../lib/ease';
import { BEAT, useAbs } from '../../lib/ritmo';
import { Escenario, EscenaProps } from '../Escenario';

/** Frame (relativo a la escena) de la primera palabra que cumple `re`, empezando desde `desde`. */
const cuando = (timing: EscenaProps['timing'], off: number, re: RegExp, desde = 0, def = 0) => {
  const w = timing.words.find((x) => Math.round(x.start * FPS) - off >= desde && re.test(x.text));
  return w ? Math.round(w.start * FPS) - off : def;
};

/**
 * CAMERINOS PRO: el pasillo del camerino sube con rebote, las cintas se pegan una a una, «CAMERINO» se clava
 * cuando se dice; el primer camerino se abre en «abro», el bulto sale volando con giro y aterriza con onda de choque;
 * la cámara sigue la acción (paneo) y en «historia» sale el botín.
 */
export const CamerinosPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const tCas = cuando(timing, off, /camerino/i, 0, 41);
  const tAbro = cuando(timing, off, /abro/i, 0, 66);
  const tSaco = cuando(timing, off, /saco/i, 0, 84);
  const tHist = cuando(timing, off, /historia/i, 0, 143);
  const dA = tAbro - 8; // la puerta empieza a abrirse un poco antes de la palabra
  const dB = tHist - 24;
  const tLand1 = tSaco + 24;
  const tLand2 = tHist + 22;

  const escala = 0.52;
  const w = CAMERINO_W * escala;
  const gap = 20;
  const x0 = 540 - (3 * w + 2 * gap) / 2; // ocupan casi todo el ancho (son gráficos, no texto: pueden pasar el margen seguro)
  const y = 440;
  const numeros = ['001', '002', '003'];
  const cintas = esc.cintas ?? [];
  const objetos = esc.objetos ?? ['bulto', 'botin'];
  const aperturas = [dA, dB];
  const aterriza = [tLand1, tLand2];
  const despega = [tSaco, tHist - 2];
  const reposo = [{ x: 30, y: 900 }, { x: 560, y: 900 }];
  const pulso = 1 + 0.014 * Math.exp(-(abs % BEAT) / 4.5);

  const panX = tw(f, [dA - 6, dA + 8], [0, 120], E.inOutCubic) + tw(f, [tLand1 + 4, tLand1 + 24], [0, -120], E.inOutCubic);
  const z = empuje(f, frames, 0.07, 6) * golpes(f, [tCas, tLand1, tLand2], 0.045);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tCas + 2, amp: 12 }, { frame: tLand1 + 1, amp: 11 }, { frame: tLand2 + 1, amp: 11 }]} deriva={0.5} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={8} colores={[C.tinta, C.grisArchivo]} opacidad={0.25} velocidad={0.3} />
      <TituloImpacto lineas={[{ texto: esc.palabraGigante ?? 'CAMERINO', at: tCas }]} x={SAFE_BOX.cx - 440} y={130} ancho={880} tono="tinta" maxSize={330} />

      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${panX}px) scale(${pulso})`, transformOrigin: '50% 60%' }}>
        {numeros.map((n, i) => {
          const d = aperturas[i];
          const ap = d !== undefined ? apertura(f, d, 'abierto') : { angulo: 0, luz: 0 };
          const sube = tw(f, [6 + 4 * i, 20 + 4 * i], [900, 0], E.outBack2);
          const sale = d !== undefined ? tw(f, [despega[i], despega[i] + 4], [0, 1], E.outCubic) : 0;
          return (
            <div key={n} style={{ position: 'absolute', inset: 0, transform: `translateY(${sube}px)`, opacity: f >= 6 + 4 * i ? 1 : 0 }}>
              <Camerino x={x0 + i * (w + gap)} y={y} escala={escala} numero={n} tema={cintas[i]} rotulo={esc.rotulos?.[i] ?? ['LOCAL', 'VISITANTE', 'ÁRBITROS'][i]} cintaDelay={26 + 5 * i} angulo={Math.min(ap.angulo, 72)} luz={ap.luz} perspectiva={2000} sombra={false}>
                {d !== undefined && objetos[i] && (
                  <div style={{ position: 'absolute', left: 135, top: 600, opacity: 1 - sale }}>
                    <Objeto tipo={objetos[i]} size={330} />
                  </div>
                )}
              </Camerino>
            </div>
          );
        })}
      </div>

      {/* objetos que salen volando con giro y aterrizan */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${panX}px)` }}>
      {aperturas.map((_, i) => {
        const tipo = objetos[i];
        if (!tipo) return null;
        const t0 = despega[i];
        const k = tw(f, [t0, aterriza[i]], [0, 1], E.inOutCubic);
        if (f < t0) return null;
        const desde = { x: x0 + i * (w + gap) - 20, y: y + 380 };
        const hasta = reposo[i];
        const px = desde.x + (hasta.x - desde.x) * k;
        const py = desde.y + (hasta.y - desde.y) * k - Math.sin(Math.PI * k) * 260;
        const tam = 170 + (440 - 170) * E.outBack(k);
        const rot = (i === 0 ? -28 : 24) * (1 - k) + (i === 0 ? -4 : 4);
        const flota = f > aterriza[i] ? Math.sin((f - aterriza[i]) / 10 + i) * 5 : 0;
        return <Objeto key={i} tipo={tipo} size={tam} x={px} y={py + flota} rot={rot} />;
      })}
      </div>

      <Impacto at={tCas} x={540} y={300} flash={0.0} />
      <Impacto at={tLand1} x={x0 + 160} y={1180} flash={0.18} color={C.tinta} semilla={3} />
      <Impacto at={tLand2} x={760} y={1180} flash={0.18} color={C.tinta} semilla={6} />
      <Destello at={tCas} color={C.lima} max={0.35} />
      <Chispas at={dA + 8} x={x0 + 160} y={y + 240} n={8} dist={140} dur={10} semilla={2} />

      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />

      {aperturas.map((d, i) => <SonidosApertura key={i} delay={d} hasta="abierto" />)}
      <Sfx name="impact" at={tCas} volume={0.85} />
      {[0, 1, 2].map((i) => <Sfx key={i} name="slap" at={26 + 5 * i} volume={0.55} />)}
      {[0, 1, 2].map((i) => <Sfx key={`w${i}`} name="whoosh" at={8 + 4 * i} volume={0.35} />)}
      <Sfx name="whoosh_long" at={tSaco + 6} volume={0.6} />
      <Sfx name="hit" at={tLand1} volume={0.75} />
      <Sfx name="whoosh_long" at={tHist + 6} volume={0.6} />
      <Sfx name="hit" at={tLand2} volume={0.75} />
    </Escenario>
  );
};
