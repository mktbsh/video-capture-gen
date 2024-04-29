import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const slug = process.env.REPO_SLUG;
  if (command === "build" && !slug) {
    throw new Error('REPO_SLUG is not set');
  }

  return {
    base: slug ? `/${slug}/` : undefined,
    plugins: [react()],
  }
})
