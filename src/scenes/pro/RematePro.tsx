import React from 'react';
import { useCurrentFrame } from 'remotion';
import { A, C, FPS, SAFE_BOX } from '../../../config/brand';
import { CintaImpacto, TituloImpacto } from '../../components/Cinetica';
import { Ficha } from '../../components/Ficha';
import { Destello, Impacto, Particulas, Rayos } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * REMATE PRO — la cifra final (ÚNICO) se clava al decirla con confeti de balón, rayos y estallido de hinchada;
 * la ficha se teclea antes y la cinta de marcador se pega justo después.
 */
export const RematePro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const ficha = esc.ficha ?? '';
  const palabra = esc.palabraGigante ?? '';
  const tPal = Math.max(24, cuando(timing, off, palabra, 0, 60) - 2);
  const fichaDelay = 12;
  const tCinta = tPal + 12;
  const previa = esc.kicker; // palabra que llena el hueco hasta la cifra final (p. ej. «CAMPEÓN»)
  const tPrevia = 11;
  const salePrevia = tw(f, [tPal - 3, tPal + 2], [0, 1], E.inExpo);
  const sobrio = esc.tono === 'misterio'; // historias delicadas: sin confeti, rayos ni hinchada
  const celebra = sobrio ? 0 : tw(f, [tPal, tPal + 10], [0, 1], E.outCubic);
  const z = empuje(f, frames, 0.06, 8) * golpes(f, [tPal, tCinta], 0.05);
  void A;
  void salePrevia;
  return (
    <Escenario fondo="papel" impactos={[{ frame: tPal + 2, amp: 15 }, { frame: tCinta + 2, amp: 8 }]} deriva={0.5} zoom={z}>
      <div style={{ opacity: celebra * 0.9 }}>
        <Rayos c2="rgba(200,255,46,0.5)" cx={540} cy={420} vel={0.2} />
      </div>
      <Particulas tipo="polvo" n={18} semilla={41} colores={[C.tinta, C.grisArchivo]} opacidad={0.2} velocidad={0.3} />
      {previa && <TituloImpacto lineas={[{ texto: previa, at: tPrevia }]} x={SAFE_BOX.cx - 410} y={190} ancho={820} tono="tinta" maxSize={380} salida={tPal - 10} />}
      <TituloImpacto lineas={[{ texto: palabra, at: tPal }]} x={SAFE_BOX.cx - 410} y={160} ancho={820} tono="tinta" maxSize={560} />
      <Ficha lineas={[ficha]} x={SAFE_BOX.cx - 410} y={690} ancho={820} size={54} altoMin={420} rot={1.8} delay={fichaDelay} desde="izquierda" />
      {esc.cinta && <CintaImpacto texto={esc.cinta} x={SAFE_BOX.cx + 40} y={1010} at={tCinta} rot={-5} size={62} />}
      <div style={{ opacity: celebra }}>
        <Particulas tipo="confeti" n={34} semilla={7} colores={[C.lima, C.tinta, C.papel, C.sello]} dir={1} velocidad={0.6} opacidad={0.9} />
      </div>
      {previa && <Impacto at={tPrevia} x={540} y={330} flash={0.1} semilla={2} />}
      <Impacto at={tPal} x={540} y={330} flash={0.3} />
      <Impacto at={tCinta} x={SAFE_BOX.cx + 40} y={1010} flash={0} color={C.tinta} semilla={6} />
      <Destello at={tPal} color={C.lima} max={0.4} dur={5} />
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />
      {previa && <Sfx name="impact" at={tPrevia} volume={0.7} />}
      <Sfx name="impact" at={tPal} volume={0.9} />
      {!sobrio && <Sfx name="hinchada" at={tPal + 2} volume={0.5} />}
      <Sfx name="whoosh" at={fichaDelay - 2} volume={0.4} />
    </Escenario>
  );
};
