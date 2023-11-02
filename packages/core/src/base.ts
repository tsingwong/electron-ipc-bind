/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-24 11:47:33
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-11-02 16:36:26
 */

import { WebContentPool } from './pool'

export const webContentPool = new WebContentPool()

export const useWebContentPool = () => webContentPool
