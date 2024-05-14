import { ValidationError } from './internal/ValidationError'
import { validateType } from './internal/validateType'
import {
  ValidatorType,
  type BooleanValidator,
  type ValidationFunction,
} from './types'

export interface BooleanOptions {
  /**
   * Default is true
   */
  required?: boolean
}

/**
 * Returns a validation function that checks if a value is a boolean.
 *
 * @param options An object containing the following properties:
 * - `required` (optional): Whether the value is required (default is `true`).
 */
export const boolean = (options: BooleanOptions = {}): BooleanValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
  ): void => {
    // Validate type
    const b = validateType<boolean>('boolean', value, path, key)

    const { required } = options

    // Validate required
    if (b === undefined) {
      if (required !== false) {
        throw new ValidationError('is required', path, key)
      }

      return
    }
  }

  return { validate, type: ValidatorType.BOOLEAN }
}
