import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { LogotipoAnimado, TituloImpacto } from '../../components/Cinetica';
import { Destello, Estatica, Impacto, Particulas, Rayos, Reflector } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { UtileroActor } from '../../components/UtileroActor';
import { empuje, golpes } from '../../lib/camara';
import { E, tw } from '../../lib/ease';
import { BEAT, useAbs } from '../../lib/ritmo';
import { Escenario, EscenaProps } from '../Escenario';

/**
 * APERTURA PRO: sunburst lima girando, el logotipo se arma letra a letra y la I-llave gira y hace "ping"
 * justo cuando dice «Utilero»; el Utilero salta a cuadro con squash & stretch y guiña; en «la tele» salta la estática.
 */
const AperturaLogo: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const tele = timing.words.find((w) => /tele/i.test(w.text));
  const tTele = tele ? Math.round(tele.start * FPS) - off - 2 : -1;
  const util = timing.words.find((w) => /utilero/i.test(w.text));
  const tUtil = util ? Math.round(util.start * FPS) - off : 26;
  const pulso = 1 + 0.018 * Math.exp(-(abs % BEAT) / 4.5);
  const z = empuje(f, frames, 0.06, 4) * golpes(f, [tUtil, tTele].filter((x) => x >= 0), 0.05);
  const confeti = tw(f, [tUtil, tUtil + 10], [0, 1], E.outCubic);
  return (
    <Escenario fondo="papel" impactos={[{ frame: tUtil + 2, amp: 12 }, ...(tTele >= 0 ? [{ frame: tTele + 1, amp: 9 }] : [])]} deriva={0.5} zoom={z}>
      <Rayos c2="rgba(200,255,46,0.55)" cx={540} cy={820} vel={0.25} />
      <div style={{ position: 'absolute', left: SAFE_BOX.cx - 342, top: 160, transform: `scale(${pulso})`, transformOrigin: '50% 100%' }}>
        <LogotipoAnimado size={265} inicio={12} />
      </div>
      <UtileroActor
        entrada={10}
        desde="abajo"
        expresion={f < tUtil + 8 ? 'E1' : 'E2'}
        words={timing.words}
        offsetFrames={off}
        size={900}
        x={SAFE_BOX.cx - 450}
        y={470}
        seed={7}
      />
      <div style={{ opacity: confeti }}>
        <Particulas tipo="confeti" n={30} semilla={2} colores={[C.lima, C.tinta, C.papel, C.sello]} dir={1} velocidad={0.55} opacidad={0.9} />
      </div>
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1390} size={84} />

      <Destello at={tUtil} max={0.4} />
      <Impacto at={tUtil} x={540} y={330} flash={0.0} />
      {tTele >= 0 && <Estatica at={tTele} dur={8} />}

      <Sfx name="whoosh" at={9} volume={0.5} />
      <Sfx name="hit" at={12} volume={0.6} />
      <Sfx name="impact" at={tUtil} volume={0.85} />
      <Sfx name="pop" at={28} volume={0.6} />
      <Sfx name="wink" at={tUtil + 8} volume={0.6} />
      {tTele >= 0 && <Sfx name="static" at={tTele} volume={0.7} />}
    </Escenario>
  );
};

/**
 * APERTURA «SHH» (episodios): el Utilero se lleva la mano a la boca y susurra «Cierren la puerta, que les cuento».
 * Más íntima que la del logotipo: foco de luz, polvo, y el SHH gigante que se clava.
 */
const AperturaSusurro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const tShh = 12;
  const z = empuje(f, frames, 0.05, 6) * golpes(f, [tShh], 0.05);
  return (
    <Escenario fondo="papel" impactos={[{ frame: tShh + 2, amp: 11 }]} deriva={0.5} zoom={z}>
      <Reflector x={SAFE_BOX.cx} opacidad={0.3} ancho={900} />
      <Particulas tipo="polvo" n={26} semilla={51} colores={[C.tinta, C.grisArchivo, C.lima]} opacidad={0.3} velocidad={0.3} />
      <TituloImpacto lineas={[{ texto: esc.palabraGigante ?? 'SHH', at: tShh }]} x={SAFE_BOX.cx - 400} y={170} ancho={800} tono="tinta" maxSize={560} />
      <UtileroActor entrada={10} desde="abajo" expresion={esc.expresion ?? 'E3'} pose={esc.pose ?? 'P3'} words={timing.words} offsetFrames={off} size={800} x={SAFE_BOX.cx - 400} y={470} seed={4} />
      <Impacto at={tShh} x={540} y={330} flash={0.2} />
      <Palabras words={timing.words} offsetFrames={off} claves={esc.claves} y={1340} size={84} />
      <Sfx name="whoosh" at={9} volume={0.45} />
      <Sfx name="impact" at={tShh} volume={0.5} />
      {/* sello sonoro de marca: llave + cerrojo + golpe (el golpe cae con el SHH) */}
      <Sfx name="sello" at={tShh} volume={0.8} />
      <Sfx name="pop" at={14} volume={0.5} />
    </Escenario>
  );
};

/** Con `logo: true` (presentaciones) arma el logotipo; sin él, la apertura íntima «SHH» de los episodios. */
export const AperturaPro: React.FC<EscenaProps> = (props) => (props.esc.logo ? <AperturaLogo {...props} /> : <AperturaSusurro {...props} />);
