/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 11:13:19
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-25 18:37:12
 */

import { join } from 'path'
import { useEvents } from '@electron-bvm/core'
import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { CUSTOM_CHANNEL, CUSTOM_CHANNEL_TYPE, WINDOW_NAME } from '../utils'

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

const events = useEvents('browser')

export const preloadPath = join(__dirname, './preload.js')

ipcMain.handle(CUSTOM_CHANNEL, (_, payload: ICustomChannelType) => {
  const {
    type,
    windowInfo: { name, url },
  } = payload
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
      winOrView.webContents.openDevTools()
      events.addWebContent(name, winOrView.webContents)
      break
    default:
      break
  }
})
