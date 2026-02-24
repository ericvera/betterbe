import { ValidationError } from './ValidationError.js'
import { validateType } from './internal/validateType.js'
import {
  ArrayValidator,
  TestFunction,
  TestReportOptions,
  ValidatorType,
  Value,
  type ValidationFunction,
} from './types.js'

export interface ArrayOptions<T> {
  minLength?: number
  maxLength?: number

  /**
   * Expects a function that receives the array value and throws an Error if it
   * is invalid.
   */
  test?: TestFunction<T[]>

  /**
   * Default is true
   */
  required?: boolean

  /**
   * When true, the array must contain only unique values (no duplicates).
   * Default is false.
   */
  unique?: boolean
}

/**
 * Returns a validation function that checks if a value is an array and
 * validates its items against a validator.
 *
 * @param itemValidator A validation function for each item in the array.
 */
export const array = <T>(
  itemValidator: Value<T>,
  options: ArrayOptions<T> = {},
): ArrayValidator => {
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

    const array = validateType<T[]>('array', value, path, key, effectiveContext)

    const { maxLength, minLength, required, unique } = options

    if (array === undefined) {
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

    if (minLength !== undefined && array.length < minLength) {
      throw new ValidationError({
        message: `is shorter than expected length ${minLength.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'minLength', minLength },
      })
    }

    if (maxLength !== undefined && array.length > maxLength) {
      throw new ValidationError({
        message: `is longer than expected length ${maxLength.toString()}`,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint: { code: 'maxLength', maxLength },
      })
    }

    if (unique === true && array.length > 0) {
      const seen = new Set()

      for (let index = 0; index < array.length; index++) {
        const item = array[index]
        const valueKey =
          typeof item === 'object' && item !== null
            ? JSON.stringify(item)
            : item

        if (seen.has(valueKey)) {
          throw new ValidationError({
            message: 'contains duplicate values',
            path: newPath,
            key: `[${index.toString()}]`,
            context: effectiveContext,
            value: item,
            constraint: { code: 'unique' },
          })
        }
        seen.add(valueKey)
      }
    }

    for (let index = 0; index < array.length; index++) {
      itemValidator.validate(
        array[index],
        newPath,
        `[${index.toString()}]`,
        effectiveContext,
      )
    }

    const report = (opts: TestReportOptions): never => {
      throw new ValidationError({
        message: opts.message,
        path: path ?? [],
        key,
        context: effectiveContext,
        value,
        constraint:
          opts.data !== undefined
            ? { code: 'test', data: opts.data }
            : { code: 'test' },
      })
    }
    options.test?.(array, report, path ?? [], key)
  }

  return { validate, type: ValidatorType.ARRAY }
}
