import { build } from 'vite'
import path from 'path'

build({
  root: path.join(import.meta.dirname, 'app'),

  build: {
    outDir: path.join(import.meta.dirname, 'dist'),
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: path.join(import.meta.dirname, 'app', 'index.html'),
      }
    }
  }
})
