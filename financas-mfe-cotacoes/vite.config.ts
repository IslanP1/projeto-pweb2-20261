import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'financas_mfe_cotacoes',
      filename: 'remoteEntry.js',
      exposes: {
        './CotacoesWidget': './src/CotacoesWidget.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
      },
      dts: false,
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    modulePreload: false,
  },
  server: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
    cors: true,
  },
})
