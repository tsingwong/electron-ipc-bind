"use strict";
const path = require("path");
const electron = require("electron");
const core = require("@electron-bvm/core");
const token = "%[a-f0-9]{2}";
const singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
const multiMatcher = new RegExp("(" + token + ")+", "gi");
function decodeComponents(components, split) {
  try {
    return [decodeURIComponent(components.join(""))];
  } catch {
  }
  if (components.length === 1) {
    return components;
  }
  split = split || 1;
  const left = components.slice(0, split);
  const right = components.slice(split);
  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}
function decode$1(input) {
  try {
    return decodeURIComponent(input);
  } catch {
    let tokens = input.match(singleMatcher) || [];
    for (let i = 1; i < tokens.length; i++) {
      input = decodeComponents(tokens, i).join("");
      tokens = input.match(singleMatcher) || [];
    }
    return input;
  }
}
function customDecodeURIComponent(input) {
  const replaceMap = {
    "%FE%FF": "��",
    "%FF%FE": "��"
  };
  let match = multiMatcher.exec(input);
  while (match) {
    try {
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch {
      const result = decode$1(match[0]);
      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }
    match = multiMatcher.exec(input);
  }
  replaceMap["%C2"] = "�";
  const entries = Object.keys(replaceMap);
  for (const key of entries) {
    input = input.replace(new RegExp(key, "g"), replaceMap[key]);
  }
  return input;
}
function decodeUriComponent(encodedURI) {
  if (typeof encodedURI !== "string") {
    throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
  }
  try {
    return decodeURIComponent(encodedURI);
  } catch {
    return customDecodeURIComponent(encodedURI);
  }
}
function splitOnFirst(string, separator) {
  if (!(typeof string === "string" && typeof separator === "string")) {
    throw new TypeError("Expected the arguments to be of type `string`");
  }
  if (string === "" || separator === "") {
    return [];
  }
  const separatorIndex = string.indexOf(separator);
  if (separatorIndex === -1) {
    return [];
  }
  return [
    string.slice(0, separatorIndex),
    string.slice(separatorIndex + separator.length)
  ];
}
function includeKeys(object, predicate) {
  const result = {};
  if (Array.isArray(predicate)) {
    for (const key of predicate) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor == null ? void 0 : descriptor.enumerable) {
        Object.defineProperty(result, key, descriptor);
      }
    }
  } else {
    for (const key of Reflect.ownKeys(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor.enumerable) {
        const value = object[key];
        if (predicate(key, value, object)) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    }
  }
  return result;
}
const isNullOrUndefined = (value) => value === null || value === void 0;
const strictUriEncode = (string) => encodeURIComponent(string).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
const encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case "index": {
      return (key) => (result, value) => {
        const index = result.length;
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), "[", index, "]"].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
        ];
      };
    }
    case "bracket": {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), "[]"].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), "[]=", encode(value, options)].join("")
        ];
      };
    }
    case "colon-list-separator": {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            [encode(key, options), ":list="].join("")
          ];
        }
        return [
          ...result,
          [encode(key, options), ":list=", encode(value, options)].join("")
        ];
      };
    }
    case "comma":
    case "separator":
    case "bracket-separator": {
      const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        value = value === null ? "" : value;
        if (result.length === 0) {
          return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
        }
        return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
      };
    }
    default: {
      return (key) => (result, value) => {
        if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
          return result;
        }
        if (value === null) {
          return [
            ...result,
            encode(key, options)
          ];
        }
        return [
          ...result,
          [encode(key, options), "=", encode(value, options)].join("")
        ];
      };
    }
  }
}
function parserForArrayFormat(options) {
  let result;
  switch (options.arrayFormat) {
    case "index": {
      return (key, value, accumulator) => {
        result = /\[(\d*)]$/.exec(key);
        key = key.replace(/\[\d*]$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = {};
        }
        accumulator[key][result[1]] = value;
      };
    }
    case "bracket": {
      return (key, value, accumulator) => {
        result = /(\[])$/.exec(key);
        key = key.replace(/\[]$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = [value];
          return;
        }
        accumulator[key] = [...accumulator[key], value];
      };
    }
    case "colon-list-separator": {
      return (key, value, accumulator) => {
        result = /(:list)$/.exec(key);
        key = key.replace(/:list$/, "");
        if (!result) {
          accumulator[key] = value;
          return;
        }
        if (accumulator[key] === void 0) {
          accumulator[key] = [value];
          return;
        }
        accumulator[key] = [...accumulator[key], value];
      };
    }
    case "comma":
    case "separator": {
      return (key, value, accumulator) => {
        const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
        const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
        value = isEncodedArray ? decode(value, options) : value;
        const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
        accumulator[key] = newValue;
      };
    }
    case "bracket-separator": {
      return (key, value, accumulator) => {
        const isArray = /(\[])$/.test(key);
        key = key.replace(/\[]$/, "");
        if (!isArray) {
          accumulator[key] = value ? decode(value, options) : value;
          return;
        }
        const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
        if (accumulator[key] === void 0) {
          accumulator[key] = arrayValue;
          return;
        }
        accumulator[key] = [...accumulator[key], ...arrayValue];
      };
    }
    default: {
      return (key, value, accumulator) => {
        if (accumulator[key] === void 0) {
          accumulator[key] = value;
          return;
        }
        accumulator[key] = [...[accumulator[key]].flat(), value];
      };
    }
  }
}
function validateArrayFormatSeparator(value) {
  if (typeof value !== "string" || value.length !== 1) {
    throw new TypeError("arrayFormatSeparator must be single character string");
  }
}
function encode(value, options) {
  if (options.encode) {
    return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  }
  return value;
}
function decode(value, options) {
  if (options.decode) {
    return decodeUriComponent(value);
  }
  return value;
}
function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort();
  }
  if (typeof input === "object") {
    return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
  }
  return input;
}
function removeHash(input) {
  const hashStart = input.indexOf("#");
  if (hashStart !== -1) {
    input = input.slice(0, hashStart);
  }
  return input;
}
function getHash(url2) {
  let hash = "";
  const hashStart = url2.indexOf("#");
  if (hashStart !== -1) {
    hash = url2.slice(hashStart);
  }
  return hash;
}
function parseValue(value, options) {
  if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
    value = Number(value);
  } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
    value = value.toLowerCase() === "true";
  }
  return value;
}
function extract(input) {
  input = removeHash(input);
  const queryStart = input.indexOf("?");
  if (queryStart === -1) {
    return "";
  }
  return input.slice(queryStart + 1);
}
function parse(query, options) {
  options = {
    decode: true,
    sort: true,
    arrayFormat: "none",
    arrayFormatSeparator: ",",
    parseNumbers: false,
    parseBooleans: false,
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const formatter = parserForArrayFormat(options);
  const returnValue = /* @__PURE__ */ Object.create(null);
  if (typeof query !== "string") {
    return returnValue;
  }
  query = query.trim().replace(/^[?#&]/, "");
  if (!query) {
    return returnValue;
  }
  for (const parameter of query.split("&")) {
    if (parameter === "") {
      continue;
    }
    const parameter_ = options.decode ? parameter.replace(/\+/g, " ") : parameter;
    let [key, value] = splitOnFirst(parameter_, "=");
    if (key === void 0) {
      key = parameter_;
    }
    value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
    formatter(decode(key, options), value, returnValue);
  }
  for (const [key, value] of Object.entries(returnValue)) {
    if (typeof value === "object" && value !== null) {
      for (const [key2, value2] of Object.entries(value)) {
        value[key2] = parseValue(value2, options);
      }
    } else {
      returnValue[key] = parseValue(value, options);
    }
  }
  if (options.sort === false) {
    return returnValue;
  }
  return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
    const value = returnValue[key];
    if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
      result[key] = keysSorter(value);
    } else {
      result[key] = value;
    }
    return result;
  }, /* @__PURE__ */ Object.create(null));
}
function stringify(object, options) {
  if (!object) {
    return "";
  }
  options = {
    encode: true,
    strict: true,
    arrayFormat: "none",
    arrayFormatSeparator: ",",
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
  const formatter = encoderForArrayFormat(options);
  const objectCopy = {};
  for (const [key, value] of Object.entries(object)) {
    if (!shouldFilter(key)) {
      objectCopy[key] = value;
    }
  }
  const keys = Object.keys(objectCopy);
  if (options.sort !== false) {
    keys.sort(options.sort);
  }
  return keys.map((key) => {
    const value = object[key];
    if (value === void 0) {
      return "";
    }
    if (value === null) {
      return encode(key, options);
    }
    if (Array.isArray(value)) {
      if (value.length === 0 && options.arrayFormat === "bracket-separator") {
        return encode(key, options) + "[]";
      }
      return value.reduce(formatter(key), []).join("&");
    }
    return encode(key, options) + "=" + encode(value, options);
  }).filter((x) => x.length > 0).join("&");
}
function parseUrl(url2, options) {
  var _a;
  options = {
    decode: true,
    ...options
  };
  let [url_, hash] = splitOnFirst(url2, "#");
  if (url_ === void 0) {
    url_ = url2;
  }
  return {
    url: ((_a = url_ == null ? void 0 : url_.split("?")) == null ? void 0 : _a[0]) ?? "",
    query: parse(extract(url2), options),
    ...options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
  };
}
function stringifyUrl(object, options) {
  options = {
    encode: true,
    strict: true,
    [encodeFragmentIdentifier]: true,
    ...options
  };
  const url2 = removeHash(object.url).split("?")[0] || "";
  const queryFromUrl = extract(object.url);
  const query = {
    ...parse(queryFromUrl, { sort: false }),
    ...object.query
  };
  let queryString2 = stringify(query, options);
  if (queryString2) {
    queryString2 = `?${queryString2}`;
  }
  let hash = getHash(object.url);
  if (object.fragmentIdentifier) {
    const urlObjectForFragmentEncode = new URL(url2);
    urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
    hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
  }
  return `${url2}${queryString2}${hash}`;
}
function pick(input, filter, options) {
  options = {
    parseFragmentIdentifier: true,
    [encodeFragmentIdentifier]: false,
    ...options
  };
  const { url: url2, query, fragmentIdentifier } = parseUrl(input, options);
  return stringifyUrl({
    url: url2,
    query: includeKeys(query, filter),
    fragmentIdentifier
  }, options);
}
function exclude(input, filter, options) {
  const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
  return pick(input, exclusionFilter, options);
}
const queryString = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exclude,
  extract,
  parse,
  parseUrl,
  pick,
  stringify,
  stringifyUrl
}, Symbol.toStringTag, { value: "Module" }));
const CUSTOM_CHANNEL = "CUSTOM_CHANNEL";
var WINDOW_NAME = /* @__PURE__ */ ((WINDOW_NAME2) => {
  WINDOW_NAME2["APP"] = "App";
  WINDOW_NAME2["BRAMBLE"] = "Bramble";
  WINDOW_NAME2["BRIAR"] = "Briar";
  return WINDOW_NAME2;
})(WINDOW_NAME || {});
var CUSTOM_CHANNEL_TYPE = /* @__PURE__ */ ((CUSTOM_CHANNEL_TYPE2) => {
  CUSTOM_CHANNEL_TYPE2[CUSTOM_CHANNEL_TYPE2["CREATE_WINDOW"] = 0] = "CREATE_WINDOW";
  CUSTOM_CHANNEL_TYPE2[CUSTOM_CHANNEL_TYPE2["CREATE_VIEW"] = 1] = "CREATE_VIEW";
  return CUSTOM_CHANNEL_TYPE2;
})(CUSTOM_CHANNEL_TYPE || {});
var BVM_EVENT_NAME = /* @__PURE__ */ ((BVM_EVENT_NAME2) => {
  BVM_EVENT_NAME2["GET_ALL_POOL"] = "GET_ALL_POOL";
  BVM_EVENT_NAME2["SEND_MESSAGE_TO"] = "SEND_MESSAGE_TO";
  return BVM_EVENT_NAME2;
})(BVM_EVENT_NAME || {});
const events = core.useEvents("browser");
const webContentPool = core.useWebContentPool();
const preloadPath = path.join(__dirname, "./preload.js");
electron.ipcMain.handle(CUSTOM_CHANNEL, (_, payload) => {
  const { type, name, url: url2 } = payload;
  let winOrView = null;
  switch (type) {
    case CUSTOM_CHANNEL_TYPE.CREATE_WINDOW:
      winOrView = new electron.BrowserWindow({
        title: name,
        webPreferences: {
          preload: preloadPath
        }
      });
      winOrView.loadURL(url2);
      winOrView.webContents.openDevTools();
      events.addWebContent(name, winOrView.webContents);
      break;
    case CUSTOM_CHANNEL_TYPE.CREATE_VIEW:
      winOrView = new electron.BrowserView({
        webPreferences: {
          preload: preloadPath
        }
      });
      winOrView.webContents.loadURL(url2);
      winOrView.webContents.openDevTools({ mode: "detach" });
      events.addWebContent(name, winOrView.webContents);
      break;
  }
  return winOrView == null ? void 0 : winOrView.webContents.id;
});
events.handle("*", BVM_EVENT_NAME.GET_ALL_POOL, (...args) => {
  return webContentPool.getAllNames();
});
events.on("*", BVM_EVENT_NAME.SEND_MESSAGE_TO, (...args) => {
  console.log("主线程接收到同步方法，参数", args);
});
events.handle("*", BVM_EVENT_NAME.SEND_MESSAGE_TO, (...args) => {
  console.log("主线程接收到异步方法，参数", args);
  return "异步方法主线程返回数据";
});
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const url = process.env.VITE_DEV_SERVER_URL;
const indexHTML = path.join("../dist/index.html");
let win = null;
async function createWindow() {
  win = new electron.BrowserWindow({
    title: WINDOW_NAME.APP,
    webPreferences: {
      preload: preloadPath
    }
  });
  events.addWebContent(WINDOW_NAME.APP, win.webContents);
  if (url) {
    win.loadURL(
      queryString.stringifyUrl({
        url,
        query: {
          name: WINDOW_NAME.APP
        }
      })
    );
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHTML);
  }
  const template = [
    {
      label: "app",
      // macOS下第一个标签是应用程序名字，此处设置无效
      submenu: [
        {
          label: "退出",
          click: () => {
            electron.app.quit();
          }
        },
        {
          label: "关于",
          click: () => {
            electron.app.showAboutPanel();
          }
        }
      ]
    },
    {
      label: "编辑",
      submenu: [
        { label: "复制", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "粘贴", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "剪切", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "撤销", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "重做", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { label: "全选", accelerator: "CmdOrCtrl+A", role: "selectAll" }
      ]
    },
    {
      label: "操作",
      submenu: [
        {
          label: "主线程 => 所有渲染进程发送同步消息",
          click: () => {
            events.emitTo("*", BVM_EVENT_NAME.SEND_MESSAGE_TO, "主线程 => 所有渲染进程发送同步消息");
          }
        },
        {
          label: "主线程 => 所有渲染进程发送异步消息",
          click: () => {
            events.invokeTo("*", BVM_EVENT_NAME.SEND_MESSAGE_TO, "主线程 => 所有渲染进程发送异步消息").then((res) => console.log("主进程接受到所有渲染进程的异步返回结果", res));
          }
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  allWindows.length ? allWindows[0].focus() : createWindow();
});
