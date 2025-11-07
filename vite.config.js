import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 根據環境決定 base 路徑
// Vercel 部署使用 '/'，Electron 使用 './'
const base = process.env.VERCEL ? '/' : './';

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // 確保資源路徑正確
    assetsDir: 'assets',
    // 生成 source map 方便除錯（可選）
    sourcemap: false,
  },
});


