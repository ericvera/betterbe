import { expect, it, vi } from 'vitest'
import { boolean, number, record, string, ValidationError } from './index.js'

it('should validate a record with string keys and number values', () => {
  const keyValidator = string({ pattern: /^[a-z]+$/ })
  const valueValidator = number({ min: 0 })

  const keySpy = vi.spyOn(keyValidator, 'validate')
  const valueSpy = vi.spyOn(valueValidator, 'validate')

  const validator = record(keyValidator, valueValidator)

  expect(() => {
    validator.validate({ foo: 1, bar: 2, baz: 3 })
  }).not.toThrow()

  expect(keySpy).toHaveBeenCalledTimes(3)
  expect(valueSpy).toHaveBeenCalledTimes(3)

  expect(keySpy).toHaveBeenCalledWith('foo', [], 'foo')
  expect(keySpy).toHaveBeenCalledWith('bar', [], 'bar')
  expect(keySpy).toHaveBeenCalledWith('baz', [], 'baz')

  expect(valueSpy).toHaveBeenCalledWith(1, [], 'foo')
  expect(valueSpy).toHaveBeenCalledWith(2, [], 'bar')
  expect(valueSpy).toHaveBeenCalledWith(3, [], 'baz')
})

it('should throw an error for invalid keys', () => {
  const keyValidator = string({ pattern: /^[a-z]+$/ })
  const valueValidator = number()

  const validator = record(keyValidator, valueValidator)

  expect(() => {
    validator.validate({ 'invalid-key': 1, foo: 2 })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: key 'invalid-key' does not match pattern]`,
  )
})

it('should throw an error for invalid values', () => {
  const keyValidator = string()
  const valueValidator = number({ min: 0 })

  const validator = record(keyValidator, valueValidator)

  expect(() => {
    validator.validate({ foo: -1, bar: 2 })
  }).toThrowErrorMatchingInlineSnapshot(`[Error: 'foo' is less than minimum 0]`)
})

it('should work with empty objects', () => {
  const validator = record(string(), number())

  expect(() => {
    validator.validate({})
  }).not.toThrow()
})

it('should work when nested in other validators', () => {
  const userRecord = record(string(), boolean())
  const nestedValidator = record(string(), userRecord)

  expect(() => {
    nestedValidator.validate({
      user1: { active: true, verified: false },
      user2: { active: false, verified: true },
    })
  }).not.toThrow()
})

it('should provide proper error paths for nested validation', () => {
  const userRecord = record(string(), number())
  const nestedValidator = record(string(), userRecord)

  expect(() => {
    nestedValidator.validate({
      user1: { score: 100 },
      user2: { score: 'invalid' },
    })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: 'score' is not number at path 'user2']`,
  )
})

it('should handle required option', () => {
  const validator = record(string(), number(), { required: true })

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should handle required: false option', () => {
  const validator = record(string(), number(), { required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should throw error for non-object values', () => {
  const validator = record(string(), number())

  expect(() => {
    validator.validate('not an object')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not object]`)

  expect(() => {
    validator.validate(42)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not object]`)

  expect(() => {
    validator.validate([])
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not object]`)
})

it('should work with custom test function', () => {
  const validator = record(string(), number(), {
    test: (value) => {
      const keys = Object.keys(value)

      if (keys.length < 2) {
        throw new Error('Must have at least 2 properties')
      }
    },
  })

  expect(() => {
    validator.validate({ a: 1 })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: Must have at least 2 properties]`,
  )

  expect(() => {
    validator.validate({ a: 1, b: 2 })
  }).not.toThrow()
})

it('should validate with different key and value types', () => {
  const keyValidator = string({ oneOf: ['admin', 'user', 'guest'] })
  const valueValidator = boolean()

  const validator = record(keyValidator, valueValidator)

  expect(() => {
    validator.validate({ admin: true, user: false, guest: true })
  }).not.toThrow()

  expect(() => {
    validator.validate({ invalid: true })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: key 'invalid' is not one of the allowed values]`,
  )
})

it('should work with complex nested structures', () => {
  const userValidator = record(
    string({ pattern: /^[a-z0-9]+$/ }),
    record(string({ oneOf: ['name', 'email', 'age'] }), string()),
  )

  expect(() => {
    userValidator.validate({
      user1: { name: 'John', email: 'john@example.com', age: '30' },
      user2: { name: 'Jane', email: 'jane@example.com', age: '25' },
    })
  }).not.toThrow()
})

it('should provide correct validator type', () => {
  const validator = record(string(), number())

  expect(validator.type).toBe('record')
})

it('should handle null and undefined values correctly', () => {
  const validator = record(string(), number())

  expect(() => {
    validator.validate(null)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not object]`)
})

it('should provide key-specific errors for various validation types', () => {
  // Test minLength key validation
  const minLengthValidator = record(string({ minLength: 3 }), number())

  expect(() => {
    minLengthValidator.validate({ ab: 1 })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: key 'ab' is shorter than expected length 3]`,
  )

  // Test maxLength key validation
  const maxLengthValidator = record(string({ maxLength: 5 }), number())

  expect(() => {
    maxLengthValidator.validate({ toolongkey: 1 })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: key 'toolongkey' is longer than expected length 5]`,
  )
})

it('should provide key-specific errors in nested records with proper paths', () => {
  const nestedValidator = record(
    string({ pattern: /^[a-z0-9]+$/ }),
    record(string({ oneOf: ['name', 'email'] }), string()),
  )

  expect(() => {
    nestedValidator.validate({
      user1: { name: 'John' },
      user2: { invalidfield: 'value' },
    })
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: key 'invalidfield' is not one of the allowed values at path 'user2']`,
  )
})

it('should include key context metadata in validation errors', () => {
  const validator = record(string({ pattern: /^[a-z]+$/ }), number())

  try {
    validator.validate({ 'Invalid-Key': 1 })
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const validationError = error as ValidationError
    expect(validationError.type).toBe('pattern')
    expect(validationError.meta.context).toBe('key')
    expect(validationError.meta.originalKey).toBe('Invalid-Key')
    expect(validationError.meta.pattern).toEqual(/^[a-z]+$/)
  }
})

it('should include key context metadata for oneOf validation errors', () => {
  const validator = record(
    string({ oneOf: ['admin', 'user', 'guest'] }),
    boolean(),
  )

  try {
    validator.validate({ invalid: true })
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const validationError = error as ValidationError
    expect(validationError.type).toBe('one-of')
    expect(validationError.meta.context).toBe('key')
    expect(validationError.meta.originalKey).toBe('invalid')
    expect(validationError.meta.oneOf).toEqual(['admin', 'user', 'guest'])
  }
})

it('should include key context metadata for length validation errors', () => {
  const validator = record(string({ minLength: 5 }), number())

  try {
    validator.validate({ abc: 1 })
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const validationError = error as ValidationError
    expect(validationError.type).toBe('minLength')
    expect(validationError.meta.context).toBe('key')
    expect(validationError.meta.originalKey).toBe('abc')
    expect(validationError.meta.minLength).toBe(5)
  }
})

it('should include value context metadata for value validation errors', () => {
  const validator = record(string(), number({ min: 0 }))

  try {
    validator.validate({ foo: -1 })
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    const validationError = error as ValidationError
    expect(validationError.type).toBe('min')
    expect(validationError.meta.context).toBe('value')
    expect(validationError.meta.originalKey).toBeUndefined()
    expect(validationError.meta.min).toBe(0)
  }
})
