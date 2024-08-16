import { createServer } from 'vite'
import path from 'path'

// Start The Server
async function start (): Promise<void> {
  const server = await createServer({
    root: path.join(import.meta.dirname, 'app'),

    server: {
      port: 8080,

      watch: {
        usePolling: true
      }
    }
  })

  await server.listen()

  server.printUrls()
}

start()
