import { ValidationError } from './internal/ValidationError'
import { getRequiredProp } from './internal/getRequiredProp'
import type { Schema, ValidationFunction } from './types'

export const object =
  (schema: Schema): ValidationFunction =>
  (value: unknown, path?: string[], key?: string) => {
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    if (typeof value !== 'object' || value === null) {
      throw new ValidationError('is not an object', path, key)
    }

    const schemaKeys = Object.keys(schema)
    const valueKeys = Object.keys(value)

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
    const getValueProp = getRequiredProp(value as Record<string, unknown>)

    // Run through all the validation functions
    for (const schemaKey of schemaKeys) {
      const validationFunction = getSchemaProp(schemaKey)
      const valueToValidate = getValueProp(schemaKey)

      validationFunction(valueToValidate, newPath, schemaKey)
    }

    return
  }
