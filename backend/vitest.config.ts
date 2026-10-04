import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './vitest.globalSetup.ts',
    setupFiles: ['./tests/setupEnv.ts'],
    testTimeout: 20000,
    hookTimeout: 30000,
  },
})
