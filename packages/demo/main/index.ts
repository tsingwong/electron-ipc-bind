import { join } from 'path'
/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 13:53:01
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-27 11:41:42
 */
import { BrowserView, BrowserWindow, Menu, app } from 'electron'
import queryString from 'query-string'
import { useWebContentPool } from '../../core/src'
import { BVM_EVENT_NAME, WINDOW_NAME } from '../utils'
import { events, preloadPath } from './event'

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
  win = new BrowserWindow({
    title: WINDOW_NAME.APP,
    webPreferences: {
      preload: preloadPath,
    },
  })

  events.addWebContent(WINDOW_NAME.APP, win.webContents)

  if (url) {
    win.loadURL(
      queryString.stringifyUrl({
        url: url,
        query: {
          name: WINDOW_NAME.APP,
        },
      }),
    )
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHTML)
  }

  const template = [
    {
      label: 'app', // macOS下第一个标签是应用程序名字，此处设置无效
      submenu: [
        {
          label: '退出',
          click: () => {
            app.quit()
          },
        },
        {
          label: '关于',
          click: () => {
            app.showAboutPanel()
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: '操作',
      submenu: [
        {
          label: '主线程 => 所有渲染进程发送同步消息',
          click: () => {
            events.emitTo('*', BVM_EVENT_NAME.SEND_MESSAGE_TO, '主线程 => 所有渲染进程发送同步消息')
          },
        },
        {
          label: '主线程 => 所有渲染进程发送异步消息',
          click: () => {
            events
              .invokeTo('*', BVM_EVENT_NAME.SEND_MESSAGE_TO, '主线程 => 所有渲染进程发送异步消息')
              .then((res) => console.log('主进程接受到所有渲染进程的异步返回结果', res))
          },
        },
      ],
    },
  ]

  // win.excludedFromShownWindowsMenu = true

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
