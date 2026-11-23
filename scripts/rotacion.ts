/**
 * Memoria de guion (BRAND.md §7b): muestra qué ganchos, aperturas, formatos, cierres y músicas usaron los últimos
 * episodios y sugiere qué usar en el siguiente para que no se vuelvan plantilla.
 *   npm run rotacion            # últimos 8 episodios + sugerencia
 *   npm run rotacion -- 12      # últimos 12
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, positional } from './lib';

const GANCHOS = ['afirmacion', 'paradoja', 'cifra', 'pregunta', 'mito', 'escena', 'direccion', 'promesa', 'objeto'];
const APERTURAS = ['firma', 'corta', 'intima', 'directa', 'invita'];
const FORMATOS = ['objeto', 'cifra', 'viaje', 'duelo', 'documento', 'misterio', 'mito', 'cuenta_atras'];
const CIERRES = ['pais', 'pregunta', 'ab', 'siguiente', 'dato', 'reto', 'firma', 'seco', 'sobrio'];
const MUSICAS = ['b', 'c', 'd', 'e'];
const TEMAS_VISUALES = ['cuaderno', 'kraft', 'plano', 'periodico', 'clasico'];

type Fila = { id: string; gancho?: string; apertura?: string; formato?: string; cierre?: string; musica?: string; tema: string; escenas: string; cierreVoz: string };

export function cargarEpisodios(): Fila[] {
  const dir = path.join(ROOT, 'episodes');
  return fs
    .readdirSync(dir)
    .map((d) => path.join(dir, d, 'episode.json'))
    .filter((f) => fs.existsSync(f))
    .map((f) => JSON.parse(fs.readFileSync(f, 'utf8')))
    .filter((e) => e.formato !== 'presentacion' && /^\d{3}$/.test(e.id))
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => ({
      id: e.id, gancho: e.guion?.gancho, apertura: e.guion?.apertura, formato: e.guion?.formato, cierre: e.guion?.cierre,
      musica: (e.musica ?? '').match(/-([a-e])\.mp3$/)?.[1], tema: (e.tema ?? 'clasico') as string, escenas: e.escenas.map((s: any) => s.tipo.slice(0, 4)).join('>'),
      cierreVoz: (e.escenas.find((s: any) => s.tipo === 'cierre')?.voz ?? '') as string,
    }));
}

/** Opciones ordenadas: primero las que NO están en los últimos `ventana` y, entre ellas, las menos usadas en total. */
const sugerir = (opciones: string[], usados: (string | undefined)[], ventana: number) => {
  const recientes = new Set(usados.slice(-ventana));
  const total = (o: string) => usados.filter((u) => u === o).length;
  return opciones.filter((o) => !recientes.has(o)).sort((a, b) => total(a) - total(b));
};

function main() {
  const n = Number(positional()[0] ?? 8);
  const eps = cargarEpisodios();
  const ult = eps.slice(-n);
  console.log('id   gancho       apertura  formato     cierre      música  tema       escenas');
  for (const e of ult) console.log(`${e.id}  ${(e.gancho ?? '—').padEnd(12)} ${(e.apertura ?? '—').padEnd(9)} ${(e.formato ?? '—').padEnd(11)} ${(e.cierre ?? '—').padEnd(11)} ${(e.musica ?? '—').padEnd(7)} ${e.tema.padEnd(10)} ${e.escenas}`);
  const sig = String(Number(eps[eps.length - 1].id) + 1).padStart(3, '0');
  const lista = (a: string[]) => (a.length ? a.slice(0, 3).join(' · ') : '(todas se usaron hace poco)');
  console.log(`\nSugerencia para el #${sig}:`);
  console.log('  gancho  :', lista(sugerir(GANCHOS, eps.map((e) => e.gancho), 3)));
  console.log('  apertura:', lista(sugerir(APERTURAS, eps.map((e) => e.apertura), 2)));
  console.log('  formato :', lista(sugerir(FORMATOS, eps.map((e) => e.formato), 2)));
  console.log('  cierre  :', lista(sugerir(CIERRES, eps.map((e) => e.cierre), 2)));
  console.log('  música  :', lista(sugerir(MUSICAS, eps.map((e) => e.musica), 2)));
  console.log('  tema    :', lista(sugerir(TEMAS_VISUALES, eps.map((e) => e.tema), 2)));
  const firmas = eps.slice(-4).filter((e) => e.apertura === 'firma').length;
  if (firmas >= 3) console.log(`\n  ⚠ la frase firma de apertura salió en ${firmas} de los últimos 4: usa otra apertura.`);
}
if (require.main === module) main();
