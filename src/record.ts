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
  ): void => {
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const obj = validateType<Record<TKey, TValue>>('object', value, path, key)

    const { required } = options

    // Validate required
    if (obj === undefined) {
      if (required !== false) {
        throw new ValidationError('required', 'is required', newPath, key)
      }

      return
    }

    // Handle null (typeof null === 'object' but Object.keys(null) throws)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (obj === null) {
      throw new ValidationError('type', 'is not object', newPath, key)
    }

    // Validate each key-value pair
    for (const objKey in obj) {
      const objValue = obj[objKey]

      // Validate the key with enhanced error messaging
      try {
        keyValidator.validate(objKey, newPath, objKey)
      } catch (e) {
        if (e instanceof ValidationError) {
          // Extract the base message by removing the key prefix and path suffix
          let baseMessage = e.message

          // Remove key prefix if present
          const keyPrefix = `'${objKey}' `

          if (baseMessage.startsWith(keyPrefix)) {
            baseMessage = baseMessage.substring(keyPrefix.length)
          }

          // Remove path suffix if present
          const pathPattern = / at path '.+'$/

          baseMessage = baseMessage.replace(pathPattern, '')

          // Create new error with "key" prefix in the base message and key context metadata
          const keySpecificMessage = `key ${keyPrefix}${baseMessage}`

          throw new ValidationError(
            e.type,
            keySpecificMessage,
            newPath,
            undefined,
            {
              ...e.meta,
              context: 'key',
              originalKey: objKey,
            },
          )
        }

        throw e
      }

      // Validate the value
      valueValidator.validate(objValue, newPath, objKey)
    }

    try {
      options.test?.(obj, newPath, key)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'failed tests'

      throw new ValidationError('test', message, newPath, key)
    }
  }

  return { validate, type: ValidatorType.RECORD }
}
