import { expect, it } from 'vitest'
import { string } from './'

it('should be able to create a string with no options defined', () => {
  const validateString = string()

  expect(() => {
    validateString('John Doe')
  }).not.toThrow()
})

it('should throw an error if the value is not a string', () => {
  const validateString = string()

  expect(() => {
    validateString(42)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a string]`)
})

it('should throw an error if the value is undefined', () => {
  const validateString = string()

  expect(() => {
    validateString(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is an empty string', () => {
  const validateString = string()

  expect(() => {
    validateString('')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is shorter than expected', () => {
  const validateString = string({ minLength: 3 })

  expect(() => {
    validateString('hi')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is shorter than expected length 3]`,
  )
})

it('should throw an error if the value is longer than expected', () => {
  const validateString = string({ maxLength: 3 })

  expect(() => {
    validateString('hello')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 3]`,
  )
})

it('should throw an error if the value does not match the pattern', () => {
  const validateString = string({ pattern: /^[a-z]+$/ })

  expect(() => {
    validateString('123')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: does not match pattern]`)
})

it('should throw an error if the value does not match the alphabet', () => {
  const validateString = string({ alphabet: 'abc' })

  expect(() => {
    validateString('def')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: contains character 'd' which is not in alphabet 'abc']`,
  )
})

it('should not throw an error if the value matches the alphabet', () => {
  const validateString = string({ alphabet: 'abc' })

  expect(() => {
    validateString('bbbbbc')
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validateString = string({ required: false })

  expect(() => {
    validateString(undefined)
  }).not.toThrow()
})

it('should not throw an error if the value is an empty string and not required', () => {
  const validateString = string({ required: false })

  expect(() => {
    validateString('')
  }).not.toThrow()
})

it('should not throw an error if the value is a string and not required', () => {
  const validateString = string({ required: false })

  expect(() => {
    validateString('John Doe')
  }).not.toThrow()
})

it('should throw an error if the value is shorter than expected and not required', () => {
  const validateString = string({ minLength: 3, required: false })

  expect(() => {
    validateString('hi')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is shorter than expected length 3]`,
  )
})

it('should throw an error if the value is longer than expected and not required', () => {
  const validateString = string({ maxLength: 3, required: false })

  expect(() => {
    validateString('hello')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 3]`,
  )
})

it('should throw an error if the value does not match the pattern and not required', () => {
  const validateString = string({ pattern: /^[a-z]+$/, required: false })

  expect(() => {
    validateString('123')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: does not match pattern]`)
})

it('should throw an error if the value does not match the alphabet and not required', () => {
  const validateString = string({ alphabet: 'abc', required: false })

  expect(() => {
    validateString('abdc')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: contains character 'd' which is not in alphabet 'abc']`,
  )
})

it('should not throw an error if the value matches the alphabet and not required', () => {
  const validateString = string({ alphabet: 'abc', required: false })

  expect(() => {
    validateString('bbbbbc')
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validateString = string({
    required: true,
    minLength: 3,
    maxLength: 5,
    pattern: /^a[a-z]+$/,
    alphabet: 'abc',
  })

  expect(() => {
    validateString('acc')
  }).not.toThrow()
})
