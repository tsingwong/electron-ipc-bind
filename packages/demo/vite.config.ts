import { existsSync, rmSync } from 'node:fs'
import * as path from 'node:path'
import react from '@vitejs/plugin-react-swc'
/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 09:52:52
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-26 11:18:28
 */
import { defineConfig } from 'vite'
import electron, { ElectronOptions } from 'vite-plugin-electron'

const resolve = (...paths: string[]) => path.resolve(__dirname, ...paths)
existsSync(resolve('dist-electron')) && rmSync(resolve('dist-electron'), { recursive: true })
export default defineConfig(({ command }) => {
  console.log('command', command)
  const isDevelopment = command === 'serve'
  const isTest = process.env.NODE_ENV === 'test'

  return {
    resolve: {},
    plugins: [
      react(),
      electron(
        [
          {
            entry: './main/index.ts',
            vite: {
              resolve: {},
              build: {
                rollupOptions: {
                  external: ['electron', 'electron-bvm'],
                  outDir: 'dist-electron',
                  minify: false,
                },
              },
            },
          },
          {
            entry: {
              preload: './preload/index.ts',
            },
            onstart: (options: any) => options.reload(),
            // vite: {
            //   resolve: {},
            // },
          },
        ].filter(Boolean) as ElectronOptions,
      ),
    ],
  }
})
