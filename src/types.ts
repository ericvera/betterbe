export type ValidationFunction = (
  value: unknown,
  path?: string[],
  key?: string,
) => void

export type Schema = Record<string, ValidationFunction>
