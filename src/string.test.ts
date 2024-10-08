import { expect, it, vi } from 'vitest'
import { string } from './index.js'

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
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not string]`)
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

it('should not throw if the value is exactly minLength', () => {
  const validator = string({ minLength: 3 })

  expect(() => {
    validator.validate('ola')
  }).not.toThrow()
})

it('should throw an error if the value is longer than maxLength', () => {
  const validator = string({ maxLength: 3 })

  expect(() => {
    validator.validate('hola')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 3]`,
  )
})

it('should not throw if the value is exactly maxLength', () => {
  const validator = string({ maxLength: 3 })

  expect(() => {
    validator.validate('ola')
  }).not.toThrow()
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

it('should not throw an error if the value is one of the allowed values', () => {
  const validator = string({ oneOf: ['hello', 'world'] })

  expect(() => {
    validator.validate('world')
  }).not.toThrow()
})

it('should throw an error if the value is not one of the allowed values', () => {
  const validator = string({ oneOf: ['hello', 'world'] })

  expect(() => {
    validator.validate('foo')
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is not one of the allowed values]`,
  )
})

it('should not throw an error if the value is undefined and not required', () => {
  enum Value {
    One = 'one',
    Two = 'two',
  }

  const validator = string({ required: false, oneOf: Object.values(Value) })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should not throw an error if the the test function does not throw', () => {
  const test = vi.fn().mockImplementation(() => {})

  const validator = string({
    required: false,
    test,
  })

  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()

  expect(test).toHaveBeenCalledTimes(1)
  expect(test).toHaveBeenCalledWith('John Doe', undefined, undefined)
})

it('should not throw an error if the the test function throws an error', () => {
  const validator = string({
    required: true,
    alphabet: 'JDohne ',
    test: (value: string) => {
      throw new Error(`Can't be ${value}.`)
    },
  })

  expect(() => {
    validator.validate('John Doe')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: Can't be John Doe.]`)
})
