import path from 'path';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['config.ts', './tests/support/agent.ts'],
    isolate: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});

export default config;
