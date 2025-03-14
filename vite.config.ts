import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Use relative paths for local preview, change if deploying to a subdirectory
  base: './', 
  
  // Build output directory (defaults to 'dist', you can omit this if using 'dist')
  build: {
    outDir: 'dist',
  },
  
  // Server configuration for local development
  server: {
    host: true, // Allow external access to the dev server
  },
})

