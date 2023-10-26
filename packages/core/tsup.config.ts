import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: true,
  format: ['esm', 'cjs'],
  entry: ['src/*.ts', '!src/*.test.ts'],
  clean: true,
  dts: true,
})
