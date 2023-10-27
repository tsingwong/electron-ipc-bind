/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-23 16:41:15
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-27 17:03:55
 */

import { WebContents, ipcMain, ipcRenderer } from 'electron'
import { isArray, isFunction, isString } from 'lodash-es'
import { v4 as uuidV4 } from 'uuid'
import { webContentPool } from '../base'
import { IStringOrStrings } from '../typings'
import { ANY_WINDOW_SYMBOL, ErrorCode, MAIN_EVENT_NAME, SELF_NAME } from '../utils'
import { IpcBaseEvent } from './base'

export const EVENT_CENTER = '__ELECTRON_EVENTS_CENTER__'

export enum EventType {
  NORMAL = 'NORMAL',
  RESPONSIVE = 'RESPONSIVE',
}

interface MainEventCenterParams {
  type?: EventType
  timeout?: number
  toName: IStringOrStrings
  eventName: IStringOrStrings
  payload: any[]
}

interface HandlerParams {
  code: number
  message: string
  payload?: any[]
}

interface ResponseArray {
  isSingleToName?: boolean
  isSingleEventName?: boolean
  resArr: (never[] | Promise<unknown>)[]
}

export class MainIpcEvent extends IpcBaseEvent {
  constructor() {
    super()

    // 多个渲染进程通信的中转
    ipcMain.handle(EVENT_CENTER, (event, params: MainEventCenterParams) => {
      const webContent = event.sender

      if (!webContent) {
        return
      }

      const webContentName = webContentPool.getName(webContent.id)
      if (!webContentName) {
        return
      }
      let { toName: toNames, type = EventType.NORMAL, eventName } = params
      if (toNames === ANY_WINDOW_SYMBOL) {
        toNames = webContentPool.getAllNames()
        toNames.unshift(MAIN_EVENT_NAME)
      }

      const isSingleToName = isString(toNames)
      const isSingleEventName = isString(eventName)

      if (!isArray(toNames)) {
        toNames = [toNames]
      }

      if (type === EventType.NORMAL) {
        return this._handleNormalEvent(webContentName, toNames, params)
      } else {
        return this._handleResponsiveEvent(webContentName, toNames, params, {
          isSingleToName,
          isSingleEventName,
        })
      }
    })
  }

  addWebContent(name: string, webContent: WebContents) {
    return webContentPool.add(name, webContent)
  }

  removeWebContent(idOrName: string | number) {
    return webContentPool.remove(idOrName)
  }

  /**
   * @description: 渲染进程 => 主进程（不需要返回结果）
   * @param {string} fromName
   * @param {string} toNames
   * @param {MainEventCenterParams} params
   * @return {*}
   */
  private _handleNormalEvent(fromName: string, toNames: string[], params: MainEventCenterParams) {
    let { eventName: eventNames, payload } = params

    for (const toName of toNames) {
      if (toName === MAIN_EVENT_NAME) {
        if (!isArray(eventNames)) {
          eventNames = [eventNames]
        }

        for (const eventName of eventNames) {
          const resEventName = this._getEventName(fromName, eventName)
          console.log(
            '🚀 ~ file: main.ts:109 ~ MainIpcEvent ~ _handleNormalEvent ~ resEventName:',
            resEventName,
          )
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, eventName)
          console.log(
            '🚀 ~ file: main.ts:111 ~ MainIpcEvent ~ _handleNormalEvent ~ anyEventName:',
            anyEventName,
          )

          this.eventMap.emit(resEventName, ...payload)
          this.eventMap.emit(anyEventName, ...payload)
        }
        return
      }

      const toWebContent = webContentPool.get(toName)

      if (!toWebContent) {
        return
      }

      toWebContent.send(EVENT_CENTER, {
        fromName: fromName === toName ? SELF_NAME : fromName,
        eventName: eventNames,
        payload,
      })
    }
  }

  /**
   * @description: 渲染进程 => 主进程
   * @param {string} fromName
   * @param {string} toNames
   * @param {MainEventCenterParams} params
   * @param {*} param4
   * @return {*}
   */
  private _handleResponsiveEvent(
    fromName: string,
    toNames: string[],
    params: MainEventCenterParams,
    { isSingleToName = false, isSingleEventName = false },
  ) {
    let { eventName: eventNames, payload } = params

    const resOutArr = toNames.map((toName) => {
      if (toName === 'main') {
        if (!isArray(eventNames)) {
          eventNames = [eventNames]
        }

        const resFromName = fromName === toName ? SELF_NAME : fromName
        const resInArr = eventNames.map((eventName) => {
          const resEventName = this._getEventName(resFromName, eventName)
          console.log(
            '🚀 ~ file: main.ts:164 ~ MainIpcEvent ~ resInArr ~ resEventName:',
            resEventName,
          )
          const anyEventName = this._getEventName('*', eventName)
          console.log(
            '🚀 ~ file: main.ts:165 ~ MainIpcEvent ~ resInArr ~ anyEventName:',
            anyEventName,
          )
          const handler =
            this.responsiveEventMap.get(resEventName) || this.responsiveEventMap.get(anyEventName)

          if (!isFunction(handler)) {
            return Promise.reject(
              new Error(
                `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`,
              ),
            )
          }
          return handler(...payload)
        })

        return Promise.all(resInArr)
      }
      return this._listenRenderer(fromName, toName, params)
    })
    return this._getResponse({
      isSingleToName,
      isSingleEventName,
      resArr: resOutArr,
    })
  }

  private _listenRenderer(fromName: string, toName: string, params: MainEventCenterParams) {
    const toWebContent = webContentPool.get(toName)
    const { eventName, payload, timeout = 3000 } = params
    if (!toWebContent) {
      return []
    }
    const handlerName = uuidV4()
    const eventPromise = new Promise((resolve, reject) => {
      const tid = setTimeout(() => {
        reject({
          code: ErrorCode.OVERTIME,
          message: new Error(`Listen to the response of window ${toName} timeout`),
        })
      }, timeout)
      ipcMain.handleOnce(handlerName, (_, params: HandlerParams) => {
        const { code, message, payload: data } = params
        clearTimeout(tid)

        if (code === ErrorCode.SUCCESS) {
          resolve(data)
        } else {
          reject(message)
        }
      })
    })

    toWebContent.send(EVENT_CENTER, {
      type: EventType.RESPONSIVE,
      handlerName,
      fromName: fromName === toName ? SELF_NAME : fromName,
      eventName,
      payload,
    })
    return eventPromise
  }

  private _getResponse({ isSingleToName, isSingleEventName, resArr }: ResponseArray) {
    const result = Promise.all<any[]>(resArr)

    if (isSingleToName && isSingleEventName) {
      return result.then(([innerRes]) => innerRes[0])
    } else if (isSingleToName) {
      return result.then(([innerRes]) => innerRes)
    } else if (isSingleEventName) {
      return result.then((res) => res.map((innerRes) => innerRes[0]))
    } else {
      return result
    }
  }

  /**
   * @description: 主进程 => 渲染进程（不需要返回结果）
   * @param {IStringOrStrings} webContentName
   * @param {IStringOrStrings} eventName
   * @param {array} args
   * @return {*}
   */
  emitTo(webContentName: IStringOrStrings, eventName: IStringOrStrings, ...args: any[]) {
    let _webContentNames = webContentName
    // ANY_WINDOW_SYMBOL 表示对所有 webContent 发送该事件
    if (ANY_WINDOW_SYMBOL === _webContentNames) {
      _webContentNames = webContentPool.getAllNames()
      // 触发主线程自己的监听事件
      this.emit(eventName, ...args)
    }
    if (!isArray(_webContentNames)) {
      _webContentNames = [_webContentNames]
    }

    for (const webContentName of _webContentNames) {
      const toWebContent = webContentPool.get(webContentName)
      if (!toWebContent) {
        return
      }

      toWebContent.send(EVENT_CENTER, {
        type: EventType.NORMAL,
        fromName: MAIN_EVENT_NAME,
        eventName,
        payload: args,
      })
    }
  }

  /**
   * @description: 主进程 => 渲染进程（需要返回结果）
   * @param {IStringOrStrings} webContentName
   * @param {IStringOrStrings} eventName
   * @param {array} args
   * @return {*}
   */
  invokeTo(webContentName: IStringOrStrings, eventName: IStringOrStrings, ...args: any[]) {
    let _webContentNames = webContentName
    if (ANY_WINDOW_SYMBOL === _webContentNames) {
      _webContentNames = webContentPool.getAllNames()
      _webContentNames.unshift(MAIN_EVENT_NAME)
    }

    const isSingleToName = isString(_webContentNames)
    const isSingleEventName = isString(eventName)

    if (!isArray(_webContentNames)) {
      _webContentNames = [_webContentNames]
    }

    return this._handleResponsiveEvent(
      MAIN_EVENT_NAME,
      _webContentNames,
      {
        type: EventType.RESPONSIVE,
        toName: _webContentNames,
        eventName,
        payload: args,
      },
      {
        isSingleToName,
        isSingleEventName,
      },
    )
  }
}
