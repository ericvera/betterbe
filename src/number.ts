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
 * - `integer` (optional): Whether the value must be an integer.
 * - `required` (optional): Whether the value is required (default is `true`).
 */
export const number = (options: NumberOptions = {}): NumberValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
    context?: 'key' | 'value',
  ): void => {
    const effectiveContext = context ?? 'value'
    const numberValue = validateType<number>(
      'number',
      value,
      path,
      key,
      effectiveContext,
    )

    if (Number.isNaN(numberValue)) {
      throw new ValidationError({
        message: 'is not a number',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'type', expected: 'number' },
      })
    }

    const { min, max, integer, required } = options

    if (numberValue === undefined) {
      if (required !== false) {
        throw new ValidationError({
          message: 'is required',
          path: path ?? [],
          key,
          context: effectiveContext,
          value,
          constraint: { code: 'required' },
        })
      }

      return
    }

    if (min !== undefined && numberValue < min) {
      throw new ValidationError({
        message: `is less than minimum ${min.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'min', min },
      })
    }

    if (max !== undefined && numberValue > max) {
      throw new ValidationError({
        message: `is greater than maximum ${max.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'max', max },
      })
    }

    if (integer === true && !Number.isInteger(value)) {
      throw new ValidationError({
        message: 'is not an integer',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'int' },
      })
    }
  }

  return { validate, type: ValidatorType.NUMBER }
}
