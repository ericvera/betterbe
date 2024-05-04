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
  (schema: Schema): ValidationFunction =>
  (value: unknown, path?: string[], key?: string): void => {
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

    // Check only keys defined in schema are present in value
    for (const schemaKey of schemaKeys) {
      if (!valueKeys.includes(schemaKey)) {
        throw new ValidationError('is required', newPath, schemaKey)
      }
    }

    for (const valueKey of valueKeys) {
      if (!schemaKeys.includes(valueKey)) {
        throw new ValidationError('is not allowed', newPath, valueKey)
      }
    }

    const getSchemaProp = getRequiredProp(schema)
    const getValueProp = getRequiredProp(val)

    // Run through all the validation functions
    for (const schemaKey of schemaKeys) {
      const validationFunction = getSchemaProp(schemaKey)
      const valueToValidate = getValueProp(schemaKey)

      validationFunction(valueToValidate, newPath, schemaKey)
    }

    return
  }
