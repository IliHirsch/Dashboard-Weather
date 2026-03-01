import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    define: {
      'import.meta.env.VITE_WEATHER_API_KEY': JSON.stringify(env.VITE_WEATHER_API_KEY),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Weather Dashboard',
          short_name: 'Weather',
          description: 'Automotive style weather dashboard',
          theme_color: '#080810',
          background_color: '#080810',
          display: 'standalone',
          icons: [{ src: 'vite.svg', sizes: '192x192', type: 'image/svg+xml' }]
        }
      })
    ],
  }
})