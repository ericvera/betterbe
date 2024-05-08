export type ValidationFunction<T> = (
  value: T,
  path?: string[],
  key?: string,
) => void

export type Schema = Record<string, ValidationFunction<unknown>>
