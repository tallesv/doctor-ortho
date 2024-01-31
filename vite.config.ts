import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
      plugins: [react()],
    });
  }

  return defineConfig({
    plugins: [react()],
  });
};
