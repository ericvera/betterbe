import { ValidationError } from './ValidationError.js'
import { validateAlphabet } from './internal/validateAlphabet.js'
import { validateType } from './internal/validateType.js'
import {
  StringValidator,
  TestFunction,
  ValidationFunction,
  ValidatorType,
} from './types.js'

export interface StringOptionsBase {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  alphabet?: string
  /**
   * Default is true
   */
  required?: boolean
  /**
   * Expects a function that receives the string value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<string>

  oneOf?: never
}

export interface StringOptionsOneOf {
  oneOf: string[] | readonly string[]

  /**
   * Default is true
   */
  required?: boolean
  /**
   * Expects a function that receives the string value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<string>

  minLength?: never
  maxLength?: never
  pattern?: never
  alphabet?: never
}

export type StringOptions = StringOptionsBase | StringOptionsOneOf

/**
 * Returns a validation function that checks if a value is a string and
 * optionally validates its length, pattern, and alphabet.
 *
 * @param options An object containing the following properties:
 * - `minLength` (optional): The minimum length of the string.
 * - `maxLength` (optional): The maximum length of the string.
 * - `pattern` (optional): A regular expression that the string must match.
 * - `alphabet` (optional): A string containing the allowed characters.
 * - `required` (optional): Whether the value is required (default is `true`).
 */
export const string = (options: StringOptions = {}): StringValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
  ): void => {
    // Validate type
    const str = validateType<string>('string', value, path, key)

    const { maxLength, minLength, required, pattern, alphabet, oneOf } = options

    // Validate required
    if (str === undefined || str === '') {
      if (required !== false) {
        throw new ValidationError('required', 'is required', path, key)
      }

      return
    }

    // Validate length
    if (minLength !== undefined && str.length < minLength) {
      throw new ValidationError(
        'minLength',
        `is shorter than expected length ${minLength.toString()}`,
        path,
        key,
        { minLength, context: 'value' },
      )
    }

    if (maxLength !== undefined && str.length > maxLength) {
      throw new ValidationError(
        'maxLength',
        `is longer than expected length ${maxLength.toString()}`,
        path,
        key,
        { maxLength, context: 'value' },
      )
    }

    // Validate pattern
    if (pattern && !pattern.test(str)) {
      throw new ValidationError(
        'pattern',
        'does not match pattern',
        path,
        key,
        { pattern, context: 'value' },
      )
    }

    // Validate alphabet
    if (alphabet !== undefined) {
      validateAlphabet(alphabet, str, path, key)
    }

    // Validate oneOf
    if (oneOf !== undefined && !oneOf.includes(str)) {
      throw new ValidationError(
        'one-of',
        'is not one of the allowed values',
        path,
        key,
        { oneOf, context: 'value' },
      )
    }

    // Run test function
    try {
      options.test?.(str, path, key)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'failed tests'

      throw new ValidationError('test', message, path, key, {
        context: 'value',
      })
    }
  }

  return { validate, type: ValidatorType.STRING }
}
