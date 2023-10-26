/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-24 20:27:26
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-24 20:31:54
 */
import { bind } from 'lodash-es'
import { MainIpcEvent, RendererIpcEvent } from './ipc'

let mainEvents: MainIpcEvent | null = null
let rendererEvents: RendererIpcEvent | null = null
type EventMethod = keyof RendererIpcEvent

export type { MainIpcEvent, RendererIpcEvent }

export { useWebContentPool } from './base'

export function useEvents(type: 'browser'): MainIpcEvent
export function useEvents(type?: Exclude<typeof process.type, 'browser'>): RendererIpcEvent
export function useEvents(type = process.type) {
  if ('browser' === type) {
    if (!mainEvents) {
      mainEvents = new MainIpcEvent()
    }

    return mainEvents
  }

  if (!rendererEvents) {
    const methodList: EventMethod[] = [
      'on',
      'once',
      'emit',
      'emitTo',
      'off',
      'handle',
      'handleOnce',
      'invoke',
      'invokeTo',
      'removeHandler',
    ]

    rendererEvents = new RendererIpcEvent()
    for (const methodName of methodList) {
      rendererEvents[methodName] = bind(rendererEvents[methodName], rendererEvents)
    }
  }

  return rendererEvents
}
