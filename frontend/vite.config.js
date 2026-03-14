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
  },
  esbuild: {
    loader: 'jsx',
    include: /\.jsx?$/, // treat all .js in src/ as JSX
  },
  optimizeDeps: {
  include: [
    "@fullcalendar/core",
    "@fullcalendar/daygrid",
    "@fullcalendar/list"
  ]
}
})
