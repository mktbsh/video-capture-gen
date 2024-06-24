import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "node:path"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const slug = process.env.REPO_SLUG;
  if (command === "build" && !slug) {
    throw new Error('REPO_SLUG is not set');
  }

  return {
    base: slug ? `/${slug}/` : undefined,
    plugins: [react(), TanStackRouterVite()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
