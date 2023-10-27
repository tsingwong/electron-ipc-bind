# [@electron-bvm/core]

[![NPM version](https://img.shields.io/npm/v/@electron-bvm/core?color=a1b858&label=)](https://www.npmjs.com/package/@electron-bvm/core)

## Feature

- Use [tsup](https://tsup.egoist.dev/) to build
- Use [nodemon](https://nodemon.io) and [ts-node](https://typestrong.org/ts-node/) to development
- Use [vitest](https://vitest.dev/) to test
- Use ~~[EsLint](https://eslint.org/), [Prettier](https://prettier.io/)~~ [Biome](https://biomejs.dev/) to lint and format

## API 设计
具体有两套 API 设计

### 同步消息（常见的，不需要返回结果的通信）

- `on(windowName: string | string[], eventName: string | string[], ...args: any[])`：增加对于某个窗口的某个事件的监听
- `once(windowName: string | string[], eventName: string | string[], ...args: any[])`：增加对于某个窗口的某个事件的监听，触发后移除该监听
- `emitTo(windowName: string | string[], eventName: string | string[], ...args: any[])`：触发某个窗口的某个事件
- `off(windowName: string | string[], eventName: string | string[], ...args: any[])`：移除对于某个窗口的某个事件的监听

### 异步消息（异步，需要等待返回结果的通信）

- `handle(windowName: string | string[], eventName: string | string[], ...args: any[])`：增加对于某个窗口的某个事件的监听
- `handleOnce(windowName: string | string[], eventName: string | string[], ...args: any[])`：增加对于某个窗口的某个事件的监听，触发后移除该监听
- `invokeTo(windowName: string | string[], eventName: string | string[], ...args: any[])`：触发某个窗口的某个事件
- `removeHandle(windowName: string | string[], eventName: string | string[], ...args: any[])`：移除对于某个窗口的某个事件的监听


## 设计思路





## License

[MIT](./LICENSE) License © 2023 [tsingwong](https://github.com/tsingwong)
