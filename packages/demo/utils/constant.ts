/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2023-10-25 11:19:29
 * @LastEditors: Tsingwong
 * @LastEditTime: 2023-10-25 17:39:54
 */
export const CUSTOM_CHANNEL = 'CUSTOM_CHANNEL'

export enum WINDOW_NAME {
  APP = 'App',
  BRAMBLE = 'Bramble',
  BRIAR = 'Briar',
}

export enum CHANNEL {
  RENDERER_SEND_TO_SELF = '0',
  RENDERER_SEND_TO_MAIN = '1',
  RENDERER_SEND_ONE_TO_ONE = '2',
  RENDERER_SEND_ONE_TO_SEVERAL = '3',
  RENDERER_SEND_ONE_TO_ALL = '4',
  RENDERER_INVOKE_TO_SELF = '5',
  RENDERER_INVOKE_TO_MAIN = '6',
  RENDERER_INVOKE_ONE_TO_ONE = '7',
  RENDERER_INVOKE_ONE_TO_SEVERAL = '8',
  RENDERER_INVOKE_ONE_TO_ALL = '9',
}

export enum CUSTOM_CHANNEL_TYPE {
  CREATE_WINDOW = 0,
  CREATE_VIEW = 1,
}