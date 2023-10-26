/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-23 16:41:15
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-24 20:29:20
 */

import { ipcRenderer } from 'electron'
import { isArray, isFunction } from 'lodash-es'
import { ANY_WINDOW_SYMBOL, EVENT_CENTER, ErrorCode, EventType } from '../utils'
import { IpcBaseEvent } from './base'

interface RendererEventCenterParams {
  type?: EventType
  handlerName?: string
  fromName: string
  eventName: string | string[]
  payload: any[]
}

export class RendererIpcEvent extends IpcBaseEvent {
  constructor() {
    super()

    ipcRenderer.on(EVENT_CENTER, (_, params: RendererEventCenterParams) => {
      let {
        type = EventType.NORMAL,
        handlerName,
        fromName,
        eventName: eventNames,
        payload,
      } = params

      if (!isArray(eventNames)) {
        eventNames = [eventNames]
      }

      // 普通类型 基于 eventMap
      if (type === EventType.NORMAL) {
        for (const eventName of eventNames) {
          const resEventName = this._getEventName(fromName, eventName)
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, eventName)

          this.eventMap.emit(resEventName, ...payload)
          this.eventMap.emit(anyEventName, ...payload)
        }
        return
      }
      if (!handlerName) {
        return
      }
      // 响应式类型，基于 responsiveEventMap
      const resArr = eventNames.map(async (eventName) => {
        const resEventName = this._getEventName(fromName, eventName)
        const anyEventName = this._getEventName('*', eventName)

        const handler =
          this.responsiveEventMap.get(resEventName) || this.responsiveEventMap.get(anyEventName)

        if (!isFunction(handler)) {
          return Promise.reject({
            code: ErrorCode.NOT_FOUND,
            message: `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`,
          })
        }
        try {
          return await handler(...payload)
        } catch (error) {
          return {
            code: ErrorCode.EXECUTION_EXCEPTION,
            message: new Error(
              `Error occurred in handler for '${eventName}': Execution exception'`,
            ),
          }
        }
      })

      Promise.all(resArr)
        .then((res) => {
          ipcRenderer.invoke(handlerName as string, {
            code: ErrorCode.SUCCESS,
            message: '',
            payload: res,
          })
        })
        .catch((error) => {
          ipcRenderer.invoke(handlerName as string, error)
        })
    })
  }

  /**
   * @description: 渲染进程1 => 渲染进程2（不需要返回结果）
   * @param {string} webContentName
   * @param {string} eventName
   * @param {array} args
   * @return {*}
   */
  emitTo(webContentName: string | string[], eventName: string | string[], ...args: any[]) {
    ipcRenderer.invoke(EVENT_CENTER, {
      type: EventType.NORMAL,
      toName: webContentName,
      eventName,
      payload: args,
    })
  }

  /**
   * @description: 渲染进程 => 主线程（需要返回结果）
   * @param {string} webContentName
   * @param {string} eventName
   * @param {array} args
   * @return {*}
   */
  invokeTo(webContentName: string | string[], eventName: string | string[], ...args: any[]) {
    return ipcRenderer.invoke(EVENT_CENTER, {
      type: EventType.RESPONSIVE,
      toName: webContentName,
      eventName,
      payload: args,
    })
  }
}
