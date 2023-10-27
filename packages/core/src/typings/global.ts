export type AnyFunction = (...args: any[]) => any

export type ISingleOrMultiple<T> = T | T[]

export type IStringOrStrings = ISingleOrMultiple<string>
