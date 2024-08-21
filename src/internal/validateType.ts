import { ValidationError } from '../ValidationError.js'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- This is necessary to ensure that the return type is correct
export const validateType = <T>(
  type: 'boolean' | 'number' | 'string' | 'object',
  value: unknown,
  path?: string[],
  key?: string,
): T | undefined => {
  if (typeof value !== type && typeof value !== 'undefined') {
    throw new ValidationError('type', `is not a ${type}`, path, key, { type })
  }

  return value as T
}
