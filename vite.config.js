import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/mcp': {
        target: 'https://stitch.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mcp/, '/mcp'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Adiciona a chave da API ao header da requisição proxy
            proxyReq.setHeader('X-Goog-Api-Key', process.env.VITE_STITCH_API_KEY || '');
          });
        },
      },
    },
  },
})
