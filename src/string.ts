import { ValidationError } from './internal/ValidationError'
import { validateAlphabet } from './internal/validateAlphabet'

export interface StringOptions {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  alphabet?: string
  required?: boolean
}

export const string =
  ({ maxLength, minLength, required, pattern, alphabet }: StringOptions = {}) =>
  (value: unknown, path?: string[], key?: string) => {
    // Validate type
    if (typeof value !== 'string' && typeof value !== 'undefined') {
      throw new ValidationError('is not a string', path, key)
    }

    // Validate required
    if (value === undefined || value === '') {
      if (required !== false) {
        throw new ValidationError('is required', path, key)
      }

      return
    }

    // Validate length
    if (minLength !== undefined && value.length < minLength) {
      throw new ValidationError(
        `is shorter than expected length ${minLength.toString()}`,
        path,
        key,
      )
    }

    if (maxLength !== undefined && value.length > maxLength) {
      throw new ValidationError(
        `is longer than expected length ${maxLength.toString()}`,
        path,
        key,
      )
    }

    // Validate pattern
    if (pattern && !pattern.test(value)) {
      throw new ValidationError('does not match pattern', path, key)
    }

    // Validate alphabet
    if (alphabet !== undefined) {
      validateAlphabet(alphabet, value, path, key)
    }

    return
  }
