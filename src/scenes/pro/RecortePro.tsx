import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Impacto, Particulas } from '../../components/Fx';
import { Palabras } from '../../components/Palabras';
import { Sfx } from '../../components/Sfx';
import { empuje, golpes } from '../../lib/camara';
import { E, boil, hash, tw } from '../../lib/ease';
import { cuando } from '../../lib/voz';
import { Escenario, EscenaProps } from '../Escenario';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

/**
 * RECORTE — un recorte de periódico (inventado: «Archivo del Camerino», sin cabeceras reales) pegado con cinta: línea de
 * lugar/fecha, titular que se teclea palabra a palabra y la palabra clave que se subraya en lima cuando la voz la dice.
 * Las columnas son barras de relleno (no hay texto real). Para documentos, cartas, titulares históricos.
 */
export const RecortePro: React.FC<EscenaProps> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const off = Math.round(timing.start * FPS);
  const palabras = (esc.titular ?? '').split(' ').filter(Boolean);
  const tEntra = 8;
  const tPalabra = (i: number) => tEntra + 18 + i * 5;
  const tHL = esc.resaltar ? Math.max(tEntra + 26, cuando(timing, off, esc.resaltar, 0, tEntra + 24 + palabras.length * 5) - 1) : -1;
  const entra = tw(f, [tEntra, tEntra + 12], [0, 1], E.outBack);
  const bo = boil(f, 4, 1.2);
  const z = empuje(f, frames, 0.05, 8) * golpes(f, [tEntra + 6, tHL].filter((x) => x > 0), 0.035);
  const W = 880;
  const H = 1020;
  // borde roto del recorte
  const borde = React.useMemo(() => {
    const pts: string[] = [];
    const n = 26;
    for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${(hash(i + 1) * 1.8).toFixed(2)}%`);
    for (let i = 1; i <= 16; i++) pts.push(`${100 - hash(i + 40) * 1.4}% ${((i / 16) * 100).toFixed(1)}%`);
    for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${(100 - hash(i + 80) * 1.6).toFixed(2)}%`);
    for (let i = 15; i >= 1; i--) pts.push(`${hash(i + 120) * 1.4}% ${((i / 16) * 100).toFixed(1)}%`);
    return `polygon(${pts.join(',')})`;
  }, []);

  return (
    <Escenario fondo="papel" impactos={[{ frame: tEntra + 6, amp: 10 }, ...(tHL > 0 ? [{ frame: tHL + 2, amp: 9 }] : [])]} deriva={0.4} zoom={z}>
      <Particulas tipo="polvo" n={18} semilla={53} colores={[C.tinta, C.grisArchivo]} opacidad={0.22} velocidad={0.3} />
      <div
        style={{
          position: 'absolute', left: 100, top: 230, width: W, height: H, opacity: tw(f, [tEntra, tEntra + 3], [0, 1]),
          transform: `translate(${bo.x}px, ${(1 - entra) * 700 + bo.y}px) rotate(${-2.6 + (1 - entra) * 6}deg)`, filter: 'drop-shadow(16px 20px 0 rgba(22,19,15,0.26))',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: '#E4DCC3', clipPath: borde }} />
        <div style={{ position: 'absolute', inset: 0, clipPath: borde }}>
          <div style={{ position: 'absolute', left: 44, right: 44, top: 30, borderBottom: `4px double ${C.tinta}`, paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: FONT.susurro, fontStyle: 'italic', fontSize: 42, color: C.tinta }}>Archivo del Camerino</span>
            <span style={{ fontFamily: FONT.maquina, fontSize: 30, color: C.grisArchivo }}>{esc.linea ?? ''}</span>
          </div>
          <div style={{ position: 'absolute', left: 44, right: 44, top: 118, fontFamily: FONT.grito, fontSize: 150, lineHeight: 0.92, color: C.tinta, textTransform: 'uppercase' }}>
            {palabras.map((p, i) => {
              const k = tw(f, [tPalabra(i), tPalabra(i) + 6], [0, 1], E.outCubic);
              const resalta = esc.resaltar && norm(p) === norm(esc.resaltar);
              const kHL = resalta && tHL > 0 ? tw(f, [tHL, tHL + 8], [0, 1], E.outCubic) : 0;
              return (
                <span key={i} style={{ display: 'inline-block', marginRight: 22, visibility: f >= tPalabra(i) ? 'visible' : 'hidden', opacity: k, transform: `translateY(${(1 - k) * 24}px)`, position: 'relative' }}>
                  {resalta && <span style={{ position: 'absolute', left: -8, right: -8, top: 12, bottom: 6, background: C.lima, transform: `scaleX(${kHL})`, transformOrigin: '0 50%', zIndex: -1 }} />}
                  {p}
                </span>
              );
            })}
          </div>
          {/* foto con trama y pie */}
          <div style={{ position: 'absolute', right: 44, bottom: 150, width: 330, height: 250, border: `4px solid ${C.tinta}`, background: 'radial-gradient(circle, rgba(22,19,15,0.7) 1.6px, transparent 2.2px) 0 0 / 11px 11px, #E4DCC3', opacity: tw(f, [tEntra + 26, tEntra + 34], [0, 1]) }} />
          {/* columnas de relleno */}
          {[0, 1].map((c) =>
            Array.from({ length: 9 }).map((_, r) => (
              <div key={`${c}${r}`} style={{ position: 'absolute', left: 44 + c * 250, top: 590 + r * 38, width: 220 - hash(r + c * 9) * 60, height: 10, background: C.tinta, opacity: 0.55 * tw(f, [tEntra + 20 + r * 2, tEntra + 26 + r * 2], [0, 1]) }} />
            )),
          )}
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={`b${r}`} style={{ position: 'absolute', left: 44, top: 950 + r * 0, width: 0, height: 0 }} />
          ))}
        </div>
        {/* cintas */}
        <div style={{ position: 'absolute', left: -34, top: 12, width: 190, height: 62, background: 'rgba(233,223,196,0.82)', transform: 'rotate(-32deg)', boxShadow: '0 6px 8px rgba(22,19,15,0.25)' }} />
        <div style={{ position: 'absolute', right: -40, bottom: 20, width: 190, height: 62, background: 'rgba(233,223,196,0.82)', transform: 'rotate(-30deg)', boxShadow: '0 6px 8px rgba(22,19,15,0.25)' }} />
      </div>
      <Impacto at={tEntra + 6} x={540} y={760} flash={0.1} semilla={4} />
      {tHL > 0 && <Impacto at={tHL} x={540} y={430} flash={0.15} color={C.tinta} semilla={7} />}
      <Sfx name="paper_slide" at={tEntra + 3} volume={0.55} />
      <Sfx name="tape" at={tEntra + 12} volume={0.45} />
      <Sfx name="type_loop" at={tEntra + 18} volume={0.25} alinear="inicio" loopFor={Math.max(8, palabras.length * 5)} />
      {tHL > 0 && <Sfx name="marker" at={tHL} volume={0.5} />}
      <Palabras words={timing.words} offsetFrames={off} tono="papel" claves={esc.claves} y={1385} size={84} />
    </Escenario>
  );
};
