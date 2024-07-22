import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  if (mode === 'development') {
    return defineConfig({
      server: {
        proxy: {
          '/api': {
            target: process.env.VITE_BACKEND_URL,
            changeOrigin: true,
            secure: false,
            rewrite: path => path.replace('/api', ''),
          },
        },
      },
      plugins: [react(), tsconfigPaths()],
    });
  }

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
  });
};
