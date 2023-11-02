/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-23 16:41:11
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-11-02 16:51:31
 */

import EventEmitter from 'events'
import { isArray, isEmpty, isFunction, isUndefined, noop } from 'lodash-es'
import { AnyFunction, IStringOrStrings } from '../typings'
import { ErrorCode, SELF_NAME } from '../utils'

interface INormalizeArgs {
  webContentNames: string[]
  eventNames: string[]
  callback: AnyFunction
}

export class IpcBaseEvent {
  protected eventMap = new EventEmitter()

  protected responsiveEventStore: {
    [key: string]: AnyFunction
  } = Object.create(null)

  protected responsiveEventMap = {
    set: (name: string, listener: AnyFunction) => {
      this.responsiveEventStore[name] = listener
    },
    get: (name: string): AnyFunction | undefined => {
      return this.responsiveEventStore[name]
    },
    delete: (name: string) => {
      delete this.responsiveEventStore[name]
    },
    getAll: () => {
      return Object.keys(this.responsiveEventStore)
    },
  }

  on(eventName: IStringOrStrings, listener: AnyFunction): this
  on(webContentName: IStringOrStrings, eventName: IStringOrStrings, listener: AnyFunction): this
  on(
    webContentName: IStringOrStrings,
    eventName: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): this {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener,
    )
    this._on(webContentNames, eventNames, callback, false)
    return this
  }

  once(eventName: IStringOrStrings, listener: AnyFunction): this
  once(windowName: IStringOrStrings, eventName: IStringOrStrings, listener: AnyFunction): this
  once(
    windowName: IStringOrStrings,
    eventName: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): this {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      windowName,
      eventName,
      listener,
    )
    this._on(webContentNames, eventNames, callback, true)
    return this
  }

  protected _normalizeArgs(
    webContentName: IStringOrStrings,
    eventName?: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): INormalizeArgs {
    let _webContentName = webContentName
    let _eventName = eventName
    let _listener = listener

    if (isFunction(_eventName)) {
      _listener = _eventName
      _eventName = _webContentName
      _webContentName = ''
    }
    if (isUndefined(_eventName)) {
      _eventName = _webContentName
      _webContentName = ''
    }
    if (!isArray(_webContentName)) {
      _webContentName = [_webContentName]
    }

    if (!isArray(_eventName)) {
      _eventName = [_eventName]
    }

    if (isEmpty(_webContentName)) {
      _webContentName = ['']
    }
    return {
      webContentNames: _webContentName,
      eventNames: _eventName,
      callback: _listener || noop,
    }
  }

  protected _on(
    windowNames: string[],
    eventNames: string[],
    listener: AnyFunction,
    once = false,
  ): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName)

      if (once) {
        this.eventMap.once(resEventName, listener)
      } else {
        this.eventMap.on(resEventName, listener)
      }
    })

    return this
  }

  protected _each(
    windowNames: string[],
    eventNames: string[],
    callback: (windowName: string, eventName: string) => void,
  ) {
    for (const windowName of windowNames) {
      for (const eventName of eventNames) {
        callback(windowName, eventName)
      }
    }
  }

  /**
   * @description: webContentName 和 eventName 拼接成最终的事件名
   * @description: - `${webContentName}-${eventName}
   * @description: - `${eventName}`
   * @param {string} webContentName
   * @param {string} eventName
   * @return {*}
   */
  protected _getEventName(webContentName: string, eventName: string): string {
    const hasWebContentName = webContentName && webContentName !== SELF_NAME

    return `${hasWebContentName ? `${webContentName}-` : ''}${eventName}`
  }

  emit(eventName: IStringOrStrings, ...args: any[]) {
    let _eventNames = eventName
    if (!isArray(_eventNames)) {
      _eventNames = [_eventNames]
    }
    for (const eventName of _eventNames) {
      this.eventMap.emit(eventName, ...args)
    }
  }

  off(eventName: IStringOrStrings): this
  off(webContentName: IStringOrStrings, eventName: IStringOrStrings): this
  off(eventName: IStringOrStrings, listener: AnyFunction): this
  off(webContentName: IStringOrStrings, eventName: IStringOrStrings, listener: AnyFunction): this
  off(
    webContentName: IStringOrStrings,
    eventName?: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): this {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener,
    )
    this._off(webContentNames, eventNames, callback)
    return this
  }

  protected _off(windowNames: string[], eventNames: string[], listener: AnyFunction): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName)

      this.eventMap.off(resEventName, listener)
    })
    return this
  }

  handle(eventName: IStringOrStrings, listener: AnyFunction): this
  handle(webContentName: IStringOrStrings, eventName: IStringOrStrings, listener: AnyFunction): this
  handle(
    webContentName: IStringOrStrings,
    eventName: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): this {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener,
    )
    this._handle(webContentNames, eventNames, callback)

    return this
  }

  handleOnce(eventName: IStringOrStrings, listener: AnyFunction): this
  handleOnce(
    webContentName: IStringOrStrings,
    eventName: IStringOrStrings,
    listener: AnyFunction,
  ): this
  handleOnce(
    webContentName: IStringOrStrings,
    eventName: IStringOrStrings | AnyFunction,
    listener?: AnyFunction,
  ): this {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener,
    )
    this._handle(webContentNames, eventNames, callback, true)

    return this
  }

  protected _handle(
    webContentNames: string[],
    eventNames: string[],
    listener: AnyFunction,
    once = false,
  ): this {
    this._each(webContentNames, eventNames, (webContentName, eventName) => {
      const resEventName = this._getEventName(webContentName, eventName)
      const anyEventName = this._getEventName('*', eventName)
      const handler = this.responsiveEventMap.get(resEventName)
      const anyHandler = this.responsiveEventMap.get(anyEventName)

      if (handler && anyHandler) {
        throw new Error(
          `Error occurred in handler for '${eventName}': Attempted to register a second handler for '${eventName}'`,
        )
      }

      if (once) {
        this.responsiveEventMap.set(resEventName, (...args: any[]) => {
          listener(...args)
          this.removeHandler(webContentName, eventName)
        })
      } else {
        this.responsiveEventMap.set(resEventName, listener)
      }
    })
    return this
  }

  removeHandler(eventName: IStringOrStrings): this
  removeHandler(webContentName: IStringOrStrings, eventName: IStringOrStrings): this
  removeHandler(webContentName: IStringOrStrings, eventName?: IStringOrStrings): this {
    const { webContentNames, eventNames } = this._normalizeArgs(webContentName, eventName)

    this._removeHandler(webContentNames, eventNames)
    return this
  }

  protected _removeHandler(windowNames: string[], eventNames: string[]): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName)
      this.responsiveEventMap.delete(resEventName)
    })
    return this
  }

  async invoke(eventName: IStringOrStrings, ...args: any[]) {
    let _eventNames = eventName
    const isMultipleEvents = isArray(eventName)
    if (!isArray(_eventNames)) {
      _eventNames = [_eventNames]
    }
    const resArr = _eventNames.map(async (eventName) => {
      const handler = this.responsiveEventMap.get(eventName)

      if (!isFunction(handler)) {
        return Promise.reject({
          code: ErrorCode.NOT_FOUND,
          message: new Error(
            `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`,
          ),
        })
      }

      try {
        return await handler(...args)
      } catch (error) {
        return {
          code: ErrorCode.EXECUTION_EXCEPTION,
          message: new Error(`Error occurred in handler for '${eventName}': Execution exception'`),
          payload: error,
        }
      }
    })
    return isMultipleEvents ? Promise.all(resArr) : resArr[0]
  }
}
