import { Config } from '@remotion/cli/config';

// Remotion sirve como staticFile() todo lo que haya en esta carpeta.
Config.setPublicDir('assets');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer('angle');
// Chromium preinstalado en el entorno cloud; en tu máquina Remotion descarga el suyo.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
