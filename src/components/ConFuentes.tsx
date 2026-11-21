import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import { fontsReady } from '../fonts';

/** No monta nada hasta que las fuentes estén cargadas (necesario para medir texto con fitText). */
export const ConFuentes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Cargando fuentes de marca'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    fontsReady
      .then(() => document.fonts.ready)
      .then(() => {
        setOk(true);
        continueRender(handle);
      })
      .catch((e) => {
        console.error('No se pudieron cargar las fuentes', e);
        setOk(true);
        continueRender(handle);
      });
  }, [handle]);
  return ok ? <>{children}</> : null;
};
