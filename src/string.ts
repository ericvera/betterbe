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
    context?: 'key' | 'value',
  ): void => {
    const effectiveContext = context ?? 'value'
    const stringValue = validateType<string>(
      'string',
      value,
      path,
      key,
      effectiveContext,
    )

    const { maxLength, minLength, required, pattern, alphabet, oneOf } = options

    if (stringValue === undefined || stringValue === '') {
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

    if (minLength !== undefined && stringValue.length < minLength) {
      throw new ValidationError({
        message: `is shorter than expected length ${minLength.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'minLength', minLength },
      })
    }

    if (maxLength !== undefined && stringValue.length > maxLength) {
      throw new ValidationError({
        message: `is longer than expected length ${maxLength.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'maxLength', maxLength },
      })
    }

    if (pattern !== undefined && !pattern.test(stringValue)) {
      throw new ValidationError({
        message: 'does not match pattern',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'pattern', pattern: pattern.toString() },
      })
    }

    if (alphabet !== undefined) {
      validateAlphabet(alphabet, stringValue, path, key, effectiveContext)
    }

    if (oneOf !== undefined && !oneOf.includes(stringValue)) {
      throw new ValidationError({
        message: 'is not one of the allowed values',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'one-of', oneOf },
      })
    }

    const report = (opts: { message: string }): never => {
      throw new ValidationError({
        message: opts.message,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'test' },
      })
    }

    options.test?.(stringValue, report, path, key)
  }

  return { validate, type: ValidatorType.STRING }
}
