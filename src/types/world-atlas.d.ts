// world-atlas es un JSON enorme: se declara como `any` para que tsc no infiera su tipo.
declare module 'world-atlas/countries-50m.json' {
  const data: any;
  export default data;
}
declare module 'world-atlas/countries-110m.json' {
  const data: any;
  export default data;
}
