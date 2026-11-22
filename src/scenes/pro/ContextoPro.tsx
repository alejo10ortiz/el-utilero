import React from 'react';
import { useCurrentFrame } from 'remotion';
import { A, C, FPS, SAFE_BOX } from '../../../config/brand';
import { TituloImpacto } from '../../components/Cinetica';
import { Ficha } from '../../components/Ficha';
import { Impacto, Particulas, Reflector } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { empuje, golpes } from '../../lib/camara';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * CONTEXTO PRO — la ficha a máquina se desliza y se teclea; el sello golpea cuando se NOMBRA lo que sella;
 * con palabra gigante se clava al decirla; sin ella, el Utilero asoma por detrás de la ficha, actuando con la voz.
 */
export const ContextoPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const conGigante = !!esc.palabraGigante;
  const ficha = esc.ficha ?? '';
  const tGig = conGigante ? 11 : 0; // entra de inmediato; la palabra dicha solo lo refuerza
  const tEnf = conGigante ? Math.max(tGig + 12, cuando(timing, off, esc.palabraGigante!.split(' ')[0], 0, -1) - 1) : -1;
  const fichaDelay = conGigante ? tGig + 10 : 12;
  const typing = Math.ceil(ficha.length * A.maquinaFramesPorLetra);
  const finTipeo = fichaDelay + A.ficha + typing;
  const tSello = esc.sello ? Math.max(fichaDelay + A.ficha + 8, cuando(timing, off, esc.sello, 0, finTipeo + 8) - 1) : -1;
  const ancho = conGigante ? 820 : 860;
  const x = SAFE_BOX.cx - ancho / 2;
  const y = conGigante ? 640 : 660;
  const size = conGigante ? 54 : 70;
  const altoMin = conGigante ? 470 : 520;
  const z = empuje(f, frames, 0.06, 8) * golpes(f, [tGig, tEnf, tSello].filter((t) => t > 0), 0.045);
  const impactos = [...(conGigante ? [{ frame: tGig + 2, amp: 12 }] : []), ...(tEnf > 0 ? [{ frame: tEnf + 1, amp: 8 }] : []), ...(tSello > 0 ? [{ frame: tSello + 3, amp: 9 }] : [])];

  return (
    <Escenario fondo="papel" impactos={impactos} deriva={0.5} zoom={z}>
      {!conGigante && <Reflector x={SAFE_BOX.cx} opacidad={0.16} ancho={820} />}
      <Particulas tipo="polvo" n={20} semilla={21} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {conGigante && <TituloImpacto lineas={[{ texto: esc.palabraGigante!, at: tGig }]} x={SAFE_BOX.cx - 410} y={150} ancho={820} tono="tinta" maxSize={560} />}
      {!conGigante && (
        <UtileroActor
          entrada={12}
          desde="abajo"
          expresion={esc.expresion ?? 'E5'}
          words={timing.words}
          offsetFrames={off}
          size={700}
          x={SAFE_BOX.cx - 270}
          y={90}
          seed={3}
        />
      )}
      <div style={{ position: 'absolute', left: x + 16, top: y + 20, width: ancho, height: altoMin, background: C.ficha, transform: 'rotate(2.6deg)', boxShadow: '0 18px 26px -20px rgba(22,19,15,0.5)', opacity: f >= fichaDelay ? 0.9 : 0 }} />
      <Ficha lineas={[ficha]} x={x} y={y} ancho={ancho} size={size} altoMin={altoMin} rot={conGigante ? -2.5 : 1.2} delay={fichaDelay} desde={conGigante ? 'derecha' : 'abajo'} marcar={esc.marcador} encabezado="ARCHIVO DEL CAMERINO" />
      {tSello > 0 && <Sello texto={esc.sello!} x={x + ancho - 170} y={y + altoMin - 78} size={130} rot={-10} delay={tSello} />}

      {conGigante && <Impacto at={tGig} x={540} y={330} flash={0} />}
      {tEnf > 0 && <Impacto at={tEnf} x={540} y={330} flash={0.14} semilla={3} />}
      {tSello > 0 && <Impacto at={tSello} x={x + ancho - 170} y={y + altoMin - 78} flash={0.12} color={C.sello} semilla={4} />}
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1385} size={84} />
      {conGigante && <Sfx name="impact" at={tGig} volume={0.8} />}
      {tEnf > 0 && <Sfx name="hit" at={tEnf} volume={0.5} />}
      <Sfx name="whoosh" at={fichaDelay - 2} volume={0.4} />
    </Escenario>
  );
};
