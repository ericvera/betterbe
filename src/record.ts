import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  RecordValidator,
  TestFunction,
  ValidatorType,
  Value,
  type ValidationFunction,
} from './types.js'

export interface RecordOptions<TRecord> {
  /**
   * Expects a function that receives the record value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<TRecord>

  /**
   * Default is true
   */
  required?: boolean
}

/**
 * Returns a validation function that checks if a value is an object and
 * validates all keys and values against their respective validators.
 *
 * This is useful for validating objects where all keys must conform to a
 * specific pattern and all values must be of the same type, rather than
 * having a fixed schema with predefined property names.
 *
 * @param keyValidator A validator function for all object keys.
 * @param valueValidator A validator function for all object values.
 * @param options An object containing the following properties:
 * - `test` (optional): A custom validation function for the entire record.
 * - `required` (optional): Whether the value is required (default is `true`).
 */
export const record = <TKey extends string | number | symbol, TValue>(
  keyValidator: Value<TKey>,
  valueValidator: Value<TValue>,
  options: RecordOptions<Record<TKey, TValue>> = {},
): RecordValidator => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
    context?: 'key' | 'value',
  ): void => {
    const effectiveContext = context ?? 'value'
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const object = validateType<Record<TKey, TValue>>(
      'object',
      value,
      path,
      key,
      effectiveContext,
    )

    const { required } = options

    if (object === undefined) {
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

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (object === null) {
      throw new ValidationError({
        message: 'is not object',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'type', expected: 'object' },
      })
    }

    for (const objectKey in object) {
      const objectValue = object[objectKey]

      keyValidator.validate(objectKey, newPath, objectKey, 'key')
      valueValidator.validate(objectValue, newPath, objectKey, 'value')
    }

    const report = (opts: { message: string }): never => {
      throw new ValidationError({
        message: opts.message,
        path: path ?? [],
        key,
        context: effectiveContext,
        value: object,
        constraint: { code: 'test' },
      })
    }

    options.test?.(object, report, path ?? [], key)
  }

  return { validate, type: ValidatorType.RECORD }
}
