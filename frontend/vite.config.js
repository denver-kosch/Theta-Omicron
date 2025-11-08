import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'localhost+3.pem')),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /\.jsx?$/, // treat all .js in src/ as JSX
  }
})
