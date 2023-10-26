export enum ErrorCode {
  SUCCESS = 200,
  NOT_FOUND = 404,
  EXECUTION_EXCEPTION = 500,
  OVERTIME = 408,
}

export const DEFAULT_TIMEOUT = 5000

export const EVENT_CENTER = '__ELECTRON_EVENTS_CENTER__'

export const MAIN_EVENT_NAME = 'main'

export const ANY_WINDOW_SYMBOL = '*'

export const SELF_NAME = '__ELECTRON_EVENTS_SELF__'

export enum EventType {
  NORMAL = 'NORMAL',
  RESPONSIVE = 'RESPONSIVE',
}
