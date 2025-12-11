import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/paws-and-preferences/", // 👈 ADD THIS LINE (Must match your repo name)
})