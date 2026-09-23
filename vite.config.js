import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' makes the build work on both Vercel (root) and GitHub Pages (sub-path).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
