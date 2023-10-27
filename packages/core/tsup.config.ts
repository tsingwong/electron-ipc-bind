import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: true,
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
  external: ['electron'],
  treeshake: true,
  clean: true,
  dts: true,
})
