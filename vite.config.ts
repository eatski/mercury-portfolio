import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),vanillaExtractPlugin()],
  base: process.env.NODE_ENV === "production" ? "/mercury-portfolio/" : undefined,
  optimizeDeps: {
    esbuildOptions : {
        target: "es2020"
    }
  }
})
