import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT } from '../../config/brand';
import type { ObjetoTipo } from '../lib/episode';

/**
 * Objetos del día (§3.3): genéricos, dibujados por nosotros, dos tintas (tinta + lima) con trama de puntos.
 * NUNCA fotos con derechos ni logos. Cada uno lleva su etiqueta colgante escrita a máquina.
 * viewBox 400×440; el centro del objeto queda hacia (200, 230).
 */

const Etiqueta: React.FC<{ texto: string; sway: number }> = ({ texto, sway }) => (
  <g transform={`translate(300 118) rotate(${sway} 0 0)`}>
    <path d="M0 0 C-8 20 -14 40 -10 60" fill="none" stroke={C.tinta} strokeWidth={2.2} />
    <g transform="translate(-10 58) rotate(6)">
      <rect x={-8} y={0} width={128} height={150} fill={C.kraft} stroke={C.tinta} strokeWidth={3} />
      <path d="M-8 0 L6 0 L-8 14 Z" fill={C.papel} stroke={C.tinta} strokeWidth={2} />
      <circle cx={8} cy={14} r={5} fill={C.papel} stroke={C.tinta} strokeWidth={2.5} />
      {texto.split(' · ').map((t, i) => (
        <text key={i} x={4} y={44 + i * 22} fontFamily={FONT.maquina} fontSize={14} fill={C.tinta}>
          {t}
        </text>
      ))}
    </g>
  </g>
);

const Bulto: React.FC = () => {
  // bulto envuelto en periódico: dos tintas con desregistro lima
  const forma = 'M70 150 C60 110 120 84 200 90 C280 84 338 112 334 160 C348 220 340 300 318 346 C290 392 120 396 90 340 C64 292 82 210 70 150 Z';
  const renglones = Array.from({ length: 11 }).map((_, i) => 118 + i * 24);
  return (
    <g>
      <path d={forma} transform="translate(9 7)" fill={C.lima} />
      <path d={forma} fill={C.ficha} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
      <clipPath id="clip-bulto"><path d={forma} /></clipPath>
      <g clipPath="url(#clip-bulto)">
        {/* titular del periódico */}
        <rect x={96} y={118} width={210} height={22} fill={C.tinta} transform="rotate(-3 200 130)" />
        <rect x={110} y={148} width={150} height={9} fill={C.tinta} opacity={0.85} transform="rotate(-3 200 130)" />
        {renglones.map((y, i) => (
          <g key={i} transform="rotate(-3 200 230)" opacity={0.78}>
            <rect x={96} y={y + 52} width={92 - (i % 3) * 8} height={5} fill={C.tinta} />
            <rect x={204} y={y + 52} width={96 - ((i + 1) % 4) * 9} height={5} fill={C.tinta} />
          </g>
        ))}
        {/* foto de periódico con trama */}
        <rect x={104} y={196} width={86} height={64} fill="url(#dots)" stroke={C.tinta} strokeWidth={2} transform="rotate(-3 200 230)" />
        {/* sombra de pliegue */}
        <path d="M70 170 C120 210 120 300 96 360 L128 372 C150 300 140 214 98 160 Z" fill="url(#dots)" opacity={0.5} />
      </g>
      {/* pliegues */}
      <path d="M200 90 C214 170 206 280 196 394" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="10 8" opacity={0.55} />
      <path d="M68 250 C150 262 270 262 340 244" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="10 8" opacity={0.55} />
      {/* cordel y moño */}
      <path d="M66 214 C150 230 270 230 338 212" fill="none" stroke={C.tinta} strokeWidth={5} />
      <path d="M200 90 C204 150 202 300 200 396" fill="none" stroke={C.tinta} strokeWidth={5} />
      <g transform="translate(200 224)">
        <path d="M0 0 C-30 -30 -54 -14 -44 6 C-36 20 -12 10 0 0 Z" fill={C.lima} stroke={C.tinta} strokeWidth={4} />
        <path d="M0 0 C30 -30 54 -14 44 6 C36 20 12 10 0 0 Z" fill={C.lima} stroke={C.tinta} strokeWidth={4} />
        <circle cx={0} cy={0} r={9} fill={C.tinta} />
      </g>
    </g>
  );
};

const Botin: React.FC = () => {
  const bota = 'M60 250 C60 200 80 120 130 100 C170 90 200 110 214 150 C250 160 330 190 350 250 C360 290 340 320 300 322 L92 322 C70 322 60 300 60 250 Z';
  return (
    <g>
      <path d={bota} transform="translate(9 7)" fill={C.lima} />
      <path d={bota} fill={C.papel} stroke={C.tinta} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M60 250 C60 200 80 120 130 100 C170 90 200 110 214 150 C170 140 130 170 120 250 Z" fill="url(#dots)" opacity={0.7} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M${150 + i * 18} ${112 + i * 14} l46 -10`} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${160 + i * 18} ${126 + i * 14} l46 -10`} stroke={C.tinta} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
      <rect x={60} y={322} width={290} height={18} fill={C.tinta} />
      {[96, 150, 228, 290].map((x) => (
        <path key={x} d={`M${x} 340 l-8 30 h30 l-8 -30 Z`} fill={C.tinta} />
      ))}
    </g>
  );
};


/** Llave a medida (cabeza-balón) apuntando hacia abajo, origen en el centro de la cabeza. */
const LlaveDibujo: React.FC<{ largo?: number; fill?: string }> = ({ largo = 150, fill = C.tinta }) => (
  <g>
    <circle cx={0} cy={0} r={24} fill={fill} />
    <polygon points="0,-13 12,-4 7,10 -7,10 -12,-4" fill={C.lima} />
    <rect x={-8} y={20} width={16} height={largo} rx={3} fill={fill} />
    <rect x={8} y={largo - 20} width={24} height={12} fill={fill} />
    <rect x={8} y={largo + 2} width={17} height={12} fill={fill} />
  </g>
);

/** Llavero: aro con tres llaves y etiqueta de cartón. */
const Llavero: React.FC = () => (
  <g>
    <g transform="translate(208 130)">
      <circle cx={0} cy={0} r={52} fill="none" stroke={C.lima} strokeWidth={11} transform="translate(8 6)" />
      <circle cx={0} cy={0} r={52} fill="none" stroke={C.tinta} strokeWidth={9} />
    </g>
    {[{ a: -26, d: 190 }, { a: 4, d: 220 }, { a: 28, d: 180 }].map((k, i) => (
      <g key={i} transform={`translate(208 150) rotate(${k.a}) translate(0 52)`}>
        <g transform="translate(7 5)" opacity={1}><LlaveDibujo largo={k.d - 90} fill={C.lima} /></g>
        <LlaveDibujo largo={k.d - 90} />
      </g>
    ))}
    <g transform="translate(150 330) rotate(-8)">
      <path d="M0 0 L-6 -24" stroke={C.tinta} strokeWidth={2.4} />
      <rect x={-34} y={0} width={74} height={50} fill={C.kraft} stroke={C.tinta} strokeWidth={3} />
      <text x={-28} y={30} fontFamily={FONT.maquina} fontSize={15} fill={C.tinta}>CAMERINO</text>
    </g>
  </g>
);

/** Hoja de calendario de taco: "HOY HACE X AÑOS". Sin fechas reales: es un recurso gráfico. */
const Calendario: React.FC = () => (
  <g>
    <rect x={78} y={96} width={250} height={300} transform="translate(9 7)" fill={C.lima} />
    <rect x={78} y={96} width={250} height={300} fill={C.ficha} stroke={C.tinta} strokeWidth={4.5} />
    <rect x={78} y={96} width={250} height={70} fill={C.tinta} />
    <text x={203} y={148} textAnchor="middle" fontFamily={FONT.grito} fontSize={56} fill={C.ficha} letterSpacing={4}>HOY HACE</text>
    <text x={203} y={318} textAnchor="middle" fontFamily={FONT.grito} fontSize={190} fill={C.tinta}>X</text>
    <text x={203} y={370} textAnchor="middle" fontFamily={FONT.maquina} fontSize={30} fill={C.grisArchivo} letterSpacing={6}>AÑOS</text>
    {[130, 203, 276].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={92} r={11} fill={C.papel} stroke={C.tinta} strokeWidth={3.5} />
        <rect x={cx - 3} y={72} width={6} height={30} rx={3} fill={C.tinta} />
      </g>
    ))}
    <path d="M78 396 q125 24 250 0" fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="8 6" opacity={0.5} />
  </g>
);


/** Vitrina vacía (Copa robada): base de madera, vidrio con reflejos, terciopelo y el contorno a tiza de lo que ya no está. */
const Vitrina: React.FC = () => {
  const copa = 'M165 160 H235 C235 205 220 226 200 232 C180 226 165 205 165 160 Z';
  return (
    <g>
      {/* desregistro lima */}
      <rect x={84} y={96} width={236} height={274} rx={4} transform="translate(9 7)" fill={C.lima} />
      {/* base de madera */}
      <rect x={70} y={330} width={260} height={52} fill={C.kraft} stroke={C.tinta} strokeWidth={4} />
      <path d="M70 346 H330 M70 364 H330" stroke={C.tinta} strokeWidth={2} opacity={0.4} />
      {/* interior oscuro */}
      <rect x={90} y={104} width={220} height={226} fill={C.tinta} />
      {/* pedestal de terciopelo */}
      <path d="M150 330 L160 276 H240 L250 330 Z" fill={C.kraftOscuro} stroke={C.papel} strokeWidth={2.5} />
      <rect x={156} y={266} width={88} height={12} fill={C.kraft} stroke={C.papel} strokeWidth={2.5} />
      {/* contorno a tiza de la copa que no está */}
      <g fill="none" stroke={C.papel} strokeWidth={3.5} strokeDasharray="9 7" strokeLinecap="round" strokeLinejoin="round">
        <path d={copa} />
        <path d="M166 172 C140 172 140 208 172 208" />
        <path d="M234 172 C260 172 260 208 228 208" />
        <path d="M192 230 V258 H208 V230" />
        <path d="M176 258 H224" />
      </g>
      <text x={200} y={200} textAnchor="middle" fontFamily={FONT.grito} fontSize={64} fill={C.lima}>?</text>
      {/* marco y vidrio */}
      <rect x={90} y={104} width={220} height={226} fill="none" stroke={C.tinta} strokeWidth={6} />
      <rect x={84} y={96} width={232} height={14} fill={C.kraft} stroke={C.tinta} strokeWidth={4} />
      <path d="M110 118 L170 118 L112 190 Z" fill={C.papel} opacity={0.22} />
      <path d="M244 124 L296 124 L270 168 Z" fill={C.papel} opacity={0.16} />
      {/* vidrio roto: grieta que sale de la esquina */}
      <path d="M310 104 L262 150 L276 168 L238 208 M262 150 L240 132 M276 168 L304 176" fill="none" stroke={C.papel} strokeWidth={2.6} strokeLinejoin="round" />
      {/* bisagra y cerradura forzada */}
      <rect x={298} y={196} width={14} height={34} fill={C.kraftOscuro} stroke={C.tinta} strokeWidth={2.5} />
      <circle cx={305} cy={213} r={4} fill={C.tinta} />
    </g>
  );
};

/** Balón con flecha de retorno (autogoles): papel + tinta, pentágonos en trama y la flecha que vuelve a la propia portería. */
const Balon: React.FC = () => {
  const cx = 190, cy = 236, R = 112;
  const pent = (x: number, y: number, r: number, rot: number) =>
    Array.from({ length: 5 }).map((_, i) => {
      const a = ((rot + i * 72) * Math.PI) / 180;
      return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
  const vert = (r: number, rot: number, i: number): [number, number] => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} transform="translate(9 7)" fill={C.lima} />
      <clipPath id="clip-balon"><circle cx={cx} cy={cy} r={R} /></clipPath>
      <circle cx={cx} cy={cy} r={R} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
      <g clipPath="url(#clip-balon)">
        {Array.from({ length: 5 }).map((_, i) => {
          const [x1, y1] = vert(38, -90, i);
          const [x2, y2] = vert(R + 6, -90, i);
          const [px, py] = vert(R + 14, -54, i);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.tinta} strokeWidth={4} />
              <polygon points={pent(px, py, 40, -54 + i * 72 + 36)} fill={C.tinta} stroke={C.tinta} strokeWidth={3} strokeLinejoin="round" />
            </g>
          );
        })}
        <polygon points={pent(cx, cy, 40, -90)} fill={C.tinta} stroke={C.tinta} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M${cx - 80} ${cy + 70} C${cx - 20} ${cy + 110} ${cx + 60} ${cy + 100} ${cx + 100} ${cy + 40}`} fill="none" stroke={C.tinta} strokeWidth={2.5} opacity={0.35} strokeDasharray="6 6" />
      </g>
      {/* flecha que vuelve: el balón regresa a su propia portería */}
      <path d="M312 150 C372 130 376 250 300 322" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" strokeDasharray="14 10" />
      <path d="M300 322 L330 318 M300 322 L304 292" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** Bandera de juez de línea: asta, paño partido en dos tintas y la mano que no la levanta (queda caída). */
const Bandera: React.FC = () => (
  <g>
    {/* desregistro lima del paño */}
    <path d="M150 120 L330 150 L318 270 L140 248 Z" transform="translate(9 7)" fill={C.lima} />
    {/* asta */}
    <path d="M116 400 L156 96" fill="none" stroke={C.tinta} strokeWidth={13} strokeLinecap="round" />
    <path d="M116 400 L156 96" fill="none" stroke={C.kraft} strokeWidth={6} strokeLinecap="round" />
    <circle cx={158} cy={90} r={11} fill={C.tinta} />
    {/* paño partido en diagonal */}
    <clipPath id="clip-bandera"><path d="M150 120 L330 150 L318 270 L140 248 Z" /></clipPath>
    <path d="M150 120 L330 150 L318 270 L140 248 Z" fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    <g clipPath="url(#clip-bandera)">
      <path d="M150 120 L330 150 L140 248 Z" fill={C.tinta} />
      <path d="M150 120 L330 150 L140 248 Z" fill="url(#dots)" opacity={0.55} />
    </g>
    <path d="M150 120 L330 150 L318 270 L140 248 Z" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    {/* pliegue del paño caído */}
    <path d="M200 132 C214 170 210 214 196 252 M260 142 C272 180 270 226 258 262" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="8 7" opacity={0.5} />
    {/* marca de «nunca subió»: flecha hacia arriba tachada */}
    <path d="M252 392 L252 330 M232 350 L252 326 L272 350" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    <path d="M226 382 L280 334" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Silbato de árbitro (inclinado para que la boquilla asome sobre las manos): boquilla, cámara lisa con reflejo lima, ventana, bolita y anilla. */
const Silbato: React.FC = () => (
  <g transform="rotate(-30 200 250)">
    <circle cx={200} cy={250} r={88} transform="translate(9 7)" fill={C.lima} />
    {/* boquilla */}
    <path d="M44 212 L192 212 L192 292 L62 292 Q36 292 36 252 Q36 212 44 212 Z" fill={C.papel} stroke={C.tinta} strokeWidth={6} strokeLinejoin="round" />
    <path d="M52 232 H186 M52 272 H186" stroke={C.tinta} strokeWidth={3} opacity={0.35} />
    {/* cámara */}
    <circle cx={200} cy={250} r={88} fill={C.papel} stroke={C.tinta} strokeWidth={6} />
    <path d="M136 296 A70 70 0 0 0 266 286" fill="none" stroke={C.lima} strokeWidth={12} strokeLinecap="round" />
    {/* ventana */}
    <path d="M112 210 L190 210 L172 238 L112 238 Z" fill={C.tinta} />
    {/* bolita */}
    <circle cx={206} cy={262} r={26} fill={C.tinta} />
    <circle cx={198} cy={254} r={7} fill={C.lima} />
    {/* anilla */}
    <circle cx={286} cy={168} r={22} fill="none" stroke={C.tinta} strokeWidth={8} />
    <path d="M298 150 C318 120 312 96 290 88" fill="none" stroke={C.tinta} strokeWidth={5} strokeLinecap="round" strokeDasharray="10 8" />
    {/* ondas de sonido: el silbato que alguien creyó oír */}
    <path d="M96 176 C100 150 118 134 142 130 M72 170 C74 132 104 106 140 102" fill="none" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Camiseta blanca sin número ni escudo (Brasil 1950): papel con contorno tinta, cuello y puños, escudo solo insinuado a puntos. */
const Camiseta: React.FC = () => {
  const forma = 'M150 100 L80 130 L28 212 L86 248 L112 216 L112 384 L288 384 L288 216 L314 248 L372 212 L320 130 L250 100 Q200 160 150 100 Z';
  return (
    <g>
      <path d={forma} transform="translate(9 7)" fill={C.lima} />
      <path d={forma} fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
      {/* cuello y puños */}
      <path d="M150 100 Q200 160 250 100" fill="none" stroke={C.tinta} strokeWidth={11} strokeLinecap="round" />
      <path d="M40 196 L96 232 M360 196 L304 232" stroke={C.tinta} strokeWidth={8} strokeLinecap="round" />
      {/* pliegues */}
      <path d="M130 250 C150 300 138 340 128 376 M270 250 C250 300 262 340 272 376" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="8 7" opacity={0.45} />
      {/* escudo solo insinuado: sin logos */}
      <circle cx={246} cy={206} r={22} fill="none" stroke={C.tinta} strokeWidth={3} strokeDasharray="5 6" opacity={0.7} />
      <path d="M150 384 H250" stroke={C.tinta} strokeWidth={3} opacity={0.3} />
    </g>
  );
};

/** Servilleta con el compromiso escrito a mano y tres firmas (Messi, 2000). Papel con pliegue, renglones y garabatos de tinta. */
const Servilleta: React.FC = () => {
  const forma = 'M66 124 L318 98 L346 332 L92 364 Z';
  return (
    <g>
      <path d={forma} transform="translate(9 7)" fill={C.lima} />
      <path d={forma} fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
      {/* borde en relieve */}
      <path d="M84 142 L304 118 L328 316 L106 342 Z" fill="none" stroke={C.tinta} strokeWidth={2.4} strokeDasharray="3 7" opacity={0.45} />
      {/* esquina doblada */}
      <path d="M318 98 L292 150 L346 140 Z" fill={C.ficha} stroke={C.tinta} strokeWidth={3.5} strokeLinejoin="round" />
      {/* texto escrito de prisa */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${108 + i * 3} ${176 + i * 28} C${150 + i * 4} ${166 + i * 28} 190 ${186 + i * 28} ${236 - i * 12} ${172 + i * 28}`} fill="none" stroke={C.tinta} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      ))}
      {/* tres firmas */}
      <path d="M110 300 C122 276 136 322 150 292 C158 278 168 318 180 296" fill="none" stroke={C.tinta} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M196 308 C206 286 222 318 236 294 L254 312" fill="none" stroke={C.tinta} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M262 300 C272 280 290 316 304 290" fill="none" stroke={C.tinta} strokeWidth={4.5} strokeLinecap="round" />
    </g>
  );
};

/** Trofeo genérico (sin diseño oficial): copa de dos asas con reflejo lima. */
const Trofeo: React.FC = () => (
  <g>
    <path d="M130 110 H270 C270 200 240 250 200 262 C160 250 130 200 130 110 Z" transform="translate(9 7)" fill={C.lima} />
    <path d="M132 150 C70 150 70 232 142 242" fill="none" stroke={C.tinta} strokeWidth={12} strokeLinecap="round" />
    <path d="M268 150 C330 150 330 232 258 242" fill="none" stroke={C.tinta} strokeWidth={12} strokeLinecap="round" />
    <path d="M130 110 H270 C270 200 240 250 200 262 C160 250 130 200 130 110 Z" fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    <path d="M152 130 C150 188 170 226 196 242" fill="none" stroke={C.lima} strokeWidth={11} strokeLinecap="round" />
    <rect x={186} y={262} width={28} height={58} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
    <path d="M148 322 H252 L264 372 H136 Z" fill={C.tinta} />
    <rect x={128} y={372} width={144} height={22} fill={C.tinta} />
    <path d="M150 340 H250" stroke={C.papel} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
  </g>
);

/** Llave de habitación de hotel con su etiqueta (secuestro de Di Stéfano): llave inclinada y colgante de cartón. */
const LlaveHotel: React.FC = () => (
  <g transform="rotate(-24 200 240)">
    <circle cx={118} cy={228} r={52} transform="translate(9 7)" fill={C.lima} />
    <circle cx={118} cy={228} r={52} fill={C.papel} stroke={C.tinta} strokeWidth={6} />
    <circle cx={118} cy={228} r={18} fill={C.tinta} />
    <rect x={160} y={219} width={178} height={20} fill={C.papel} stroke={C.tinta} strokeWidth={5} />
    <path d="M296 239 V272 H312 V239 M322 239 V262 H338 V239" fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    {/* colgante */}
    <path d="M96 272 C84 300 84 318 96 336" fill="none" stroke={C.tinta} strokeWidth={3} />
    <g transform="translate(60 330) rotate(6)">
      <rect x={0} y={0} width={110} height={76} fill={C.kraft} stroke={C.tinta} strokeWidth={4} />
      <circle cx={16} cy={14} r={6} fill={C.papel} stroke={C.tinta} strokeWidth={2.5} />
      <text x={14} y={46} fontFamily={FONT.maquina} fontSize={15} fill={C.tinta}>HABITACIÓN</text>
      <text x={14} y={64} fontFamily={FONT.maquina} fontSize={13} fill={C.tinta}>1963</text>
    </g>
  </g>
);

/** Boleta de entrada (final trasladada): medallones laterales, perforación y talón con rayitas. */
const Boleta: React.FC = () => (
  <g transform="rotate(-7 200 240)">
    <path d="M60 140 H340 V196 a24 24 0 0 0 0 48 V312 H60 V244 a24 24 0 0 0 0 -48 Z" transform="translate(9 7)" fill={C.lima} />
    <path d="M60 140 H340 V196 a24 24 0 0 0 0 48 V312 H60 V244 a24 24 0 0 0 0 -48 Z" fill={C.papel} stroke={C.tinta} strokeWidth={5} strokeLinejoin="round" />
    <path d="M262 150 V302" stroke={C.tinta} strokeWidth={3} strokeDasharray="8 8" />
    <text x={86} y={236} fontFamily={FONT.grito} fontSize={92} fill={C.tinta}>FINAL</text>
    <text x={90} y={284} fontFamily={FONT.maquina} fontSize={24} fill={C.tinta}>MADRID · 2018</text>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={278 + i * 9} y={176 + (i % 2) * 6} width={i % 3 === 0 ? 6 : 3.5} height={92 - (i % 2) * 12} fill={C.tinta} />
    ))}
  </g>
);

const Generico: React.FC<{ tipo: ObjetoTipo }> = ({ tipo }) => (
  <g>
    <rect x={80} y={120} width={240} height={240} rx={8} transform="translate(9 7)" fill={C.lima} />
    <rect x={80} y={120} width={240} height={240} rx={8} fill={C.papel} stroke={C.tinta} strokeWidth={4.5} />
    <path d="M80 120 L320 360 M320 120 L80 360" stroke={C.tinta} strokeWidth={3} opacity={0.35} />
    <text x={200} y={252} textAnchor="middle" fontFamily={FONT.grito} fontSize={86} fill={C.tinta}>
      {tipo.toUpperCase()}
    </text>
  </g>
);

export const Objeto: React.FC<{
  tipo?: ObjetoTipo;
  etiqueta?: string;
  size?: number;
  x?: number;
  y?: number;
  rot?: number;
}> = ({ tipo = 'bulto', etiqueta, size = 520, x = 0, y = 0, rot = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 12) * 4 * Math.exp(-((frame % 400) / 90));
  return (
    <svg
      viewBox="0 0 400 440"
      width={size}
      height={size * 1.1}
      style={{ position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'url(#ink)' }}
    >
      {tipo === 'bulto' ? <Bulto /> : tipo === 'botin' ? <Botin /> : tipo === 'llavero' ? <Llavero /> : tipo === 'calendario' ? <Calendario /> : tipo === 'vitrina' ? <Vitrina /> : tipo === 'balon' ? <Balon /> : tipo === 'bandera' ? <Bandera /> : tipo === 'silbato' ? <Silbato /> : tipo === 'camiseta' ? <Camiseta /> : tipo === 'servilleta' ? <Servilleta /> : tipo === 'trofeo' ? <Trofeo /> : tipo === 'llavehotel' ? <LlaveHotel /> : tipo === 'boleta' ? <Boleta /> : <Generico tipo={tipo} />}
      {etiqueta && <Etiqueta texto={etiqueta} sway={sway} />}
    </svg>
  );
};
