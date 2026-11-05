import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 👈 ESTO ES LA CLAVE: Hace que todas las rutas del build sean relativas
});

// NOTA, este fichero, en cuanto a github pages, es obligatorio, eso es porque:
// Vite por defecto asume que tu web va en la raíz de un servidor.
// Como GitHub Pages usa un subdirectorio
// necesitas el archivo obligatoriamente
// para avisarle a Vite de ese cambio.


