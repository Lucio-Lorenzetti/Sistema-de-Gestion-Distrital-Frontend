import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- AGREGÁ ESTA LÍNEA

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- AGREGÁ ESTA LÍNEA
  ],
})