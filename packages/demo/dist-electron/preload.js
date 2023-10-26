"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const electron = require("electron");
const EventEmitter = require("events");
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
const freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
const root$1 = root;
var Symbol$1 = root$1.Symbol;
const Symbol$2 = Symbol$1;
var objectProto$8 = Object.prototype;
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
var nativeObjectToString$1 = objectProto$8.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$6.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$7 = Object.prototype;
var nativeObjectToString = objectProto$7.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isArray = Array.isArray;
const isArray$1 = isArray;
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
function toInteger(value) {
  var result = toFinite(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root$1["__core-js_shared__"];
const coreJsData$1 = coreJsData;
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$6 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$5).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
var WeakMap = getNative(root$1, "WeakMap");
const WeakMap$1 = WeakMap;
var metaMap = WeakMap$1 && new WeakMap$1();
const metaMap$1 = metaMap;
var baseSetData = !metaMap$1 ? identity : function(func, data) {
  metaMap$1.set(func, data);
  return func;
};
const baseSetData$1 = baseSetData;
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject(proto)) {
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
const baseCreate$1 = baseCreate;
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
    var thisBinding = baseCreate$1(Ctor.prototype), result = Ctor.apply(thisBinding, args);
    return isObject(result) ? result : thisBinding;
  };
}
var WRAP_BIND_FLAG$7 = 1;
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG$7, Ctor = createCtor(func);
  function wrapper() {
    var fn = this && this !== root$1 && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}
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
var nativeMax$3 = Math.max;
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax$3(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
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
var nativeMax$2 = Math.max;
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$2(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
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
function countHolders(array, placeholder) {
  var length = array.length, result = 0;
  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}
function baseLodash() {
}
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
LazyWrapper.prototype = baseCreate$1(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
function noop() {
}
var getData = !metaMap$1 ? noop : function(func) {
  return metaMap$1.get(func);
};
const getData$1 = getData;
var realNames = {};
const realNames$1 = realNames;
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + "", array = realNames$1[result], length = hasOwnProperty$4.call(realNames$1, result) ? array.length : 0;
  while (length--) {
    var data = array[length], otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = void 0;
}
LodashWrapper.prototype = baseCreate$1(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function lodash(value) {
  if (isObjectLike(value) && !isArray$1(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty$3.call(value, "__wrapped__")) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
function isLaziable(func) {
  var funcName = getFuncName(func), other = lodash[funcName];
  if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData$1(other);
  return !!data && func === data[0];
}
var HOT_COUNT = 800, HOT_SPAN = 16;
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
var setData = shortOut(baseSetData$1);
const setData$1 = setData;
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}
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
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
const defineProperty$1 = defineProperty;
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
  return defineProperty$1(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
const baseSetToString$1 = baseSetToString;
var setToString = shortOut(baseSetToString$1);
const setToString$1 = setToString;
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
function baseIsNaN(value) {
  return value !== value;
}
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
var WRAP_BIND_FLAG$6 = 1, WRAP_BIND_KEY_FLAG$4 = 2, WRAP_CURRY_FLAG$4 = 8, WRAP_CURRY_RIGHT_FLAG$2 = 16, WRAP_PARTIAL_FLAG$3 = 32, WRAP_PARTIAL_RIGHT_FLAG$2 = 64, WRAP_ARY_FLAG$2 = 128, WRAP_REARG_FLAG$1 = 256, WRAP_FLIP_FLAG$1 = 512;
var wrapFlags = [
  ["ary", WRAP_ARY_FLAG$2],
  ["bind", WRAP_BIND_FLAG$6],
  ["bindKey", WRAP_BIND_KEY_FLAG$4],
  ["curry", WRAP_CURRY_FLAG$4],
  ["curryRight", WRAP_CURRY_RIGHT_FLAG$2],
  ["flip", WRAP_FLIP_FLAG$1],
  ["partial", WRAP_PARTIAL_FLAG$3],
  ["partialRight", WRAP_PARTIAL_RIGHT_FLAG$2],
  ["rearg", WRAP_REARG_FLAG$1]
];
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = "_." + pair[0];
    if (bitmask & pair[1] && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}
function setWrapToString(wrapper, reference, bitmask) {
  var source = reference + "";
  return setToString$1(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}
var WRAP_BIND_FLAG$5 = 1, WRAP_BIND_KEY_FLAG$3 = 2, WRAP_CURRY_BOUND_FLAG$1 = 4, WRAP_CURRY_FLAG$3 = 8, WRAP_PARTIAL_FLAG$2 = 32, WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG$3, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
  bitmask |= isCurry ? WRAP_PARTIAL_FLAG$2 : WRAP_PARTIAL_RIGHT_FLAG$1;
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$2);
  if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) {
    bitmask &= ~(WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3);
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
  if (isLaziable(func)) {
    setData$1(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}
function getHolder(func) {
  var object = func;
  return object.placeholder;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var nativeMin$1 = Math.min;
function reorder(array, indexes) {
  var arrLength = array.length, length = nativeMin$1(indexes.length, arrLength), oldArray = copyArray(array);
  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
  }
  return array;
}
var PLACEHOLDER$1 = "__lodash_placeholder__";
function replaceHolders(array, placeholder) {
  var index = -1, length = array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER$1) {
      array[index] = PLACEHOLDER$1;
      result[resIndex++] = index;
    }
  }
  return result;
}
var WRAP_BIND_FLAG$4 = 1, WRAP_BIND_KEY_FLAG$2 = 2, WRAP_CURRY_FLAG$2 = 8, WRAP_CURRY_RIGHT_FLAG$1 = 16, WRAP_ARY_FLAG$1 = 128, WRAP_FLIP_FLAG = 512;
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG$1, isBind = bitmask & WRAP_BIND_FLAG$4, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2, isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? void 0 : createCtor(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length;
    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
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
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root$1 && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
    while (index--) {
      args[index] = arguments[index];
    }
    var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func,
        bitmask,
        createHybrid,
        wrapper.placeholder,
        void 0,
        args,
        holders,
        void 0,
        void 0,
        arity - length
      );
    }
    var fn = this && this !== root$1 && this instanceof wrapper ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}
var WRAP_BIND_FLAG$3 = 1;
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG$3, Ctor = createCtor(func);
  function wrapper() {
    var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root$1 && this instanceof wrapper ? Ctor : func;
    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}
var PLACEHOLDER = "__lodash_placeholder__";
var WRAP_BIND_FLAG$2 = 1, WRAP_BIND_KEY_FLAG$1 = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG$1 = 8, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256;
var nativeMin = Math.min;
function mergeData(data, source) {
  var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1 | WRAP_ARY_FLAG);
  var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG$1 || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$1;
  if (!(isCommon || isCombo)) {
    return data;
  }
  if (srcBitmask & WRAP_BIND_FLAG$2) {
    data[2] = source[2];
    newBitmask |= bitmask & WRAP_BIND_FLAG$2 ? 0 : WRAP_CURRY_BOUND_FLAG;
  }
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  value = source[7];
  if (value) {
    data[7] = value;
  }
  if (srcBitmask & WRAP_ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  if (data[9] == null) {
    data[9] = source[9];
  }
  data[0] = source[0];
  data[1] = newBitmask;
  return data;
}
var FUNC_ERROR_TEXT = "Expected a function";
var WRAP_BIND_FLAG$1 = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG$1 = 32, WRAP_PARTIAL_RIGHT_FLAG = 64;
var nativeMax$1 = Math.max;
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
  if (!isBindKey && typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG$1 | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = void 0;
  }
  ary = ary === void 0 ? ary : nativeMax$1(toInteger(ary), 0);
  arity = arity === void 0 ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;
  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials, holdersRight = holders;
    partials = holders = void 0;
  }
  var data = isBindKey ? void 0 : getData$1(func);
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
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax$1(newData[9] - length, 0);
  if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG$1) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG$1 || bitmask == (WRAP_BIND_FLAG$1 | WRAP_PARTIAL_FLAG$1)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(void 0, newData);
  }
  var setter = data ? baseSetData$1 : setData$1;
  return setWrapToString(setter(result, newData), func, bitmask);
}
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start) {
  return setToString$1(overRest(func, start, identity), func + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var objectProto$3 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$3;
  return value === proto;
}
var argsTag$1 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
var isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
const isArguments$1 = isArguments;
function stubFalse() {
  return false;
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var Buffer2 = moduleExports$1 ? root$1.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
const isBuffer$1 = isBuffer;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$2 = "[object Map]", numberTag = "[object Number]", objectTag$1 = "[object Object]", regexpTag = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag] = typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal$1.process;
var nodeUtil = function() {
  try {
    var types = freeModule && freeModule.require && freeModule.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
const nodeUtil$1 = nodeUtil;
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
const isTypedArray$1 = isTypedArray;
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
const nativeKeys$1 = nativeKeys;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$1.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var Map$1 = getNative(root$1, "Map");
const Map$2 = Map$1;
var WRAP_BIND_FLAG = 1, WRAP_PARTIAL_FLAG = 32;
var bind = baseRest(function(func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bind));
    bitmask |= WRAP_PARTIAL_FLAG;
  }
  return createWrap(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
const bind$1 = bind;
var DataView = getNative(root$1, "DataView");
const DataView$1 = DataView;
var Promise$1 = getNative(root$1, "Promise");
const Promise$2 = Promise$1;
var Set = getNative(root$1, "Set");
const Set$1 = Set;
var mapTag$1 = "[object Map]", objectTag = "[object Object]", promiseTag = "[object Promise]", setTag$1 = "[object Set]", weakMapTag = "[object WeakMap]";
var dataViewTag = "[object DataView]";
var dataViewCtorString = toSource(DataView$1), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
var getTag = baseGetTag;
if (DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag || Map$2 && getTag(new Map$2()) != mapTag$1 || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag) {
  getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag$1;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$1;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}
const getTag$1 = getTag;
var stringTag = "[object String]";
function isString(value) {
  return typeof value == "string" || !isArray$1(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}
var mapTag = "[object Map]", setTag = "[object Set]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray$1(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer$1(value) || isTypedArray$1(value) || isArguments$1(value))) {
    return !value.length;
  }
  var tag = getTag$1(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
function isUndefined(value) {
  return value === void 0;
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = {
  randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
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
class WebContentPool {
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
    if (!isString(_idOrName)) {
      _idOrName = this.webContentIdMap.get(_idOrName) || "";
    }
    return this.pool.get(_idOrName);
  }
  getAll() {
    return [...this.pool.values()];
  }
  remove(idOrName) {
    let _idOrName = idOrName;
    if (!isString(_idOrName)) {
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
}
const webContentPool = new WebContentPool();
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["SUCCESS"] = 200] = "SUCCESS";
  ErrorCode2[ErrorCode2["NOT_FOUND"] = 404] = "NOT_FOUND";
  ErrorCode2[ErrorCode2["EXECUTION_EXCEPTION"] = 500] = "EXECUTION_EXCEPTION";
  ErrorCode2[ErrorCode2["OVERTIME"] = 408] = "OVERTIME";
  return ErrorCode2;
})(ErrorCode || {});
const EVENT_CENTER$1 = "__ELECTRON_EVENTS_CENTER__";
const MAIN_EVENT_NAME = "main";
const ANY_WINDOW_SYMBOL = "*";
const SELF_NAME = "__ELECTRON_EVENTS_SELF__";
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["NORMAL"] = "NORMAL";
  EventType2["RESPONSIVE"] = "RESPONSIVE";
  return EventType2;
})(EventType || {});
class IpcBaseEvent {
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
    if (isFunction(_eventName)) {
      _listener = _eventName;
      _eventName = _webContentName;
    }
    if (isUndefined(_eventName)) {
      _eventName = _webContentName;
      _webContentName = "";
    }
    if (!isArray$1(_webContentName)) {
      _webContentName = [_webContentName];
    }
    if (!isArray$1(_eventName)) {
      _eventName = [_eventName];
    }
    if (isEmpty(_webContentName)) {
      _webContentName = [""];
    }
    return {
      webContentNames: _webContentName,
      eventNames: _eventName,
      callback: _listener || noop
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
    if (!isArray$1(_eventNames)) {
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
    const isMultipleEvents = isArray$1(eventName);
    if (!isArray$1(_eventNames)) {
      _eventNames = [_eventNames];
    }
    const resArr = _eventNames.map(async (eventName2) => {
      const handler = this.responsiveEventMap.get(eventName2);
      if (!isFunction(handler)) {
        return Promise.reject({
          code: ErrorCode.NOT_FOUND,
          message: new Error(
            `Error occurred in handler for '${eventName2}': No handler registered for '${eventName2}'`
          )
        });
      }
      try {
        return await handler(...args);
      } catch (error) {
        return {
          code: ErrorCode.EXECUTION_EXCEPTION,
          message: new Error(`Error occurred in handler for '${eventName2}': Execution exception'`),
          payload: error
        };
      }
    });
    return isMultipleEvents ? Promise.all(resArr) : resArr[0];
  }
}
const EVENT_CENTER = "__ELECTRON_EVENTS_CENTER__";
class MainIpcEvent extends IpcBaseEvent {
  constructor() {
    super();
    electron.ipcMain.handle(EVENT_CENTER, (event, params) => {
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
      const isSingleToName = isString(toNames);
      const isSingleEventName = isString(eventName);
      if (!isArray$1(toNames)) {
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
        if (!isArray$1(eventNames)) {
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
      toWebContent.send(EVENT_CENTER, {
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
        if (!isArray$1(eventNames)) {
          eventNames = [eventNames];
        }
        const resFromName = fromName === toName ? SELF_NAME : fromName;
        const resInArr = eventNames.map((eventName) => {
          const resEventName = this._getEventName(resFromName, eventName);
          const anyEventName = this._getEventName("*", eventName);
          const handler = this.responsiveEventMap.get(resEventName) || this.responsiveEventMap.get(anyEventName);
          if (!isFunction(handler)) {
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
    const handlerName = v4();
    const eventPromise = new Promise((resolve, reject) => {
      const tid = setTimeout(() => {
        reject({
          code: ErrorCode.OVERTIME,
          message: new Error(`Listen to the response of window ${toName} timeout`)
        });
      }, timeout);
      electron.ipcMain.handleOnce(handlerName, (_, params2) => {
        const { code, message, payload: data } = params2;
        clearTimeout(tid);
        if (code === ErrorCode.SUCCESS) {
          resolve(data);
        } else {
          reject(message);
        }
      });
    });
    toWebContent.send(EVENT_CENTER, {
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
    if (!isArray$1(_webContentNames)) {
      _webContentNames = [_webContentNames];
    }
    for (const webContentName2 of _webContentNames) {
      const toWebContent = webContentPool.get(webContentName2);
      if (!toWebContent) {
        return;
      }
      toWebContent.send(EVENT_CENTER, {
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
    const isSingleToName = isString(_webContentNames);
    const isSingleEventName = isString(eventName);
    if (!isArray$1(_webContentNames)) {
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
}
class RendererIpcEvent extends IpcBaseEvent {
  constructor() {
    super();
    electron.ipcRenderer.on(EVENT_CENTER$1, (_, params) => {
      let {
        type = EventType.NORMAL,
        handlerName,
        fromName,
        eventName: eventNames,
        payload
      } = params;
      if (!isArray$1(eventNames)) {
        eventNames = [eventNames];
      }
      if (type === EventType.NORMAL) {
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
        if (!isFunction(handler)) {
          return Promise.reject({
            code: ErrorCode.NOT_FOUND,
            message: `Error occurred in handler for '${eventName}': No handler registered for '${eventName}'`
          });
        }
        try {
          return await handler(...payload);
        } catch (error) {
          return {
            code: ErrorCode.EXECUTION_EXCEPTION,
            message: new Error(
              `Error occurred in handler for '${eventName}': Execution exception'`
            )
          };
        }
      });
      Promise.all(resArr).then((res) => {
        electron.ipcRenderer.invoke(handlerName, {
          code: ErrorCode.SUCCESS,
          message: "",
          payload: res
        });
      }).catch((error) => {
        electron.ipcRenderer.invoke(handlerName, error);
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
    electron.ipcRenderer.invoke(EVENT_CENTER$1, {
      type: EventType.NORMAL,
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
    return electron.ipcRenderer.invoke(EVENT_CENTER$1, {
      type: EventType.RESPONSIVE,
      toName: webContentName,
      eventName,
      payload: args
    });
  }
}
let mainEvents = null;
let rendererEvents = null;
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
      rendererEvents[methodName] = bind$1(rendererEvents[methodName], rendererEvents);
    }
  }
  return rendererEvents;
}
const CUSTOM_CHANNEL = "CUSTOM_CHANNEL";
const events = useEvents();
electron.contextBridge.exposeInMainWorld("electronAPI", {
  events,
  createBrowserWindowOrView(windowInfo) {
    return electron.ipcRenderer.invoke(CUSTOM_CHANNEL, windowInfo);
  }
});
