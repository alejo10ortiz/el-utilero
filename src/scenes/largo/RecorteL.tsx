import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Impacto, Particulas } from '../../components/Fx';
import { Sello } from '../../components/Sello';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, hash, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';
import { SubtitulosL } from './comun';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/** RECORTE horizontal — recorte de periódico inventado («Archivo del Camerino») pegado con cinta; el titular se teclea y la palabra clave se subraya. */
export const RecorteL: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const palabras = (esc.titular ?? '').split(' ').filter(Boolean);
  const tEntra = 4;
  const tPalabra = (i: number) => tEntra + 18 + i * 5;
  const tHL = esc.resaltar ? Math.max(tEntra + 26, cuando(timing, off, esc.resaltar, 0, tEntra + 24 + palabras.length * 5) - 1) : -1;
  const tSello = esc.sello ? Math.max(tEntra + 40, cuando(timing, off, esc.claves?.[1] ?? esc.sello, 0, tEntra + 60)) : -1;
  const entra = tw(f, [tEntra, tEntra + 12], [0, 1], E.outBack);
  const bo = boil(f, 4, 1.2);
  const z = empuje(f, frames, 0.05, 8) * golpes(f, [tEntra + 6, tHL, tSello].filter((x) => x > 0), 0.035);
  const W = 1320;
  const H = 700;
  const borde = React.useMemo(() => {
    const pts: string[] = [];
    const n = 34;
    for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${(hash(i + 1) * 2).toFixed(2)}%`);
    for (let i = 1; i <= 14; i++) pts.push(`${100 - hash(i + 40) * 1.2}% ${((i / 14) * 100).toFixed(1)}%`);
    for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${(100 - hash(i + 80) * 2).toFixed(2)}%`);
    for (let i = 13; i >= 1; i--) pts.push(`${hash(i + 120) * 1.2}% ${((i / 14) * 100).toFixed(1)}%`);
    return `polygon(${pts.join(',')})`;
  }, []);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tEntra + 6, amp: 10 }, ...(tHL > 0 ? [{ frame: tHL + 2, amp: 9 }] : []), ...(tSello > 0 ? [{ frame: tSello + 3, amp: 14 }] : [])]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={20} semilla={53} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <div
        style={{
          position: 'absolute', left: 300, top: 90, width: W, height: H, opacity: tw(f, [tEntra, tEntra + 3], [0, 1]),
          transform: `translate(${bo.x}px, ${(1 - entra) * 700 + bo.y}px) rotate(${-1.6 + (1 - entra) * 5}deg)`, filter: 'drop-shadow(16px 20px 0 rgba(22,19,15,0.26))',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: '#E4DCC3', clipPath: borde }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: borde }}>
          <div style={{ position: 'absolute', left: 50, right: 50, top: 30, borderBottom: `4px double ${C.tinta}`, paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: FONT.susurro, fontStyle: 'italic', fontSize: 44, color: C.tinta }}>Archivo del Camerino</span>
            <span style={{ fontFamily: FONT.maquina, fontSize: 30, color: C.grisArchivo }}>{esc.linea ?? ''}</span>
          </div>
          <div style={{ position: 'absolute', left: 50, right: 50, top: 120, fontFamily: FONT.grito, fontSize: 140, lineHeight: 0.92, color: C.tinta, textTransform: 'uppercase' }}>
            {palabras.map((p, i) => {
              const k = tw(f, [tPalabra(i), tPalabra(i) + 6], [0, 1], E.outCubic);
              const resalta = esc.resaltar && norm(p) === norm(esc.resaltar);
              const kHL = resalta && tHL > 0 ? tw(f, [tHL, tHL + 8], [0, 1], E.outCubic) : 0;
              return (
                <span key={i} style={{ display: 'inline-block', marginRight: 24, visibility: f >= tPalabra(i) ? 'visible' : 'hidden', opacity: k, transform: `translateY(${(1 - k) * 24}px)`, position: 'relative' }}>
                  {resalta && <span style={{ position: 'absolute', left: -8, right: -8, top: 12, bottom: 6, background: C.lima, transform: `scaleX(${kHL})`, transformOrigin: '0 50%', zIndex: -1 }} />}
                  {p}
                </span>
              );
            })}
          </div>
          {/* foto con trama */}
          <div style={{ position: 'absolute', right: 50, bottom: 60, width: 330, height: 220, border: `4px solid ${C.tinta}`, background: 'radial-gradient(circle, rgba(22,19,15,0.7) 1.6px, transparent 2.2px) 0 0 / 11px 11px, #E4DCC3', opacity: tw(f, [tEntra + 26, tEntra + 34], [0, 1]) }} />
          {/* columnas de relleno (barras, no texto) */}
          {[0, 1, 2].map((c) =>
            Array.from({ length: 6 }).map((_, r) => (
              <div key={`${c}${r}`} style={{ position: 'absolute', left: 50 + c * 285, top: 470 + r * 34, width: 255 - hash(r + c * 9) * 70, height: 9, background: C.tinta, opacity: 0.5 * tw(f, [tEntra + 20 + r * 2, tEntra + 26 + r * 2], [0, 1]) }} />
            )),
          )}
        </div>
        <div style={{ position: 'absolute', left: -34, top: 12, width: 190, height: 62, background: 'rgba(233,223,196,0.82)', transform: 'rotate(-32deg)', boxShadow: '0 6px 8px rgba(22,19,15,0.25)' }} />
        <div style={{ position: 'absolute', right: -40, bottom: 20, width: 190, height: 62, background: 'rgba(233,223,196,0.82)', transform: 'rotate(-30deg)', boxShadow: '0 6px 8px rgba(22,19,15,0.25)' }} />
      </div>
      {esc.sello && tSello > 0 && <Sello texto={esc.sello} x={1330} y={600} size={190} rot={-9} delay={tSello} mezcla="normal" />}
      <Impacto at={tEntra + 6} x={960} y={440} flash={0.1} semilla={4} />
      {tHL > 0 && <Impacto at={tHL} x={960} y={290} flash={0.15} color={C.tinta} semilla={7} />}
      <Sfx name="paper_slide" at={tEntra + 3} volume={0.55} />
      <Sfx name="tape" at={tEntra + 12} volume={0.45} />
      <Sfx name="type_loop" at={tEntra + 18} volume={0.25} alinear="inicio" loopFor={Math.max(8, palabras.length * 5)} />
      {tHL > 0 && <Sfx name="marker" at={tHL} volume={0.5} />}
      <SubtitulosL esc={esc} timing={timing} off={off} />
    </Escenario>
  );
};
