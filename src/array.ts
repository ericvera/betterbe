import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  ArrayValidator,
  TestFunction,
  ValidatorType,
  Value,
  type ValidationFunction,
} from './types.js'

export interface ArrayOptions<T> {
  minLength?: number
  maxLength?: number

  /**
   * Expects a function that receives the array value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<T[]>

  /**
   * Default is true
   */
  required?: boolean

  /**
   * When true, the array must contain only unique values (no duplicates).
   * Default is false.
   */
  unique?: boolean
}

/**
 * Returns a validation function that checks if a value is an array and
 * validates its items against a validator.
 *
 * @param itemValidator A validation functions for each the items of the array.
 */
export const array = <T>(
  itemValidator: Value<T>,
  options: ArrayOptions<T> = {},
): ArrayValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
  ): void => {
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const arr = validateType<T[]>('array', value, path, key)

    const { maxLength, minLength, required, unique } = options

    // Validate required
    if (arr === undefined) {
      if (required !== false) {
        throw new ValidationError('required', 'is required', newPath, key)
      }

      return
    }

    // Validate length
    if (minLength !== undefined && arr.length < minLength) {
      throw new ValidationError(
        'minLength',
        `is shorter than expected length ${minLength.toString()}`,
        path,
        key,
        { minLength },
      )
    }

    if (maxLength !== undefined && arr.length > maxLength) {
      throw new ValidationError(
        'maxLength',
        `is longer than expected length ${maxLength.toString()}`,
        path,
        key,
        { maxLength },
      )
    }

    // Validate uniqueness
    if (unique === true && arr.length > 0) {
      const seen = new Set()

      for (let i = 0; i < arr.length; i++) {
        const value = arr[i]
        // For objects and arrays, we can't reliably check uniqueness with Set
        // So we stringify them first
        const valueKey =
          typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : value

        if (seen.has(valueKey)) {
          throw new ValidationError(
            'unique',
            'contains duplicate values',
            newPath,
            key,
          )
        }
        seen.add(valueKey)
      }
    }

    // Run through all the validation functions
    for (let i = 0; i < arr.length; i++) {
      itemValidator.validate(arr[i], newPath, `[${i.toString()}]`)
    }

    try {
      options.test?.(arr, newPath, key)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'failed tests'

      throw new ValidationError('test', message, newPath, key)
    }
  }

  return { validate, type: ValidatorType.ARRAY }
}
