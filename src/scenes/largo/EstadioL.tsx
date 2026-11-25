import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Particulas } from '../../components/Fx';
import { Picto } from '../../components/Pictos';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, pop, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const COLS = 15;
const FILAS = 4; // 60 puntos = 60.000 personas (1 punto = 1.000)

/**
 * ESTADIO — una grada hecha de puntos (1 punto = 1.000 personas): se llenan 48 sólidos (cifra oficial) y 12 más de contorno
 * (hasta ~60.000 según los cálculos). Abajo, el contraste con 1949: unas cartas y unos abonos, sin cifra.
 */
export const EstadioL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const tOficial = Math.max(10, cuando(timing, off, 'cuarenta', 0, 24) - 4);
  const tEstima = Math.max(tOficial + 28, cuando(timing, off, 'sesenta', tOficial, 90) - 4);
  const t49 = Math.max(tEstima + 20, cuando(timing, off, 'quince', tEstima, 150) - 3);
  const bo = boil(f, 22, 1);
  const z = empuje(f, frames, 0.04, 8) * golpes(f, [tOficial, tEstima], 0.025);
  const x0 = 210;
  const y0 = 320;
  const dx = 78;
  const dy = 84;
  const kTit = pop(f, 4, 10);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tOficial + 24, amp: 10 }, { frame: tEstima + 14, amp: 9 }]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={22} semilla={99} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      {/* título */}
      <div style={{ position: 'absolute', left: 140, top: 60, display: 'flex', alignItems: 'center', gap: 26, opacity: Math.min(1, kTit), transform: `scale(${0.9 + 0.1 * Math.min(1, kTit)})`, transformOrigin: '0 50%' }}>
        <Picto nombre="estadio" size={150} acento={C.lima} />
        <div>
          <div style={{ fontFamily: FONT.grito, fontSize: 118, lineHeight: 0.95, color: C.tinta, textShadow: `7px 6px 0 ${C.lima}` }}>MAINE ROAD · 15 DE ABRIL DE 1964</div>
          <div style={{ fontFamily: FONT.maquina, fontSize: 36, color: C.grisArchivo, marginTop: 4 }}>1 PUNTO = 1.000 PERSONAS</div>
        </div>
      </div>
      {/* grada de puntos */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#ink)' }}>
        <g transform={`translate(${bo.x} ${bo.y})`}>
          {Array.from({ length: COLS * FILAS }).map((_, n) => {
            const fila = Math.floor(n / COLS);
            const col = n % COLS;
            const idx = fila * COLS + col; // 0..59
            const oficial = idx < 48;
            const t0 = oficial ? tOficial + Math.floor(idx / 2) : tEstima + (idx - 48);
            const k = pop(f, t0, 8);
            if (f < t0) return <circle key={n} cx={x0 + col * dx} cy={y0 + fila * dy} r={5} fill={C.tinta} opacity={0.12} />;
            return oficial ? (
              <circle key={n} cx={x0 + col * dx} cy={y0 + fila * dy} r={27 * k} fill={C.lima} stroke={C.tinta} strokeWidth={6} />
            ) : (
              <circle key={n} cx={x0 + col * dx} cy={y0 + fila * dy} r={27 * k} fill="none" stroke={C.tinta} strokeWidth={5} strokeDasharray="7 7" />
            );
          })}
        </g>
      </svg>
      {/* cifras */}
      {f >= tOficial + 20 && (
        <div style={{ position: 'absolute', left: 150, top: 700, transform: `scale(${pop(f, tOficial + 20, 10)}) rotate(-2deg)`, transformOrigin: '0 50%' }}>
          <span style={{ fontFamily: FONT.grito, fontSize: 130, color: C.tinta, background: C.lima, padding: '0 20px', lineHeight: 1 }}>48.000</span>
          <span style={{ fontFamily: FONT.maquina, fontSize: 38, color: C.tinta, marginLeft: 16 }}>CIFRA OFICIAL</span>
        </div>
      )}
      {f >= tEstima + 12 && (
        <div style={{ position: 'absolute', left: 1030, top: 700, transform: `scale(${pop(f, tEstima + 12, 10)}) rotate(2deg)`, transformOrigin: '0 50%' }}>
          <span style={{ fontFamily: FONT.grito, fontSize: 130, color: C.tinta, border: `6px dashed ${C.tinta}`, padding: '0 18px', lineHeight: 1 }}>≈60.000</span>
          <span style={{ fontFamily: FONT.maquina, fontSize: 38, color: C.tinta, marginLeft: 16 }}>SEGÚN CÁLCULOS</span>
        </div>
      )}
      {/* 1949: cartas y abonos, sin cifra */}
      {f >= t49 && (
        <div style={{ position: 'absolute', left: 1500, top: 300, width: 330, transform: `scale(${pop(f, t49, 10)}) rotate(3deg)`, transformOrigin: '50% 0' }}>
          <div style={{ background: C.kraft, border: `5px solid ${C.tinta}`, padding: '14px 18px 16px', boxShadow: '12px 14px 0 rgba(22,19,15,0.28)', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT.grito, fontSize: 90, color: C.tinta, lineHeight: 1 }}>1949</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
              <Picto nombre="sobre" size={110} acento={C.ficha} />
              <Picto nombre="abono" size={110} acento={C.lima} texto="NO" />
            </div>
            <div style={{ fontFamily: FONT.maquina, fontSize: 30, color: C.tinta, marginTop: 4 }}>AMENAZAN CON NO VOLVER</div>
          </div>
        </div>
      )}
      <Sfx name="hinchada" at={tOficial} volume={0.3} />
      <Sfx name="riser" at={tOficial} volume={0.25} />
      <Sfx name="stamp" at={tOficial + 22} volume={0.5} />
      <Sfx name="pop" at={tEstima + 12} volume={0.5} />
      <Sfx name="slap" at={t49} volume={0.45} />
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
