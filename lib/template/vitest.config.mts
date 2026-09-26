import path from 'path';
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config', './tests/support/agent.ts'],
    isolate: true,
    // All test files share one JSON database file, so run them one at a time
    fileParallelism: false,
    env: {
      DOTENV_CONFIG_PATH: 'config/.env.test',
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});

export default config;
