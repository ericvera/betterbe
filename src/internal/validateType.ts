import { ValidationError } from '../ValidationError.js'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const validateType = <T>(
  type: 'boolean' | 'number' | 'string' | 'object' | 'array',
  value: unknown,
  path?: string[],
  key?: string,
  context?: 'key' | 'value',
): T | undefined => {
  const calculatedType = Array.isArray(value) ? 'array' : typeof value

  if (calculatedType !== type && calculatedType !== 'undefined') {
    throw new ValidationError({
      message: `is not ${type}`,
      path: path ?? [],
      key,
      context: context ?? 'value',
      value,
      constraint: { code: 'type', expected: calculatedType },
    })
  }

  return value as T
}
