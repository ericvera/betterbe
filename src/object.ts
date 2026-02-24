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
    context?: 'key' | 'value',
  ): void => {
    const effectiveContext = context ?? 'value'
    const newPath = [...(path ?? [])]

    if (key !== undefined) {
      newPath.push(key)
    }

    const object = validateType<T>('object', value, path, key, effectiveContext)

    const { required } = options

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (object === null) {
      throw new ValidationError({
        message: 'is not object',
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'type', expected: 'object', actual: 'null' },
      })
    }

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

    const schemaKeys = Object.keys(schema)
    const valueKeys = Object.keys(object)

    for (const valueKey of valueKeys) {
      if (!schemaKeys.includes(valueKey)) {
        throw new ValidationError({
          message: 'is not allowed',
          path: newPath,
          key: valueKey,
          context: effectiveContext,
          value,
          constraint: { code: 'unknown-keys' },
        })
      }
    }

    for (const schemaKey in schema) {
      const schemaProperty = schema[schemaKey]
      const valueToValidate = object[schemaKey]

      schemaProperty.validate(
        valueToValidate,
        newPath,
        schemaKey,
        effectiveContext,
      )
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

  const getProp: GetPropValidatorFunction<T> = (key: keyof T) => schema[key]

  return { validate, getProp, type: ValidatorType.OBJECT }
}
