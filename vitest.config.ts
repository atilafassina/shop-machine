/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    mockReset: true,
    exclude: ['machine/**/*.ts'],
  },
})
