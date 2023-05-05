import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // 配置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
