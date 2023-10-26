import { join } from 'path'
/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 13:53:01
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-25 20:14:05
 */
import { BrowserView, BrowserWindow, app } from 'electron'
import { useWebContentPool } from '../../core/src'
import { WINDOW_NAME } from '../utils'
import { preloadPath } from './event'

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
const url = process.env.VITE_DEV_SERVER_URL
const indexHTML = join('../dist/index.html')

let win: BrowserWindow | null = null

async function createWindow() {
  const webContentPool = useWebContentPool()

  win = new BrowserWindow({
    title: WINDOW_NAME.APP,
    webPreferences: {
      preload: preloadPath,
    },
  })

  webContentPool.add(WINDOW_NAME.APP, win.webContents)

  if (url) {
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHTML)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null

  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()

    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()

  allWindows.length ? allWindows[0].focus() : createWindow()
})
