import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(rootDirectory, './src'),
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
        include: ["@fullcalendar/core", "@fullcalendar/daygrid", "@fullcalendar/list"]
    }
})
