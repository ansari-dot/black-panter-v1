import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {

    chunkSizeWarningLimit: 600,

    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    cssCodeSplit: true,
    // Enable code splitting and tree shaking (using default minifier)
    minify: 'esbuild',
    // Optimize for production
    target: 'es2015',
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Server configuration
  server: {
    hmr: {
      overlay: false,
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  },
})


