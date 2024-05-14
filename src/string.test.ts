import { expect, it } from 'vitest'
import { string } from './'

it('should be able to create a string with no options defined', () => {
  const validator = string()

  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()
})

it('should throw an error if the value is not a string', () => {
  const validator = string()

  expect(() => {
    validator.validate(42)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a string]`)
})

it('should throw an error if the value is undefined', () => {
  const validator = string()

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is an empty string', () => {
  const validator = string()

  expect(() => {
    validator.validate('')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is shorter than expected', () => {
  const validator = string({ minLength: 3 })

  expect(() => {
    validator.validate('hi')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is shorter than expected length 3]`,
  )
})

it('should throw an error if the value is longer than expected', () => {
  const validator = string({ maxLength: 3 })

  expect(() => {
    validator.validate('hello')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 3]`,
  )
})

it('should throw an error if the value does not match the pattern', () => {
  const validator = string({ pattern: /^[a-z]+$/ })

  expect(() => {
    validator.validate('123')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: does not match pattern]`)
})

it('should throw an error if the value does not match the alphabet', () => {
  const validator = string({ alphabet: 'abc' })

  expect(() => {
    validator.validate('def')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: contains character 'd' which is not in alphabet 'abc']`,
  )
})

it('should not throw an error if the value matches the alphabet', () => {
  const validator = string({ alphabet: 'abc' })

  expect(() => {
    validator.validate('bbbbbc')
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validator = string({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should not throw an error if the value is an empty string and not required', () => {
  const validator = string({ required: false })

  expect(() => {
    validator.validate('')
  }).not.toThrow()
})

it('should not throw an error if the value is a string and not required', () => {
  const validator = string({ required: false })

  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()
})

it('should throw an error if the value is shorter than expected and not required', () => {
  const validator = string({ minLength: 3, required: false })

  expect(() => {
    validator.validate('hi')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is shorter than expected length 3]`,
  )
})

it('should throw an error if the value is longer than expected and not required', () => {
  const validator = string({ maxLength: 3, required: false })

  expect(() => {
    validator.validate('hello')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 3]`,
  )
})

it('should throw an error if the value does not match the pattern and not required', () => {
  const validator = string({ pattern: /^[a-z]+$/, required: false })

  expect(() => {
    validator.validate('123')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: does not match pattern]`)
})

it('should throw an error if the value does not match the alphabet and not required', () => {
  const validator = string({ alphabet: 'abc', required: false })

  expect(() => {
    validator.validate('abdc')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: contains character 'd' which is not in alphabet 'abc']`,
  )
})

it('should not throw an error if the value matches the alphabet and not required', () => {
  const validator = string({ alphabet: 'abc', required: false })

  expect(() => {
    validator.validate('bbbbbc')
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validator = string({
    required: true,
    minLength: 3,
    maxLength: 5,
    pattern: /^a[a-z]+$/,
    alphabet: 'abc',
  })

  expect(() => {
    validator.validate('acc')
  }).not.toThrow()
})
