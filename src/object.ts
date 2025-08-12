import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  GetPropValidatorFunction,
  Schema,
  TestFunction,
  ValidatorType,
  type ObjectValidator,
  type ValidationFunction,
} from './types.js'

export interface ObjectOptions<T> {
  /**
   * Expects a function that receives the object value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<T>

  /**
   * Default is true
   */
  required?: boolean
}

/**
 * Returns a validation function that checks if a value is an object and
 * validates its properties against a schema.
 *
 * @param schema An object containing the validation functions for each
 * property.
 */
export const object = <T extends object>(
  schema: Schema<T>,
  options: ObjectOptions<T> = {},
): ObjectValidator<T> => {
  const validate: ValidationFunction = (
    value: unknown,
    path?: string[],
    key?: string,
  ): void => {
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const obj = validateType<T>('object', value, path, key)

    const { required } = options

    // Validate required
    if (obj === undefined) {
      if (required !== false) {
        throw new ValidationError('required', 'is required', newPath, key)
      }

      return
    }

    const schemaKeys = Object.keys(schema)
    const valueKeys = Object.keys(obj)

    // Check if there are any keys that are not defined in the schema
    for (const valueKey of valueKeys) {
      if (!schemaKeys.includes(valueKey)) {
        throw new ValidationError(
          'unknown-keys',
          'is not allowed',
          newPath,
          valueKey,
        )
      }
    }

    // Run through all the validation functions
    for (const schemaKey in schema) {
      const schemaProp = schema[schemaKey]

      const valueToValidate = obj[schemaKey]

      try {
        schemaProp.validate(valueToValidate, newPath, schemaKey)
      } catch (e) {
        if (e instanceof ValidationError) {
          // Add propertyName metadata to all validation errors
          e.meta.propertyName = schemaKey

          if (!e.meta.context) {
            e.meta.context = 'value'
          }
        }
        throw e
      }
    }

    try {
      options.test?.(obj, newPath, key)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'failed tests'

      throw new ValidationError('test', message, newPath, key, {
        context: 'value',
      })
    }
  }

  const getProp: GetPropValidatorFunction<T> = (key: keyof T) => schema[key]

  return { validate, getProp, type: ValidatorType.OBJECT }
}
