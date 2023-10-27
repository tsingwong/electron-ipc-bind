type AnyFunction = (...args: any[]) => any

type ISingleOrMultiple<T> = T | T[]

type IStringOrStrings = ISingleOrMultiple<string>
