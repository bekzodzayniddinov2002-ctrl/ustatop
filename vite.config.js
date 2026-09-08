import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Docker konteyneri ichida bind mount fayl o'zgarishlarini inotify orqali
// yetkazmaydi (macOS va Windows'da), shuning uchun VITE_POLLING=true bo'lsa
// Vite fayllarni so'rov (polling) rejimida kuzatadi. Linux'da kerak emas.
const usePolling = process.env.VITE_POLLING === 'true'

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.DEV_PORT) || 5173,
    // 0.0.0.0 — konteyner tashqarisidan ochilishi uchun
    host: true,
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
    // Konteyner porti host portiga 1:1 map qilingan; boshqa port ishlatilsa
    // HMR ulanishi uchun uni shu yerda ko'rsating.
    hmr: process.env.HMR_PORT ? { clientPort: Number(process.env.HMR_PORT) } : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        // Recharts/d3 katta — alohida chunk sifatida keshlansin
        manualChunks: {
          charts: ['recharts'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
