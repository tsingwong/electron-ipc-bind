/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 11:09:01
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-26 13:51:25
 */
import { contextBridge, ipcRenderer } from 'electron'

import { useEvents } from '../../core/src'
import { WindowInfo } from '../main/event'
import { CUSTOM_CHANNEL, CUSTOM_CHANNEL_TYPE } from '../utils'

const events = useEvents()

contextBridge.exposeInMainWorld('electronAPI', {
  events,
  createWindowOrView(windowInfo: WindowInfo) {
    return ipcRenderer.invoke(CUSTOM_CHANNEL, windowInfo)
  },
})
