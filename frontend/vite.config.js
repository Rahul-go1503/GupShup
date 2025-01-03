import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import path from "path"

// https://vite.dev/config/

// Todo: Check proxy here and setup env variables
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        secure: false,
      },
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
