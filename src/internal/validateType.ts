import { ValidationError } from './ValidationError.js'

export const validateType = <T>(
  type: string,
  value: unknown,
  path?: string[],
  key?: string,
): T | undefined => {
  if (typeof value !== type && typeof value !== 'undefined') {
    throw new ValidationError(`is not a ${type}`, path, key)
  }

  return value as T
}
