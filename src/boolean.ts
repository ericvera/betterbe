import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  ValidatorType,
  type BooleanValidator,
  type ValidationFunction,
} from './types.js'

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
    context?: 'key' | 'value',
  ): void => {
    const effectiveContext = context ?? 'value'
    const booleanValue = validateType<boolean>(
      'boolean',
      value,
      path,
      key,
      effectiveContext,
    )

    const { required } = options

    if (booleanValue === undefined) {
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
    }
  }

  return { validate, type: ValidatorType.BOOLEAN }
}
