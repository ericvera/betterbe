import { ValidationError } from './internal/ValidationError'
import { validateAlphabet } from './internal/validateAlphabet'
import { validateType } from './internal/validateType'
import { ValidationFunction } from './types'

export interface StringOptions {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  alphabet?: string
  /**
   * Default is true
   */
  required?: boolean
}

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
export const string =
  <T = unknown>(options: StringOptions = {}): ValidationFunction<T> =>
  (value: T, path?: string[], key?: string): void => {
    // Validate type
    const str = validateType<string>('string', value, path, key)

    const { maxLength, minLength, required, pattern, alphabet } = options

    // Validate required
    if (str === undefined || str === '') {
      if (required !== false) {
        throw new ValidationError('is required', path, key)
      }

      return
    }

    // Validate length
    if (minLength !== undefined && str.length < minLength) {
      throw new ValidationError(
        `is shorter than expected length ${minLength.toString()}`,
        path,
        key,
      )
    }

    if (maxLength !== undefined && str.length > maxLength) {
      throw new ValidationError(
        `is longer than expected length ${maxLength.toString()}`,
        path,
        key,
      )
    }

    // Validate pattern
    if (pattern && !pattern.test(str)) {
      throw new ValidationError('does not match pattern', path, key)
    }

    // Validate alphabet
    if (alphabet !== undefined) {
      validateAlphabet(alphabet, str, path, key)
    }

    return
  }
