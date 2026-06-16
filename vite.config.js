import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const planetsDir = path.resolve(root, 'Planets')

function planetsStatic() {
  return {
    name: 'planets-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/Planets/')) return next()
        const rel = decodeURIComponent(req.url.slice('/Planets/'.length).split('?')[0])
        const file = path.resolve(planetsDir, rel)
        if (!file.startsWith(planetsDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
          return next()
        }
        const ext = path.extname(file).toLowerCase()
        const types = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
        }
        res.setHeader('Content-Type', types[ext] ?? 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
      })
    },
    closeBundle() {
      if (!fs.existsSync(planetsDir)) return
      const dest = path.resolve(root, 'dist/Planets')
      fs.cpSync(planetsDir, dest, { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [react(), planetsStatic()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
