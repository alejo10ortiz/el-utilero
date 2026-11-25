import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, FPS } from '../../../config/brand';
import { Sfx } from '../../components/Sfx';
import { E, hash, pop, tw } from '../../lib/ease';
import { useAbs } from '../../lib/ritmo';
import { cuando } from '../../lib/voz';
import type { EscenaProps } from '../Escenario';

/**
 * FOTOS — fotografías reales con licencia libre (dominio público o Creative Commons) pegadas como copias de archivo:
 * blanco y negro con grano, borde de papel, cinta en las esquinas, sombra dura, empuje lento (Ken Burns) y un pie de foto
 * en cinta. El CRÉDITO (autor · licencia · fuente) va siempre en vertical, pequeño, junto a la foto: es obligatorio en el esquema.
 * Se declaran en episode.json (`fotos`) con coordenadas del cuadro 1920×1080; entran cuando la voz dice su `palabra`
 * (o en f≈6 si no se nombra, para que nunca haya pantalla vacía tras un corte).
 */
export const FotosL: React.FC<Pick<EscenaProps, 'esc' | 'timing' | 'frames'>> = ({ esc, timing, frames }) => {
  const f = useCurrentFrame();
  const abs = useAbs();
  const off = Math.round(timing.start * FPS);
  const fotos = esc.fotos ?? [];

  const t = fotos.map((p, i) => (p.palabra ? Math.max(4, cuando(timing, off, p.palabra, 0, 8 + i * 16) - 2) : 6 + i * 14));

  return (
    <>
      {fotos.map((p, i) => {
        const ini = t[i];
        const dt = f - ini;
        if (dt < 0) return null;
        const ancho = p.ancho;
        const ratio = p.ratio ?? 4 / 3;
        const borde = 14;
        const altoImg = (ancho - borde * 2) / ratio;
        const alto = altoImg + borde * 2 + (p.pie ? 0 : 0);
        const anim = p.anim ?? 'pop';
        const desde = p.desde ?? 'arr';
        const dx = desde === 'izq' ? -1 : desde === 'der' ? 1 : 0;
        const dy = desde === 'arr' ? -1 : desde === 'abj' ? 1 : 0;
        let tx = 0, ty = 0, sc = 1, rt = p.rot ?? 0;
        if (anim === 'pop') {
          sc = pop(f, ini, 10);
          rt += (1 - Math.min(1, sc)) * (i % 2 ? 9 : -9);
        } else if (anim === 'cae') {
          ty = tw(dt, [0, 12], [-1100, 0], E.outBack2);
        } else {
          const k = tw(dt, [0, 12], [1, 0], E.outExpo);
          tx = dx * 1100 * k;
          ty = dy * 800 * k;
        }
        // vida continua: respira, tiembla a 12 fps y empuja despacio hacia el rostro/objeto
        const flota = Math.sin((abs + i * 13) / 30) * 4;
        const bo = (hash(Math.floor((abs * 12) / 30) + i * 5) - 0.5) * 0.7;
        const zoom = p.zoom ?? 1.08;
        const prog = Math.min(1, Math.max(0, dt / Math.max(30, frames - ini)));
        const kz = 1 + (zoom - 1) * prog;
        const kPie = tw(dt, [10, 18], [0, 1], E.outBack);
        const lado = p.lado ?? 'der';
        const filtro = p.color ? 'contrast(1.06) saturate(0.9) sepia(0.12)' : 'grayscale(1) contrast(1.14) brightness(1.03) sepia(0.2)';
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute', left: p.x - ancho / 2, top: p.y - alto / 2, width: ancho, height: alto,
                transform: `translate(${tx}px, ${ty + flota}px) rotate(${rt + bo}deg) scale(${Math.max(0, sc)})`, opacity: Math.min(1, dt / 3), pointerEvents: 'none',
              }}
            >
              {/* copia de archivo: borde de papel y sombra dura */}
              <div style={{ position: 'absolute', inset: 0, background: C.ficha, boxShadow: `10px 12px 0 rgba(22,19,15,0.26)` }} />
              <div style={{ position: 'absolute', left: borde, top: borde, width: ancho - borde * 2, height: altoImg, overflow: 'hidden', background: C.tinta }}>
                <Img
                  src={staticFile(p.foto)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.foco ?? '50% 50%', filter: filtro, transform: `scale(${kz})`, transformOrigin: p.foco ?? '50% 50%' }}
                />
                {/* tinte de papel para que la foto «viva» en el archivo */}
                <div style={{ position: 'absolute', inset: 0, background: C.cinta, mixBlendMode: 'multiply', opacity: p.color ? 0.12 : 0.22 }} />
              </div>
              {/* cintas */}
              {[-1, 1].map((s) => (
                <div
                  key={s}
                  style={{
                    position: 'absolute', top: -16, left: s < 0 ? -26 : ancho - 92, width: 118, height: 36, background: C.cinta, opacity: 0.94,
                    transform: `rotate(${s * -22}deg)`, boxShadow: '2px 3px 0 rgba(22,19,15,0.16)',
                    clipPath: 'polygon(0 12%,3% 0,50% 5%,97% 0,100% 14%,98% 88%,100% 100%,52% 94%,3% 100%,0 86%)',
                  }}
                />
              ))}
              {/* pie de foto */}
              {p.pie && (
                <div
                  style={{
                    position: 'absolute', left: borde + 10, top: alto - 6, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg) scale(${kPie})`, transformOrigin: '0 0', opacity: kPie, whiteSpace: 'nowrap',
                    fontFamily: FONT.maquina, fontSize: 30, color: C.tinta, background: C.cinta, padding: '4px 16px',
                    clipPath: 'polygon(0 10%,2% 0,50% 4%,98% 0,100% 12%,99% 90%,100% 100%,52% 95%,2% 100%,0 88%)',
                  }}
                >
                  {p.pie}
                </div>
              )}
              {/* crédito: pequeño, vertical, al costado */}
              <div
                style={{
                  position: 'absolute', top: 6, [lado === 'der' ? 'left' : 'right']: ancho + 10, writingMode: 'vertical-rl', whiteSpace: 'nowrap',
                  fontFamily: FONT.maquina, fontSize: 17, lineHeight: 1.1, color: C.tinta, opacity: 0.78 * Math.min(1, dt / 12), letterSpacing: 0.4,
                  transform: lado === 'izq' ? 'rotate(180deg)' : undefined,
                }}
              >
                FOTO: {p.credito}
              </div>
            </div>
            <Sfx name="tape" at={ini} volume={0.4} />
          </React.Fragment>
        );
      })}
    </>
  );
};
