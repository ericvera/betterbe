import { ValidationError } from './internal/ValidationError'
import { getRequiredProp } from './internal/getRequiredProp'
import { validateType } from './internal/validateType'
import type { Schema, ValidationFunction } from './types'

/**
 * Returns a validation function that checks if a value is an object and
 * validates its properties against a schema.
 *
 * @param schema An object containing the validation functions for each
 * property.
 */
export const object =
  <T = unknown>(schema: Schema): ValidationFunction<T> =>
  (value: T, path?: string[], key?: string): void => {
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const val = validateType<Record<string, unknown>>(
      'object',
      value,
      path,
      key,
    )

    if (val === undefined) {
      throw new ValidationError('is required', newPath, key)
    }

    const schemaKeys = Object.keys(schema)
    const valueKeys = Object.keys(val)

    // Check if there are any keys that are not defined in the schema
    for (const valueKey of valueKeys) {
      if (!schemaKeys.includes(valueKey)) {
        throw new ValidationError('is not allowed', newPath, valueKey)
      }
    }

    const getSchemaProp = getRequiredProp(schema)

    // Run through all the validation functions
    for (const schemaKey of schemaKeys) {
      const validationFunction = getSchemaProp(schemaKey)
      const valueToValidate = val[schemaKey]

      validationFunction(valueToValidate, newPath, schemaKey)
    }

    return
  }
