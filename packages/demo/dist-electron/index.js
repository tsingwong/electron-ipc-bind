"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const path = require("path");
const electron = require("electron");
const crypto = require("crypto");
const EventEmitter = require("events");
var freeGlobal$1 = typeof global == "object" && global && global.Object === Object && global;
const freeGlobal$2 = freeGlobal$1;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
var root$1 = freeGlobal$2 || freeSelf$1 || Function("return this")();
const root$2 = root$1;
var Symbol$1 = root$2.Symbol;
const Symbol$2 = Symbol$1;
var objectProto$2 = Object.prototype;
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
var nativeObjectToString$2 = objectProto$2.toString;
var symToStringTag$2 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$2), tag = value[symToStringTag$2];
  try {
    value[symToStringTag$2] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$2.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$2] = tag;
    } else {
      delete value[symToStringTag$2];
    }
  }
  return result;
}
var objectProto$1 = Object.prototype;
var nativeObjectToString$1 = objectProto$1.toString;
function objectToString$1(value) {
  return nativeObjectToString$1.call(value);
}
var nullTag$1 = "[object Null]", undefinedTag$1 = "[object Undefined]";
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag$1(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag$1 : nullTag$1;
  }
  return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
}
function isObjectLike$1(value) {
  return value != null && typeof value == "object";
}
var isArray$1 = Array.isArray;
const isArray$2 = isArray$1;
var stringTag$1 = "[object String]";
function isString$1(value) {
  return typeof value == "string" || !isArray$2(value) && isObjectLike$1(value) && baseGetTag$1(value) == stringTag$1;
}
let WebContentPool$1 = class WebContentPool {
  constructor() {
    __publicField(this, "pool", /* @__PURE__ */ new Map());
    //
    __publicField(this, "webContentIdMap", /* @__PURE__ */ new Map());
  }
  add(name, webContent) {
    if (this.pool.has(name)) {
      this.remove(name);
    }
    this.pool.set(name, webContent);
    this.webContentIdMap.set(webContent.id, name);
    webContent.on("destroyed", () => this.remove(name));
  }
  get(idOrName) {
    let _idOrName = idOrName;
    if (!isString$1(_idOrName)) {
      _idOrName = this.webContentIdMap.get(_idOrName) || "";
    }
    return this.pool.get(_idOrName);
  }
  getAll() {
    return [...this.pool.values()];
  }
  remove(idOrName) {
    let _idOrName = idOrName;
    if (!isString$1(_idOrName)) {
      const id = _idOrName;
      _idOrName = this.webContentIdMap.get(_idOrName) || "";
      this.webContentIdMap.delete(id);
    } else {
      const webContent = this.pool.get(_idOrName);
      if (webContent) {
        this.webContentIdMap.delete(webContent.id);
      }
    }
    return this.pool.delete(_idOrName);
  }
  clear() {
    this.pool.clear();
    this.webContentIdMap.clear();
  }
  getName(id) {
    return this.webContentIdMap.get(id);
  }
  getAllNames() {
    return [...this.webContentIdMap.values()];
  }
};
const webContentPool$1 = new WebContentPool$1();
const useWebContentPool = () => webContentPool$1;
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
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;
var isArray = Array.isArray;
var isArray_default = isArray;
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var trimmedEndIndex_default = trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var baseTrim_default = baseTrim;
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol_default(value)) {
    return NAN;
  }
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_default = toNumber;
var INFINITY = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_default = toFinite;
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default = toInteger;
function identity(value) {
  return value;
}
var identity_default = identity;
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var toSource_default = toSource;
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;
var WeakMap = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap;
var metaMap = WeakMap_default && new WeakMap_default();
var metaMap_default = metaMap;
var baseSetData = !metaMap_default ? identity_default : function(func, data) {
  metaMap_default.set(func, data);
  return func;
};
var baseSetData_default = baseSetData;
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate_default = baseCreate;
function createCtor(Ctor) {
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0:
        return new Ctor();
      case 1:
        return new Ctor(args[0]);
      case 2:
        return new Ctor(args[0], args[1]);
      case 3:
        return new Ctor(args[0], args[1], args[2]);
      case 4:
        return new Ctor(args[0], args[1], args[2], args[3]);
      case 5:
        return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate_default(Ctor.prototype), result = Ctor.apply(thisBinding, args);
    return isObject_default(result) ? result : thisBinding;
  };
}
var createCtor_default = createCtor;
var WRAP_BIND_FLAG = 1;
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor_default(func);
  function wrapper() {
    var fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}
var createBind_default = createBind;
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default = apply;
var nativeMax = Math.max;
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}
var composeArgs_default = composeArgs;
var nativeMax2 = Math.max;
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax2(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}
var composeArgsRight_default = composeArgsRight;
function countHolders(array, placeholder) {
  var length = array.length, result = 0;
  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}
var countHolders_default = countHolders;
function baseLodash() {
}
var baseLodash_default = baseLodash;
var MAX_ARRAY_LENGTH = 4294967295;
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}
LazyWrapper.prototype = baseCreate_default(baseLodash_default.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
var LazyWrapper_default = LazyWrapper;
function noop() {
}
var noop_default = noop;
var getData = !metaMap_default ? noop_default : function(func) {
  return metaMap_default.get(func);
};
var getData_default = getData;
var realNames = {};
var realNames_default = realNames;
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + "", array = realNames_default[result], length = hasOwnProperty3.call(realNames_default, result) ? array.length : 0;
  while (length--) {
    var data = array[length], otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}
var getFuncName_default = getFuncName;
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = void 0;
}
LodashWrapper.prototype = baseCreate_default(baseLodash_default.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
var LodashWrapper_default = LodashWrapper;
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var copyArray_default = copyArray;
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper_default) {
    return wrapper.clone();
  }
  var result = new LodashWrapper_default(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray_default(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}
var wrapperClone_default = wrapperClone;
var objectProto5 = Object.prototype;
var hasOwnProperty4 = objectProto5.hasOwnProperty;
function lodash(value) {
  if (isObjectLike_default(value) && !isArray_default(value) && !(value instanceof LazyWrapper_default)) {
    if (value instanceof LodashWrapper_default) {
      return value;
    }
    if (hasOwnProperty4.call(value, "__wrapped__")) {
      return wrapperClone_default(value);
    }
  }
  return new LodashWrapper_default(value);
}
lodash.prototype = baseLodash_default.prototype;
lodash.prototype.constructor = lodash;
var wrapperLodash_default = lodash;
function isLaziable(func) {
  var funcName = getFuncName_default(func), other = wrapperLodash_default[funcName];
  if (typeof other != "function" || !(funcName in LazyWrapper_default.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData_default(other);
  return !!data && func === data[0];
}
var isLaziable_default = isLaziable;
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var shortOut_default = shortOut;
var setData = shortOut_default(baseSetData_default);
var setData_default = setData;
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/;
var reSplitDetails = /,? & /;
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}
var getWrapDetails_default = getWrapDetails;
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
  details = details.join(length > 2 ? ", " : " ");
  return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
}
var insertWrapDetails_default = insertWrapDetails;
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default = constant;
var defineProperty = function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var defineProperty_default = defineProperty;
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var arrayEach_default = arrayEach;
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default = baseFindIndex;
function baseIsNaN(value) {
  return value !== value;
}
var baseIsNaN_default = baseIsNaN;
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
var strictIndexOf_default = strictIndexOf;
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
}
var baseIndexOf_default = baseIndexOf;
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf_default(array, value, 0) > -1;
}
var arrayIncludes_default = arrayIncludes;
var WRAP_BIND_FLAG2 = 1;
var WRAP_BIND_KEY_FLAG = 2;
var WRAP_CURRY_FLAG = 8;
var WRAP_CURRY_RIGHT_FLAG = 16;
var WRAP_PARTIAL_FLAG = 32;
var WRAP_PARTIAL_RIGHT_FLAG = 64;
var WRAP_ARY_FLAG = 128;
var WRAP_REARG_FLAG = 256;
var WRAP_FLIP_FLAG = 512;
var wrapFlags = [
  ["ary", WRAP_ARY_FLAG],
  ["bind", WRAP_BIND_FLAG2],
  ["bindKey", WRAP_BIND_KEY_FLAG],
  ["curry", WRAP_CURRY_FLAG],
  ["curryRight", WRAP_CURRY_RIGHT_FLAG],
  ["flip", WRAP_FLIP_FLAG],
  ["partial", WRAP_PARTIAL_FLAG],
  ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
  ["rearg", WRAP_REARG_FLAG]
];
function updateWrapDetails(details, bitmask) {
  arrayEach_default(wrapFlags, function(pair) {
    var value = "_." + pair[0];
    if (bitmask & pair[1] && !arrayIncludes_default(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}
var updateWrapDetails_default = updateWrapDetails;
function setWrapToString(wrapper, reference, bitmask) {
  var source = reference + "";
  return setToString_default(wrapper, insertWrapDetails_default(source, updateWrapDetails_default(getWrapDetails_default(source), bitmask)));
}
var setWrapToString_default = setWrapToString;
var WRAP_BIND_FLAG3 = 1;
var WRAP_BIND_KEY_FLAG2 = 2;
var WRAP_CURRY_BOUND_FLAG = 4;
var WRAP_CURRY_FLAG2 = 8;
var WRAP_PARTIAL_FLAG2 = 32;
var WRAP_PARTIAL_RIGHT_FLAG2 = 64;
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG2, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
  bitmask |= isCurry ? WRAP_PARTIAL_FLAG2 : WRAP_PARTIAL_RIGHT_FLAG2;
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG2 : WRAP_PARTIAL_FLAG2);
  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG3 | WRAP_BIND_KEY_FLAG2);
  }
  var newData = [
    func,
    bitmask,
    thisArg,
    newPartials,
    newHolders,
    newPartialsRight,
    newHoldersRight,
    argPos,
    ary,
    arity
  ];
  var result = wrapFunc.apply(void 0, newData);
  if (isLaziable_default(func)) {
    setData_default(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString_default(result, func, bitmask);
}
var createRecurry_default = createRecurry;
function getHolder(func) {
  var object = func;
  return object.placeholder;
}
var getHolder_default = getHolder;
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;
var nativeMin = Math.min;
function reorder(array, indexes) {
  var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray_default(array);
  while (length--) {
    var index = indexes[length];
    array[length] = isIndex_default(index, arrLength) ? oldArray[index] : void 0;
  }
  return array;
}
var reorder_default = reorder;
var PLACEHOLDER = "__lodash_placeholder__";
function replaceHolders(array, placeholder) {
  var index = -1, length = array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}
var replaceHolders_default = replaceHolders;
var WRAP_BIND_FLAG4 = 1;
var WRAP_BIND_KEY_FLAG3 = 2;
var WRAP_CURRY_FLAG3 = 8;
var WRAP_CURRY_RIGHT_FLAG2 = 16;
var WRAP_ARY_FLAG2 = 128;
var WRAP_FLIP_FLAG2 = 512;
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG2, isBind = bitmask & WRAP_BIND_FLAG4, isBindKey = bitmask & WRAP_BIND_KEY_FLAG3, isCurried = bitmask & (WRAP_CURRY_FLAG3 | WRAP_CURRY_RIGHT_FLAG2), isFlip = bitmask & WRAP_FLIP_FLAG2, Ctor = isBindKey ? void 0 : createCtor_default(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length;
    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder_default(wrapper), holdersCount = countHolders_default(args, placeholder);
    }
    if (partials) {
      args = composeArgs_default(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight_default(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders_default(args, placeholder);
      return createRecurry_default(
        func,
        bitmask,
        createHybrid,
        wrapper.placeholder,
        thisArg,
        args,
        newHolders,
        argPos,
        ary,
        arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
    length = args.length;
    if (argPos) {
      args = reorder_default(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root_default && this instanceof wrapper) {
      fn = Ctor || createCtor_default(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}
var createHybrid_default = createHybrid;
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor_default(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length, placeholder = getHolder_default(wrapper);
    while (index--) {
      args[index] = arguments[index];
    }
    var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders_default(args, placeholder);
    length -= holders.length;
    if (length < arity) {
      return createRecurry_default(
        func,
        bitmask,
        createHybrid_default,
        wrapper.placeholder,
        void 0,
        args,
        holders,
        void 0,
        void 0,
        arity - length
      );
    }
    var fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    return apply_default(fn, this, args);
  }
  return wrapper;
}
var createCurry_default = createCurry;
var WRAP_BIND_FLAG5 = 1;
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG5, Ctor = createCtor_default(func);
  function wrapper() {
    var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply_default(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}
var createPartial_default = createPartial;
var PLACEHOLDER2 = "__lodash_placeholder__";
var WRAP_BIND_FLAG6 = 1;
var WRAP_BIND_KEY_FLAG4 = 2;
var WRAP_CURRY_BOUND_FLAG2 = 4;
var WRAP_CURRY_FLAG4 = 8;
var WRAP_ARY_FLAG3 = 128;
var WRAP_REARG_FLAG2 = 256;
var nativeMin2 = Math.min;
function mergeData(data, source) {
  var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG6 | WRAP_BIND_KEY_FLAG4 | WRAP_ARY_FLAG3);
  var isCombo = srcBitmask == WRAP_ARY_FLAG3 && bitmask == WRAP_CURRY_FLAG4 || srcBitmask == WRAP_ARY_FLAG3 && bitmask == WRAP_REARG_FLAG2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG3 | WRAP_REARG_FLAG2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG4;
  if (!(isCommon || isCombo)) {
    return data;
  }
  if (srcBitmask & WRAP_BIND_FLAG6) {
    data[2] = source[2];
    newBitmask |= bitmask & WRAP_BIND_FLAG6 ? 0 : WRAP_CURRY_BOUND_FLAG2;
  }
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs_default(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders_default(data[3], PLACEHOLDER2) : source[4];
  }
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight_default(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders_default(data[5], PLACEHOLDER2) : source[6];
  }
  value = source[7];
  if (value) {
    data[7] = value;
  }
  if (srcBitmask & WRAP_ARY_FLAG3) {
    data[8] = data[8] == null ? source[8] : nativeMin2(data[8], source[8]);
  }
  if (data[9] == null) {
    data[9] = source[9];
  }
  data[0] = source[0];
  data[1] = newBitmask;
  return data;
}
var mergeData_default = mergeData;
var FUNC_ERROR_TEXT = "Expected a function";
var WRAP_BIND_FLAG7 = 1;
var WRAP_BIND_KEY_FLAG5 = 2;
var WRAP_CURRY_FLAG5 = 8;
var WRAP_CURRY_RIGHT_FLAG3 = 16;
var WRAP_PARTIAL_FLAG3 = 32;
var WRAP_PARTIAL_RIGHT_FLAG3 = 64;
var nativeMax3 = Math.max;
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG5;
  if (!isBindKey && typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG3 | WRAP_PARTIAL_RIGHT_FLAG3);
    partials = holders = void 0;
  }
  ary = ary === void 0 ? ary : nativeMax3(toInteger_default(ary), 0);
  arity = arity === void 0 ? arity : toInteger_default(arity);
  length -= holders ? holders.length : 0;
  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG3) {
    var partialsRight = partials, holdersRight = holders;
    partials = holders = void 0;
  }
  var data = isBindKey ? void 0 : getData_default(func);
  var newData = [
    func,
    bitmask,
    thisArg,
    partials,
    holders,
    partialsRight,
    holdersRight,
    argPos,
    ary,
    arity
  ];
  if (data) {
    mergeData_default(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax3(newData[9] - length, 0);
  if (!arity && bitmask & (WRAP_CURRY_FLAG5 | WRAP_CURRY_RIGHT_FLAG3)) {
    bitmask &= ~(WRAP_CURRY_FLAG5 | WRAP_CURRY_RIGHT_FLAG3);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG7) {
    var result = createBind_default(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG5 || bitmask == WRAP_CURRY_RIGHT_FLAG3) {
    result = createCurry_default(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG3 || bitmask == (WRAP_BIND_FLAG7 | WRAP_PARTIAL_FLAG3)) && !holders.length) {
    result = createPartial_default(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid_default.apply(void 0, newData);
  }
  var setter = data ? baseSetData_default : setData_default;
  return setWrapToString_default(setter(result, newData), func, bitmask);
}
var createWrap_default = createWrap;
var nativeMax4 = Math.max;
function overRest(func, start, transform) {
  start = nativeMax4(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax4(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var overRest_default = overRest;
function baseRest(func, start) {
  return setToString_default(overRest_default(func, start, identity_default), func + "");
}
var baseRest_default = baseRest;
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;
var objectProto6 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto6;
  return value === proto;
}
var isPrototype_default = isPrototype;
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
var propertyIsEnumerable = objectProto7.propertyIsEnumerable;
var isArguments = baseIsArguments_default(function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty5.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;
var WRAP_BIND_FLAG8 = 1;
var WRAP_PARTIAL_FLAG4 = 32;
var bind = baseRest_default(function(func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG8;
  if (partials.length) {
    var holders = replaceHolders_default(partials, getHolder_default(bind));
    bitmask |= WRAP_PARTIAL_FLAG4;
  }
  return createWrap_default(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
var bind_default = bind;
var DataView = getNative_default(root_default, "DataView");
var DataView_default = DataView;
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;
var Set = getNative_default(root_default, "Set");
var Set_default = Set;
var mapTag2 = "[object Map]";
var objectTag2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;
var stringTag2 = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray_default(value) && isObjectLike_default(value) && baseGetTag_default(value) == stringTag2;
}
var isString_default = isString;
var mapTag3 = "[object Map]";
var setTag3 = "[object Set]";
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
    return !value.length;
  }
  var tag = getTag_default(value);
  if (tag == mapTag3 || tag == setTag3) {
    return !value.size;
  }
  if (isPrototype_default(value)) {
    return !baseKeys_default(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty7.call(value, key)) {
      return false;
    }
  }
  return true;
}
var isEmpty_default = isEmpty;
function isUndefined(value) {
  return value === void 0;
}
var isUndefined_default = isUndefined;
var WebContentPool2 = class {
  constructor() {
    __publicField(this, "pool", /* @__PURE__ */ new Map());
    //
    __publicField(this, "webContentIdMap", /* @__PURE__ */ new Map());
  }
  add(name, webContent) {
    if (this.pool.has(name)) {
      this.remove(name);
    }
    this.pool.set(name, webContent);
    this.webContentIdMap.set(webContent.id, name);
    webContent.on("destroyed", () => this.remove(name));
  }
  get(idOrName) {
    let _idOrName = idOrName;
    if (!isString_default(_idOrName)) {
      _idOrName = this.webContentIdMap.get(_idOrName) || "";
    }
    return this.pool.get(_idOrName);
  }
  getAll() {
    return [...this.pool.values()];
  }
  remove(idOrName) {
    let _idOrName = idOrName;
    if (!isString_default(_idOrName)) {
      const id = _idOrName;
      _idOrName = this.webContentIdMap.get(_idOrName) || "";
      this.webContentIdMap.delete(id);
    } else {
      const webContent = this.pool.get(_idOrName);
      if (webContent) {
        this.webContentIdMap.delete(webContent.id);
      }
    }
    return this.pool.delete(_idOrName);
  }
  clear() {
    this.pool.clear();
    this.webContentIdMap.clear();
  }
  getName(id) {
    return this.webContentIdMap.get(id);
  }
  getAllNames() {
    return [...this.webContentIdMap.values()];
  }
};
var webContentPool = new WebContentPool2();
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
var require_electron = __commonJS({
  "../../node_modules/.pnpm/electron@27.0.2/node_modules/electron/index.js"(exports2, module2) {
    var fs = __require("fs");
    var path2 = __require("path");
    var pathFile = path2.join(__dirname, "path.txt");
    function getElectronPath() {
      let executablePath;
      if (fs.existsSync(pathFile)) {
        executablePath = fs.readFileSync(pathFile, "utf-8");
      }
      if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
        return path2.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
      }
      if (executablePath) {
        return path2.join(__dirname, "dist", executablePath);
      } else {
        throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again");
      }
    }
    module2.exports = getElectronPath();
  }
});
var import_electron = __toESM(require_electron(), 1);
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
var native_default = {
  randomUUID: crypto.randomUUID
};
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;
var EVENT_CENTER = "__ELECTRON_EVENTS_CENTER__";
var MAIN_EVENT_NAME = "main";
var ANY_WINDOW_SYMBOL = "*";
var SELF_NAME = "__ELECTRON_EVENTS_SELF__";
var IpcBaseEvent = class {
  constructor() {
    __publicField(this, "eventMap", new EventEmitter());
    __publicField(this, "responsiveEventStore", /* @__PURE__ */ Object.create(null));
    __publicField(this, "responsiveEventMap", {
      set: (name, listener) => {
        this.responsiveEventStore[name] = listener;
      },
      get: (name) => {
        return this.responsiveEventStore[name];
      },
      delete: (name) => {
        delete this.responsiveEventStore[name];
      }
    });
  }
  on(webContentName, eventName, listener) {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener
    );
    this._on(webContentNames, eventNames, callback, false);
    return this;
  }
  once(windowName, eventName, listener) {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      windowName,
      eventName,
      listener
    );
    this._on(webContentNames, eventNames, callback, true);
    return this;
  }
  _normalizeArgs(webContentName, eventName, listener) {
    let _webContentName = webContentName;
    let _eventName = eventName;
    let _listener = listener;
    if (isFunction_default(_eventName)) {
      _listener = _eventName;
      _eventName = _webContentName;
    }
    if (isUndefined_default(_eventName)) {
      _eventName = _webContentName;
      _webContentName = "";
    }
    if (!isArray_default(_webContentName)) {
      _webContentName = [_webContentName];
    }
    if (!isArray_default(_eventName)) {
      _eventName = [_eventName];
    }
    if (isEmpty_default(_webContentName)) {
      _webContentName = [""];
    }
    return {
      webContentNames: _webContentName,
      eventNames: _eventName,
      callback: _listener || noop_default
    };
  }
  _on(windowNames, eventNames, listener, once = false) {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);
      if (once) {
        this.eventMap.once(resEventName, listener);
      } else {
        this.eventMap.on(resEventName, listener);
      }
    });
    return this;
  }
  _each(windowNames, eventNames, callback) {
    for (const windowName of windowNames) {
      for (const eventName of eventNames) {
        callback(windowName, eventName);
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
  _getEventName(webContentName, eventName) {
    const hasWebContentName = webContentName && webContentName !== SELF_NAME;
    return `${hasWebContentName ? `${webContentName}-` : ""}${eventName}`;
  }
  emit(eventName, ...args) {
    let _eventNames = eventName;
    if (!isArray_default(_eventNames)) {
      _eventNames = [_eventNames];
    }
    for (const eventName2 of _eventNames) {
      this.eventMap.emit(eventName2, ...args);
    }
  }
  off(webContentName, eventName, listener) {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener
    );
    this._off(webContentNames, eventNames, callback);
    return this;
  }
  _off(windowNames, eventNames, listener) {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);
      this.eventMap.off(resEventName, listener);
    });
    return this;
  }
  handle(webContentName, eventName, listener) {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener
    );
    this._handle(webContentNames, eventNames, callback);
    return this;
  }
  handleOnce(webContentName, eventName, listener) {
    const { webContentNames, eventNames, callback } = this._normalizeArgs(
      webContentName,
      eventName,
      listener
    );
    this._handle(webContentNames, eventNames, callback, true);
    return this;
  }
  _handle(webContentNames, eventNames, listener, once = false) {
    this._each(webContentNames, eventNames, (webContentName, eventName) => {
      const resEventName = this._getEventName(webContentName, eventName);
      const anyEventName = this._getEventName("*", eventName);
      const handler = this.responsiveEventMap.get(resEventName);
      const anyHandler = this.responsiveEventMap.get(anyEventName);
      if (handler && anyHandler) {
        throw new Error(
          `Error occurred in handler for '${eventName}': Attempted to register a second handler for '${eventName}'`
        );
      }
      if (once) {
        this.responsiveEventMap.set(resEventName, (...args) => {
          listener(...args);
          this.removeHandler(webContentName, eventName);
        });
      } else {
        this.responsiveEventMap.set(resEventName, listener);
      }
    });
    return this;
  }
  removeHandler(webContentName, eventName) {
    const { webContentNames, eventNames } = this._normalizeArgs(webContentName, eventName);
    this._removeHandler(webContentNames, eventNames);
    return this;
  }
  _removeHandler(windowNames, eventNames) {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);
      this.responsiveEventMap.delete(resEventName);
    });
    return this;
  }
  async invoke(eventName, ...args) {
    let _eventNames = eventName;
    const isMultipleEvents = isArray_default(eventName);
    if (!isArray_default(_eventNames)) {
      _eventNames = [_eventNames];
    }
    const resArr = _eventNames.map(async (eventName2) => {
      const handler = this.responsiveEventMap.get(eventName2);
      if (!isFunction_default(handler)) {
        return Promise.reject({
          code: 404,
          message: new Error(
            `Error occurred in handler for '${eventName2}': No handler registered for '${eventName2}'`
          )
        });
      }
      try {
        return await handler(...args);
      } catch (error) {
        return {
          code: 500,
          message: new Error(`Error occurred in handler for '${eventName2}': Execution exception'`),
          payload: error
        };
      }
    });
    return isMultipleEvents ? Promise.all(resArr) : resArr[0];
  }
};
var EVENT_CENTER2 = "__ELECTRON_EVENTS_CENTER__";
var MainIpcEvent = class extends IpcBaseEvent {
  constructor() {
    super();
    import_electron.ipcMain.handle(EVENT_CENTER2, (event, params) => {
      const webContent = event.sender;
      if (!webContent) {
        return;
      }
      const webContentName = webContentPool.getName(webContent.id);
      if (!webContentName) {
        return;
      }
      let { toName: toNames, type = "NORMAL", eventName } = params;
      if (toNames === ANY_WINDOW_SYMBOL) {
        toNames = webContentPool.getAllNames();
        toNames.unshift(MAIN_EVENT_NAME);
      }
      const isSingleToName = isString_default(toNames);
      const isSingleEventName = isString_default(eventName);
      if (!isArray_default(toNames)) {
        toNames = [toNames];
      }
      if (type === "NORMAL") {
        return this._handleNormalEvent(webContentName, toNames, params);
      } else {
        return this._handleResponsiveEvent(webContentName, toNames, params, {
          isSingleToName,
          isSingleEventName
        });
      }
    });
  }
  addWebContent(name, webContent) {
    return webContentPool.add(name, webContent);
  }
  removeWebContent(idOrName) {
    return webContentPool.remove(idOrName);
  }
  /**
   * @description: 渲染进程 => 主进程（不需要返回结果）
   * @param {string} fromName
   * @param {string} toNames
   * @param {MainEventCenterParams} params
   * @return {*}
   */
  _handleNormalEvent(fromName, toNames, params) {
    let { eventName: eventNames, payload } = params;
    for (const toName of toNames) {
      if (toName === MAIN_EVENT_NAME) {
        if (!isArray_default(eventNames)) {
          eventNames = [eventNames];
        }
        for (const eventName of eventNames) {
          const resEventName = this._getEventName(fromName, eventName);
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, eventName);
          this.eventMap.emit(resEventName, ...payload);
          this.eventMap.emit(anyEventName, ...payload);
        }
        return;
      }
      const toWebContent = webContentPool.get(toName);
      if (!toWebContent) {
        return;
      }
      toWebContent.send(EVENT_CENTER2, {
        fromName: fromName === toName ? SELF_NAME : fromName,
        eventNames,
        payload
      });
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
  _handleResponsiveEvent(fromName, toNames, params, { isSingleToName = false, isSingleEventName = false }) {
    let { eventName: eventNames, payload } = params;
    const resOutArr = toNames.map((toName) => {
      if (toName === "main") {
        if (!isArray_default(eventNames)) {
          eventNames = [eventNames];
        }
        const resFromName = fromName === toName ? SELF_NAME : fromName;
        const resInArr = eventNames.map((eventName) => {
          const resEventName = this._getEventName(resFromName, eventName);
          const anyEventName = this._getEventName("*", eventName);
          const handler = this.responsiveEventMap.get(resEventName) || this.responsiveEventMap.get(anyEventName);
          if (!isFunction_default(handler)) {
            return Promise.reject(
              new Error(
                `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`
              )
            );
          }
          return handler(...payload);
        });
        return Promise.all(resInArr);
      }
      return this._listenRenderer(fromName, toName, params);
    });
    return this._getResponse({
      isSingleToName,
      isSingleEventName,
      resArr: resOutArr
    });
  }
  _listenRenderer(fromName, toName, params) {
    const toWebContent = webContentPool.get(toName);
    const { eventName, payload, timeout = 3e3 } = params;
    if (!toWebContent) {
      return [];
    }
    const handlerName = v4_default();
    const eventPromise = new Promise((resolve, reject) => {
      const tid = setTimeout(() => {
        reject({
          code: 408,
          message: new Error(`Listen to the response of window ${toName} timeout`)
        });
      }, timeout);
      import_electron.ipcMain.handleOnce(handlerName, (_, params2) => {
        const { code, message, payload: data } = params2;
        clearTimeout(tid);
        if (code === 200) {
          resolve(data);
        } else {
          reject(message);
        }
      });
    });
    toWebContent.send(EVENT_CENTER2, {
      type: "RESPONSIVE",
      handlerName,
      fromName: fromName === toName ? SELF_NAME : fromName,
      eventName,
      payload
    });
    return eventPromise;
  }
  _getResponse({ isSingleToName, isSingleEventName, resArr }) {
    const result = Promise.all(resArr);
    if (isSingleToName && isSingleEventName) {
      return result.then(([innerRes]) => innerRes[0]);
    } else if (isSingleToName) {
      return result.then(([innerRes]) => innerRes);
    } else if (isSingleEventName) {
      return result.then((res) => res.map((innerRes) => innerRes[0]));
    } else {
      return result;
    }
  }
  /**
   * @description: 主进程 => 渲染进程（不需要返回结果）
   * @param {IStringOrStrings} webContentName
   * @param {IStringOrStrings} eventName
   * @param {array} args
   * @return {*}
   */
  emitTo(webContentName, eventName, ...args) {
    let _webContentNames = webContentName;
    if (ANY_WINDOW_SYMBOL === _webContentNames) {
      _webContentNames = webContentPool.getAllNames();
      this.emit(eventName, ...args);
    }
    if (!isArray_default(_webContentNames)) {
      _webContentNames = [_webContentNames];
    }
    for (const webContentName2 of _webContentNames) {
      const toWebContent = webContentPool.get(webContentName2);
      if (!toWebContent) {
        return;
      }
      toWebContent.send(EVENT_CENTER2, {
        type: "NORMAL",
        fromName: MAIN_EVENT_NAME,
        eventName,
        payload: args
      });
    }
  }
  /**
   * @description: 主进程 => 渲染进程（需要返回结果）
   * @param {IStringOrStrings} webContentName
   * @param {IStringOrStrings} eventName
   * @param {array} args
   * @return {*}
   */
  invokeTo(webContentName, eventName, ...args) {
    let _webContentNames = webContentName;
    if (ANY_WINDOW_SYMBOL === _webContentNames) {
      _webContentNames = webContentPool.getAllNames();
      _webContentNames.unshift(MAIN_EVENT_NAME);
    }
    const isSingleToName = isString_default(_webContentNames);
    const isSingleEventName = isString_default(eventName);
    if (!isArray_default(_webContentNames)) {
      _webContentNames = [_webContentNames];
    }
    return this._handleResponsiveEvent(
      MAIN_EVENT_NAME,
      _webContentNames,
      {
        type: "RESPONSIVE",
        toName: _webContentNames,
        eventName,
        payload: args
      },
      {
        isSingleToName,
        isSingleEventName
      }
    );
  }
};
var import_electron2 = __toESM(require_electron(), 1);
var RendererIpcEvent = class extends IpcBaseEvent {
  constructor() {
    super();
    import_electron2.ipcRenderer.on(EVENT_CENTER, (_, params) => {
      let {
        type = "NORMAL",
        handlerName,
        fromName,
        eventName: eventNames,
        payload
      } = params;
      if (!isArray_default(eventNames)) {
        eventNames = [eventNames];
      }
      if (type === "NORMAL") {
        for (const eventName of eventNames) {
          const resEventName = this._getEventName(fromName, eventName);
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, eventName);
          this.eventMap.emit(resEventName, ...payload);
          this.eventMap.emit(anyEventName, ...payload);
        }
        return;
      }
      if (!handlerName) {
        return;
      }
      const resArr = eventNames.map(async (eventName) => {
        const resEventName = this._getEventName(fromName, eventName);
        const anyEventName = this._getEventName("*", eventName);
        const handler = this.responsiveEventMap.get(resEventName) || this.responsiveEventMap.get(anyEventName);
        if (!isFunction_default(handler)) {
          return Promise.reject({
            code: 404,
            message: `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`
          });
        }
        try {
          return await handler(...payload);
        } catch (error) {
          return {
            code: 500,
            message: new Error(
              `Error occurred in handler for '${eventName}': Execution exception'`
            )
          };
        }
      });
      Promise.all(resArr).then((res) => {
        import_electron2.ipcRenderer.invoke(handlerName, {
          code: 200,
          message: "",
          payload: res
        });
      }).catch((error) => {
        import_electron2.ipcRenderer.invoke(handlerName, error);
      });
    });
  }
  /**
   * @description: 渲染进程1 => 渲染进程2（不需要返回结果）
   * @param {string} webContentName
   * @param {string} eventName
   * @param {array} args
   * @return {*}
   */
  emitTo(webContentName, eventName, ...args) {
    import_electron2.ipcRenderer.invoke(EVENT_CENTER, {
      type: "NORMAL",
      toName: webContentName,
      eventName,
      payload: args
    });
  }
  /**
   * @description: 渲染进程 => 主线程（需要返回结果）
   * @param {string} webContentName
   * @param {string} eventName
   * @param {array} args
   * @return {*}
   */
  invokeTo(webContentName, eventName, ...args) {
    return import_electron2.ipcRenderer.invoke(EVENT_CENTER, {
      type: "RESPONSIVE",
      toName: webContentName,
      eventName,
      payload: args
    });
  }
};
var mainEvents = null;
var rendererEvents = null;
function useEvents(type = process.type) {
  if ("browser" === type) {
    if (!mainEvents) {
      mainEvents = new MainIpcEvent();
    }
    return mainEvents;
  }
  if (!rendererEvents) {
    const methodList = [
      "on",
      "once",
      "emit",
      "emitTo",
      "off",
      "handle",
      "handleOnce",
      "invoke",
      "invokeTo",
      "removeHandler"
    ];
    rendererEvents = new RendererIpcEvent();
    for (const methodName of methodList) {
      rendererEvents[methodName] = bind_default(rendererEvents[methodName], rendererEvents);
    }
  }
  return rendererEvents;
}
const events = useEvents("browser");
const preloadPath = path.join(__dirname, "./preload.js");
electron.ipcMain.handle(CUSTOM_CHANNEL, (_, payload) => {
  const {
    type,
    windowInfo: { name, url: url2 }
  } = payload;
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
      winOrView.webContents.openDevTools();
      events.addWebContent(name, winOrView.webContents);
      break;
  }
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
  const webContentPool2 = useWebContentPool();
  win = new electron.BrowserWindow({
    title: WINDOW_NAME.APP,
    webPreferences: {
      preload: preloadPath
    }
  });
  webContentPool2.add(WINDOW_NAME.APP, win.webContents);
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHTML);
  }
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
