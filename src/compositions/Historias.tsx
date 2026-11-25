import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { C, FONT } from '../../config/brand';
import { Cinta } from '../components/Cinta';
import { ConFuentes } from '../components/ConFuentes';
import { Defs } from '../components/Defs';
import { Fondo } from '../components/Fondo';
import { Grano } from '../components/Grano';
import { Sello } from '../components/Sello';
import { Utilero } from '../components/Utilero';
import { TemaProvider } from '../lib/tema';

/**
 * HISTORIAS (9:16, 1080×1920) para redes: láminas fijas que promocionan un video largo con la línea gráfica de «El Camerino».
 * Cuatro láminas: 1 gancho (collarín) · 2 quién era (retrato) · 3 pregunta (radiografía) · 4 veredicto + llamada a YouTube.
 * Zonas de las historias: arriba ~230 px y abajo ~340 px los tapa la interfaz de la red → lo importante queda en y 230–1580.
 * Las fotos son de licencia libre (Wikimedia Commons) y llevan su crédito pequeño y vertical, igual que en el video.
 */
export type HistoriaProps = { n: 1 | 2 | 3 | 4 };

const W = 1080;
const H = 1920;

/** Línea de titular que se ajusta al ancho dado (League Gothic), con sombra lima o barra lima. */
const Linea: React.FC<{ texto: string; y: number; x?: number; ancho?: number; max?: number; rot?: number; barra?: boolean; sombra?: boolean; color?: string }> = ({
  texto, y, x = 60, ancho = 960, max = 300, rot = 0, barra = false, sombra = false, color = C.tinta,
}) => {
  const size = Math.min(max, fitText({ text: texto, withinWidth: ancho, fontFamily: 'League Gothic', fontWeight: '400' }).fontSize);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, fontFamily: FONT.grito, fontSize: size, lineHeight: 0.92, color, whiteSpace: 'nowrap',
        textShadow: sombra ? `${size * 0.045}px ${size * 0.04}px 0 ${C.lima}` : 'none', transform: `rotate(${rot}deg)`, transformOrigin: '0 50%', filter: 'url(#ink)',
      }}
    >
      {barra ? <span style={{ background: C.lima, padding: `0 ${size * 0.08}px` }}>{texto}</span> : texto}
    </div>
  );
};

/** Copia de archivo estática: foto B/N con borde de papel, cinta en las esquinas, pie de foto y crédito vertical. */
const Copia: React.FC<{ foto: string; credito: string; x: number; y: number; ancho: number; ratio: number; rot?: number; pie?: string; foco?: string; lado?: 'der' | 'izq' }> = ({
  foto, credito, x, y, ancho, ratio, rot = 0, pie, foco = '50% 50%', lado = 'der',
}) => {
  const borde = 16;
  const altoImg = (ancho - borde * 2) / ratio;
  const alto = altoImg + borde * 2;
  const recorteCinta = 'polygon(0 12%,3% 0,50% 5%,97% 0,100% 14%,98% 88%,100% 100%,52% 94%,3% 100%,0 86%)';
  return (
    <div style={{ position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, background: C.ficha, boxShadow: '12px 14px 0 rgba(22,19,15,0.26)' }} />
      <div style={{ position: 'absolute', left: borde, top: borde, width: ancho - borde * 2, height: altoImg, overflow: 'hidden', background: C.tinta }}>
        <Img src={staticFile(foto)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: foco, filter: 'grayscale(1) contrast(1.14) brightness(1.03) sepia(0.2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: C.cinta, mixBlendMode: 'multiply', opacity: 0.22 }} />
      </div>
      {[-1, 1].map((s) => (
        <div key={s} style={{ position: 'absolute', top: -20, left: s < 0 ? -30 : ancho - 110, width: 140, height: 42, background: C.cinta, opacity: 0.94, transform: `rotate(${s * -22}deg)`, boxShadow: '2px 3px 0 rgba(22,19,15,0.16)', clipPath: recorteCinta }} />
      ))}
      {pie && (
        <div
          style={{
            position: 'absolute', left: borde + 8, top: alto - 8, transform: 'rotate(-1.5deg)', transformOrigin: '0 0', whiteSpace: 'nowrap', fontFamily: FONT.maquina, fontSize: 34, color: C.tinta, background: C.cinta,
            padding: '5px 18px', clipPath: 'polygon(0 10%,2% 0,50% 4%,98% 0,100% 12%,99% 90%,100% 100%,52% 95%,2% 100%,0 88%)',
          }}
        >
          {pie}
        </div>
      )}
      <div
        style={{
          position: 'absolute', top: 4, [lado === 'der' ? 'left' : 'right']: ancho + 12, maxHeight: alto + 10, writingMode: lado === 'der' ? 'vertical-lr' : 'vertical-rl',
          width: 'max-content', maxWidth: 60, fontFamily: FONT.maquina, fontSize: 19, lineHeight: 1.15, color: C.tinta, opacity: 0.8, letterSpacing: 0.3,
        }}
      >
        FOTO: {credito}
      </div>
    </div>
  );
};

/** Hoja de rayos X del cuello (vértebras dibujadas) con un interrogante: la pregunta que cuelga el video. */
const Radiografia: React.FC<{ x: number; y: number; ancho: number; alto: number; escala?: number }> = ({ x, y, ancho, alto, escala = 1 }) => {
  const cx = ancho / 2;
  const vert = Array.from({ length: 7 }, (_, i) => ({ y: 250 + i * 78, w: 150 + i * 8 }));
  return (
    <div style={{ position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, transform: `rotate(-2deg) scale(${escala})` }}>
      <div style={{ position: 'absolute', inset: 0, background: '#0F1412', border: `8px solid ${C.cinta}`, boxShadow: '12px 14px 0 rgba(0,0,0,0.35)' }} />
      <div style={{ position: 'absolute', left: 26, top: 20, fontFamily: FONT.maquina, fontSize: 30, letterSpacing: 3, color: C.lima }}>RADIOGRAFÍA · CUELLO</div>
      <svg width={ancho} height={alto} style={{ position: 'absolute', inset: 0, filter: 'url(#ink)' }}>
        <path d={`M${cx - 120} 232 Q${cx - 128} 92 ${cx} 86 Q${cx + 128} 92 ${cx + 120} 232 Q${cx + 70} 258 ${cx} 258 Q${cx - 70} 258 ${cx - 120} 232 Z M${cx - 90} 246 Q${cx - 20} 296 ${cx + 76} 250`} fill="none" stroke={C.tiza} strokeWidth={6} opacity={0.55} />
        {vert.map((v, i) => (
          <g key={i}>
            <rect x={cx - v.w / 2} y={v.y + 40} width={v.w} height={56} rx={24} fill="rgba(237,235,228,0.14)" stroke={C.tiza} strokeWidth={6} />
            <path d={`M${cx - v.w / 2 + 24} ${v.y + 68} H${cx + v.w / 2 - 24}`} stroke={C.tiza} strokeWidth={3} opacity={0.45} strokeDasharray="2 12" strokeLinecap="round" />
            <path d={`M${cx + v.w / 2 - 6} ${v.y + 56} L${cx + v.w / 2 + 60} ${v.y + 46} L${cx + v.w / 2 + 60} ${v.y + 70} Z`} fill="rgba(237,235,228,0.38)" stroke={C.tiza} strokeWidth={4} strokeLinejoin="round" />
          </g>
        ))}
        {/* una vértebra señalada: la pregunta */}
        <ellipse cx={cx} cy={vert[3].y + 68} rx={vert[3].w / 2 + 44} ry={52} fill="none" stroke={C.lima} strokeWidth={9} strokeDasharray="16 12" />
      </svg>
      <div style={{ position: 'absolute', left: cx + 190, top: vert[3].y - 40, fontFamily: FONT.grito, fontSize: 230, lineHeight: 1, color: C.lima, filter: 'url(#ink)' }}>?</div>
    </div>
  );
};

/** Hoja con las cuatro diferencias entre fuentes (máquina de escribir sobre papel). */
const HojaFuentes: React.FC<{ x: number; y: number; ancho: number }> = ({ x, y, ancho }) => {
  const filas: [string, string][] = [
    ['MINUTO DEL CHOQUE', '73′ / 75′'],
    ['MINUTOS JUGADOS DESPUÉS', '16′ / 17′'],
    ['DÍAS HASTA LA RADIOGRAFÍA', '3 / 4'],
    ['MANIFESTANTES EN 1949', 'SIN CIFRA'],
  ];
  const alto = 70 + filas.length * 112;
  return (
    <div style={{ position: 'absolute', left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, transform: 'rotate(1.5deg)' }}>
      <div style={{ position: 'absolute', inset: 0, background: C.ficha, boxShadow: '12px 14px 0 rgba(22,19,15,0.24)', clipPath: 'polygon(0 1.5%,3% 0,50% 1%,97% 0,100% 1.5%,99.5% 98%,100% 100%,52% 99%,3% 100%,0 98%)' }} />
      <div style={{ position: 'absolute', left: 30, top: 14, fontFamily: FONT.maquina, fontSize: 28, color: C.grisArchivo, letterSpacing: 2 }}>LAS FUENTES NO DICEN IGUAL</div>
      {filas.map(([a, b], i) => (
        <div key={i} style={{ position: 'absolute', left: 30, right: 30, top: 66 + i * 112, height: 100, borderBottom: `3px dashed ${C.grisArchivo}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONT.maquina, fontSize: 30, color: C.tinta, lineHeight: 1.05 }}>{a}</div>
          <div style={{ fontFamily: FONT.grito, fontSize: 64, color: C.tinta, lineHeight: 1, marginTop: 4 }}>
            <span style={{ background: C.lima, padding: '0 14px' }}>{b}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CREDITO_COLLARIN = 'Smabs Sputzer · CC BY 2.0 · Wikimedia Commons';
const CREDITO_RETRATO = 'Jörg Zägel · CC BY-SA 4.0 · Wikimedia Commons';

export const Historia: React.FC<HistoriaProps> = ({ n }) => {
  const oscuro = n === 3;
  return (
    <ConFuentes>
      <AbsoluteFill>
        <Defs />
        <TemaProvider id="plano">
          <Fondo tipo={oscuro ? 'pizarra' : 'papel'} width={W} height={H} />
        </TemaProvider>

        {n === 1 && (
          <>
            <Cinta texto="NUEVO EXPEDIENTE DEL CAMERINO" x={540} y={262} rot={-3} size={46} delay={-99} sonido={false} />
            <Cinta texto="JUGÓ EL FINAL DE UNA FINAL" x={540} y={395} rot={1.5} size={50} delay={-99} sonido={false} color={C.lima} />
            <Linea texto="CON EL CUELLO" y={455} max={300} rot={-2} sombra />
            <Linea texto="ROTO" y={690} max={340} rot={1.5} barra />
            <Copia foto="fotos/L01-trautmann/collarin.jpg" credito={CREDITO_COLLARIN} x={690} y={1305} ancho={420} ratio={0.8} rot={-3} pie="EL COLLARÍN DE TRAUTMANN" foco="50% 40%" />
            <Sello texto="NUEVO VIDEO" x={250} y={1250} rot={-9} size={92} delay={-99} sonido={false} />
            <Cinta texto="WEMBLEY · 1956" x={290} y={1430} rot={-3} size={52} delay={-99} sonido={false} />
          </>
        )}

        {n === 2 && (
          <>
            <Cinta texto="EXPEDIENTE DEL CAMERINO · EL HOMBRE" x={540} y={262} rot={2} size={44} delay={-99} sonido={false} />
            <Linea texto="¿QUIÉN ERA" y={330} max={300} rot={-2} sombra />
            <Linea texto="ESE PORTERO?" y={590} max={300} rot={1.2} barra />
            <Copia foto="fotos/L01-trautmann/trautmann-2010.jpg" credito={CREDITO_RETRATO} x={440} y={1215} ancho={520} ratio={0.78} rot={2.5} pie="BERT TRAUTMANN · OCTUBRE DE 2010" foco="50% 28%" lado="izq" />
            <Cinta texto="ALEMÁN" x={810} y={1000} rot={-6} size={54} delay={-99} sonido={false} />
            <Cinta texto="EXPARACAIDISTA" x={820} y={1120} rot={4} size={54} delay={-99} sonido={false} />
            <Cinta texto="PORTERO DEL CITY" x={810} y={1240} rot={-3} size={54} delay={-99} sonido={false} />
          </>
        )}

        {n === 3 && (
          <>
            <Cinta texto="WEMBLEY · 5 DE MAYO DE 1956" x={540} y={262} rot={-2} size={46} delay={-99} sonido={false} />
            <Linea texto="¿QUÉ DESCUBRIÓ" y={330} max={260} rot={-1.5} color={C.tiza} />
            <Linea texto="EL MÉDICO?" y={560} max={300} rot={1} barra color={C.tinta} />
            <Radiografia x={540} y={1225} ancho={640} alto={820} escala={0.84} />
            <Cinta texto="UNOS DÍAS DESPUÉS…" x={540} y={1565} rot={-2} size={52} delay={-99} sonido={false} />
          </>
        )}

        {n === 4 && (
          <>
            <Cinta texto="EL VEREDICTO" x={540} y={262} rot={-3} size={52} delay={-99} sonido={false} />
            <Sello texto="VERIFICADO*" x={540} y={470} rot={-6} size={190} delay={-99} sonido={false} />
            <Cinta texto="CON ASTERISCOS" x={540} y={680} rot={2} size={58} delay={-99} sonido={false} color={C.lima} />
            <HojaFuentes x={365} y={1070} ancho={640} />
            <Utilero expresion="E7" size={560} x={560} y={930} vivo={false} sobre="papel" />
            <Cinta texto="VIDEO COMPLETO EN YOUTUBE" x={540} y={1500} rot={-2} size={50} delay={-99} sonido={false} />
          </>
        )}

        <Grano width={W} height={H} />
      </AbsoluteFill>
    </ConFuentes>
  );
};
