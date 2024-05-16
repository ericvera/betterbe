import { ValidationError } from './internal/ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  Schema,
  TestFunction,
  ValidatorType,
  type ObjectValidator,
  type ValidationFunction,
} from './types.js'

export interface ObjectOptions<T> {
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
): ObjectValidator => {
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
        throw new ValidationError('is required', newPath, key)
      }

      return
    }

    const schemaKeys = Object.keys(schema)
    const valueKeys = Object.keys(obj)

    // Check if there are any keys that are not defined in the schema
    for (const valueKey of valueKeys) {
      if (!schemaKeys.includes(valueKey)) {
        throw new ValidationError('is not allowed', newPath, valueKey)
      }
    }

    // Run through all the validation functions
    for (const schemaKey in schema) {
      const schemaProp = schema[schemaKey]

      const valueToValidate = obj[schemaKey]

      schemaProp.validate(valueToValidate, newPath, schemaKey)
    }

    options.test?.(obj, newPath, key)
  }

  return { validate, type: ValidatorType.OBJECT }
}
