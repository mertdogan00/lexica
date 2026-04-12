import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // Raise warning threshold since this app ships large icon bundles.
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: '0.0.0.0',
  },
})
