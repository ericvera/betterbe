import { ValidationError } from '../ValidationError.js'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T is used for type casting
export const validateType = <T>(
  type: 'boolean' | 'number' | 'string' | 'object' | 'array',
  value: unknown,
  path?: string[],
  key?: string,
): T | undefined => {
  const calculatedType = Array.isArray(value) ? 'array' : typeof value

  if (calculatedType !== type && calculatedType !== 'undefined') {
    throw new ValidationError('type', `is not ${type}`, path, key, {
      type: calculatedType,
    })
  }

  return value as T
}
