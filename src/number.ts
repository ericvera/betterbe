import { ValidationError } from './internal/ValidationError'
import { validateType } from './internal/validateType'
import { NumberValidator, ValidationFunction, ValidatorType } from './types'

export interface NumberOptions {
  min?: number
  max?: number
  integer?: boolean
  /**
   * Default is true
   */
  required?: boolean
}

/**
 * Returns a validation function that checks if a value is a number and
 * optionally validates its minimum, maximum, and integer properties.
 *
 * @param options An object containing the following properties:
 * - `min` (optional): The minimum value of the number.
 * - `max` (optional): The maximum value of the number.
 * - `integer` (optional): Whether the number must be an integer.
 * - `required` (optional): Whether the value is required (default is `true`).
 */
export const number = (options: NumberOptions = {}): NumberValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
  ): void => {
    // Validate type
    const num = validateType<number>('number', value, path, key)

    const { min, max, integer, required } = options

    // Validate required
    if (num === undefined) {
      if (required !== false) {
        throw new ValidationError('is required', path, key)
      }

      return
    }

    // Validate min
    if (min !== undefined && num < min) {
      throw new ValidationError(
        `is less than minimum ${min.toString()}`,
        path,
        key,
      )
    }

    // Validate max
    if (max !== undefined && num > max) {
      throw new ValidationError(
        `is greater than maximum ${max.toString()}`,
        path,
        key,
      )
    }

    // Validate integer
    if (integer === true && !Number.isInteger(value)) {
      throw new ValidationError('is not an integer', path, key)
    }
  }

  return { validate, type: ValidatorType.NUMBER }
}
