import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react'],
        },
      },
    },
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
  // Server configuration for better caching
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
