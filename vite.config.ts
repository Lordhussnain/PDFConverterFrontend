import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
/* import fs from 'fs'; */


/* const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'server.key')),  // Adjust path to your backend cert location
  cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
}; */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})