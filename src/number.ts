import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import { NumberValidator, ValidationFunction, ValidatorType } from './types.js'

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
 * Note: This validator automatically rejects NaN values and will throw
 * a ValidationError with type 'type' and message 'is not a number'.
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

    // Validate NaN
    if (Number.isNaN(num)) {
      throw new ValidationError('type', 'is not a number', path, key, {
        type: 'NaN',
        context: 'value',
      })
    }

    const { min, max, integer, required } = options

    // Validate required
    if (num === undefined) {
      if (required !== false) {
        throw new ValidationError('required', 'is required', path, key)
      }

      return
    }

    // Validate min
    if (min !== undefined && num < min) {
      throw new ValidationError(
        'min',
        `is less than minimum ${min.toString()}`,
        path,
        key,
        { min, context: 'value' },
      )
    }

    // Validate max
    if (max !== undefined && num > max) {
      throw new ValidationError(
        'max',
        `is greater than maximum ${max.toString()}`,
        path,
        key,
        { max, context: 'value' },
      )
    }

    // Validate integer
    if (integer === true && !Number.isInteger(value)) {
      throw new ValidationError('int', 'is not an integer', path, key, {
        context: 'value',
      })
    }
  }

  return { validate, type: ValidatorType.NUMBER }
}
