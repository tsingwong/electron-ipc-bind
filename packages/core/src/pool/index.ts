/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-24 10:02:22
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-24 18:53:41
 */

import { type BrowserView, type BrowserWindow, type WebContents } from 'electron'
import { isString } from 'lodash-es'

export class WebContentPool {
  protected pool = new Map<string, WebContents>()
  //
  protected webContentIdMap = new Map<number, string>()

  add(name: string, webContent: WebContents) {
    if (this.pool.has(name)) {
      this.remove(name)
    }
    this.pool.set(name, webContent)
    this.webContentIdMap.set(webContent.id, name)
    webContent.on('destroyed', () => this.remove(name))
  }

  get(idOrName: string | number) {
    let _idOrName = idOrName
    if (!isString(_idOrName)) {
      _idOrName = this.webContentIdMap.get(_idOrName) || ''
    }

    return this.pool.get(_idOrName)
  }

  getAll() {
    return [...this.pool.values()]
  }

  remove(idOrName: string | number) {
    let _idOrName = idOrName
    if (!isString(_idOrName)) {
      const id = _idOrName

      _idOrName = this.webContentIdMap.get(_idOrName) || ''
      this.webContentIdMap.delete(id)
    } else {
      const webContent = this.pool.get(_idOrName)
      if (webContent) {
        this.webContentIdMap.delete(webContent.id)
      }
    }

    return this.pool.delete(_idOrName)
  }

  clear() {
    this.pool.clear()
    this.webContentIdMap.clear()
  }

  getName(id: number) {
    return this.webContentIdMap.get(id)
  }

  getAllNames() {
    return [...this.webContentIdMap.values()]
  }
}
