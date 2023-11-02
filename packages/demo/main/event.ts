/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 11:13:19
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-27 14:34:27
 */

import { join } from 'path'
import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { useEvents, useWebContentPool } from 'electron-ipc-bind'
import { BVM_EVENT_NAME, CUSTOM_CHANNEL, CUSTOM_CHANNEL_TYPE, WINDOW_NAME } from '../utils'

export type WindowName = `${WINDOW_NAME}`

export interface WindowInfo {
  name: string
  rendererSendId?: 'renderer-send-to-app' | 'renderer-send-to-bramble' | 'renderer-send-to-briar'
  rendererInvokeId?:
    | 'renderer-invoke-to-app'
    | 'renderer-invoke-to-bramble'
    | 'renderer-invoke-to-briar'
  url: string
  status?: 'normal' | 'lock'
  type: CUSTOM_CHANNEL_TYPE
}

type ICustomChannelType = {
  type: CUSTOM_CHANNEL_TYPE
  windowInfo: WindowInfo
}

export const events = useEvents('browser')

const webContentPool = useWebContentPool()

export const preloadPath = join(__dirname, './preload.js')

ipcMain.handle(CUSTOM_CHANNEL, (_, payload: WindowInfo) => {
  const { type, name, url } = payload

  let winOrView: BrowserWindow | BrowserView | null = null
  switch (type) {
    case CUSTOM_CHANNEL_TYPE.CREATE_WINDOW:
      winOrView = new BrowserWindow({
        title: name,
        webPreferences: {
          preload: preloadPath,
        },
      })
      winOrView.loadURL(url)
      winOrView.webContents.openDevTools()
      events.addWebContent(name, winOrView.webContents)
      break
    case CUSTOM_CHANNEL_TYPE.CREATE_VIEW:
      winOrView = new BrowserView({
        webPreferences: {
          preload: preloadPath,
        },
      })
      winOrView.webContents.loadURL(url)
      winOrView.webContents.openDevTools({ mode: 'detach' })
      events.addWebContent(name, winOrView.webContents)
      break
    default:
      break
  }

  return winOrView?.webContents.id
})

// 主线程的监听

events.handle('*', BVM_EVENT_NAME.GET_ALL_POOL, (...args: any[]) => {
  return webContentPool.getAllNames()
})

events.on('*', BVM_EVENT_NAME.SEND_MESSAGE_TO, (...args: any[]) => {
  console.log('主线程接收到同步方法，参数', args)
})

events.handle('*', BVM_EVENT_NAME.SEND_MESSAGE_TO, (...args: any[]) => {
  console.log('主线程接收到异步方法，参数', args)
  return '异步方法主线程返回数据'
})
