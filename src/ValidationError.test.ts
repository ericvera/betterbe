import { describe, expect, it } from 'vitest'
import { number, object, record, string, ValidationError } from './index.js'

const catchError = (fn: () => unknown): ValidationError => {
  try {
    fn()
  } catch (error) {
    return error as ValidationError
  }
  expect.fail('Should have thrown')
}

describe('ValidationError reason', () => {
  it('strips a top-level value path from reason', () => {
    const validator = object({
      phone: string({
        test: (_v, report) => report({ message: 'invalid phone number' }),
      }),
    })

    const error = catchError(() => {
      validator.validate({ phone: 'x' })
    })

    expect(error.message).toBe('phone: invalid phone number')
    expect(error.reason).toBe('invalid phone number')
  })

  it('strips a nested path from reason', () => {
    const validator = object({
      a: object({
        b: string({
          test: (_v, report) => report({ message: 'is not allowed' }),
        }),
      }),
    })

    const error = catchError(() => {
      validator.validate({ a: { b: 'x' } })
    })

    expect(error.message).toBe('a.b: is not allowed')
    expect(error.reason).toBe('is not allowed')
  })

  it('strips the key prefix from reason for record key failures', () => {
    const validator = object({
      m: record(
        string({ test: (_v, report) => report({ message: 'bad key' }) }),
        number(),
      ),
    })

    const error = catchError(() => {
      validator.validate({ m: { k: 1 } })
    })

    expect(error.message).toBe('key m.k: bad key')
    expect(error.reason).toBe('bad key')
    expect(error.context).toBe('key')
  })

  it('equals message for root-level test failures', () => {
    const validator = string({
      test: (_v, report) => report({ message: 'is not allowed' }),
    })

    const error = catchError(() => {
      validator.validate('x')
    })

    expect(error.message).toBe('is not allowed')
    expect(error.reason).toBe('is not allowed')
  })

  it('strips the path from reason for built-in constraints', () => {
    const validator = object({ name: string({ minLength: 3 }) })

    const error = catchError(() => {
      validator.validate({ name: 'ab' })
    })

    expect(error.code).toBe('minLength')
    expect(error.message).toBe('name: is shorter than expected length 3')
    expect(error.reason).toBe('is shorter than expected length 3')
  })

  it('equals message for root-level built-in constraints', () => {
    const error = catchError(() => {
      string({ minLength: 3 }).validate('ab')
    })

    expect(error.message).toBe('is shorter than expected length 3')
    expect(error.reason).toBe('is shorter than expected length 3')
  })

  it('includes reason in toJSON()', () => {
    const validator = object({ name: string({ minLength: 3 }) })

    const error = catchError(() => {
      validator.validate({ name: 'ab' })
    })

    expect(error.toJSON()['reason']).toBe(error.reason)
  })
})
