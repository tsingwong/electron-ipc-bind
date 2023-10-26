/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 17:27:43
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-25 17:31:45
 */

import { type RendererIpcEvent } from '@electron-bvm/core'
import { WindowInfo } from './main/event'

export interface IElectronAPI {
  createWindowOrView: (windowInfo: WindowInfo) => void
  events: RendererIpcEvent
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
