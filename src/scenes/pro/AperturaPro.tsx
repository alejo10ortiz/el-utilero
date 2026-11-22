import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FPS, SAFE_BOX } from '../../../config/brand';
import { LogotipoAnimado } from '../../components/Cinetica';
import { Destello, Estatica, Impacto, Particulas, Rayos } from '../../components/Fx';
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
export const AperturaPro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
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
