import { expect, it } from 'vitest'
import { number, ValidationError } from './index.js'

it('should be able to create a number with no options defined', () => {
  const validator = number()

  expect(() => {
    validator.validate(42)
  }).not.toThrow()
})

it('should throw an error if the value is not a number', () => {
  const validator = number()

  expect(() => {
    validator.validate('42')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not number]`)
})

it('should throw an error if the value is NaN', () => {
  const validator = number()

  expect(() => {
    validator.validate(Number.NaN)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a number]`)
})

it('should throw an error if the value is NaN with options', () => {
  const validator = number({ min: 0, max: 100 })

  expect(() => {
    validator.validate(Number.NaN)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a number]`)
})

it('should throw an error if the value is undefined', () => {
  const validator = number()

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is less than the minimum', () => {
  const validator = number({ min: 3 })

  expect(() => {
    validator.validate(2)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is less than minimum 3]`)
})

it('should throw an error if the value is greater than the maximum', () => {
  const validator = number({ max: 3 })

  expect(() => {
    validator.validate(4)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is greater than maximum 3]`)
})

it('should throw an error if the value is not an integer', () => {
  const validator = number({ integer: true })

  expect(() => {
    validator.validate(3.14)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not an integer]`)
})

it('should not throw an error if the value is an integer', () => {
  const validator = number({ integer: true })

  expect(() => {
    validator.validate(3)
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validator = number({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and required', () => {
  const validator = number({ required: true })

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should not throw an error if the value is a number and not required', () => {
  const validator = number({ required: false })

  expect(() => {
    validator.validate(42)
  }).not.toThrow()
})

it('should not throw with all the options and a valid value', () => {
  const validator = number({
    min: 3,
    max: 10000000000,
    integer: true,
    required: true,
  })

  expect(() => {
    validator.validate(10000000000)
  }).not.toThrow()
})

it('should throw no a negative number when min is 0', () => {
  const validator = number({ min: 0 })

  expect(() => {
    validator.validate(-1)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is less than minimum 0]`)
})

it('should include context metadata for number validation errors', () => {
  const validator = number({ min: 10 })

  try {
    validator.validate(5)
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const validationError = error as ValidationError
    expect(validationError.type).toBe('min')
    expect(validationError.meta.context).toBe('value')
    expect(validationError.meta.min).toBe(10)
  }
})
