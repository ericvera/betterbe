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

  expect(keySpy).toHaveBeenCalledWith('foo', [], 'foo', 'key')
  expect(keySpy).toHaveBeenCalledWith('bar', [], 'bar', 'key')
  expect(keySpy).toHaveBeenCalledWith('baz', [], 'baz', 'key')

  expect(valueSpy).toHaveBeenCalledWith(1, [], 'foo', 'value')
  expect(valueSpy).toHaveBeenCalledWith(2, [], 'bar', 'value')
  expect(valueSpy).toHaveBeenCalledWith(3, [], 'baz', 'value')
})

it('should throw an error for invalid keys', () => {
  const keyValidator = string({ pattern: /^[a-z]{2}$/ })
  const valueValidator = number()

  const validator = record(keyValidator, valueValidator)

  try {
    validator.validate({ boom: 1, foo: 2 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "pattern",
        "constraint": {
          "code": "pattern",
          "pattern": "/^[a-z]{2}$/",
        },
        "context": "key",
        "key": "boom",
        "message": "does not match pattern",
        "path": [],
        "pathString": "boom",
        "value": "boom",
      }
    `)
  }
})

it('should throw with context key when key validator fails type check', () => {
  const validator = record(number(), string())

  try {
    validator.validate({ abc: 'value' })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "string",
        },
        "context": "key",
        "key": "abc",
        "message": "is not number",
        "path": [],
        "pathString": "abc",
        "value": "abc",
      }
    `)
  }
})

it('should pass correct path and key to test report callback', () => {
  const validator = record(string(), number(), {
    test: (_value, report, path, key) => {
      expect(path).toEqual([])
      expect(key).toBe(undefined)
      report({ message: 'record test fail' })
    },
  })

  try {
    validator.validate({ foo: 1 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "test",
        "constraint": {
          "code": "test",
        },
        "context": "value",
        "key": undefined,
        "message": "record test fail",
        "path": [],
        "pathString": "",
        "value": {
          "foo": 1,
        },
      }
    `)
  }
})

it('should throw an error for invalid values', () => {
  const keyValidator = string()
  const valueValidator = number({ min: 0 })

  const validator = record(keyValidator, valueValidator)

  try {
    validator.validate({ foo: -1, bar: 2 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "min",
        "constraint": {
          "code": "min",
          "min": 0,
        },
        "context": "value",
        "key": "foo",
        "message": "is less than minimum 0",
        "path": [],
        "pathString": "foo",
        "value": -1,
      }
    `)
  }
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

  try {
    nestedValidator.validate({
      user1: { score: 100 },
      user2: { score: 'invalid' },
    })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "string",
        },
        "context": "value",
        "key": "score",
        "message": "is not number",
        "path": [
          "user2",
        ],
        "pathString": "user2.score",
        "value": "invalid",
      }
    `)
  }
})

it('should handle required option', () => {
  const validator = record(string(), number(), { required: true })

  try {
    validator.validate(undefined)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "required",
        "constraint": {
          "code": "required",
        },
        "context": "value",
        "key": undefined,
        "message": "is required",
        "path": [],
        "pathString": "",
        "value": undefined,
      }
    `)
  }
})

it('should handle required: false option', () => {
  const validator = record(string(), number(), { required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should throw error for non-object values', () => {
  const validator = record(string(), number())

  try {
    validator.validate('not an object')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "string",
        },
        "context": "value",
        "key": undefined,
        "message": "is not object",
        "path": [],
        "pathString": "",
        "value": "not an object",
      }
    `)
  }

  try {
    validator.validate(42)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "number",
        },
        "context": "value",
        "key": undefined,
        "message": "is not object",
        "path": [],
        "pathString": "",
        "value": 42,
      }
    `)
  }

  try {
    validator.validate([])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "array",
        },
        "context": "value",
        "key": undefined,
        "message": "is not object",
        "path": [],
        "pathString": "",
        "value": [],
      }
    `)
  }
})

it('should work with custom test function', () => {
  const validator = record(string(), number(), {
    test: (value, report) => {
      const keys = Object.keys(value)

      if (keys.length < 2) {
        report({ message: 'Must have at least 2 properties' })
      }
    },
  })

  try {
    validator.validate({ a: 1 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "test",
        "constraint": {
          "code": "test",
        },
        "context": "value",
        "key": undefined,
        "message": "Must have at least 2 properties",
        "path": [],
        "pathString": "",
        "value": {
          "a": 1,
        },
      }
    `)
  }

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

  try {
    validator.validate({ invalid: true })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "one-of",
        "constraint": {
          "code": "one-of",
          "oneOf": [
            "admin",
            "user",
            "guest",
          ],
        },
        "context": "key",
        "key": "invalid",
        "message": "is not one of the allowed values",
        "path": [],
        "pathString": "invalid",
        "value": "invalid",
      }
    `)
  }
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

it('should throw when value is null', () => {
  const validator = record(string(), number())

  try {
    validator.validate(null)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "code": "type",
          "expected": "object",
        },
        "context": "value",
        "key": undefined,
        "message": "is not object",
        "path": [],
        "pathString": "",
        "value": null,
      }
    `)
  }
})

it('should provide key-specific errors for various validation types', () => {
  // Test minLength key validation
  const minLengthValidator = record(string({ minLength: 3 }), number())

  try {
    minLengthValidator.validate({ ab: 1 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 3,
        },
        "context": "key",
        "key": "ab",
        "message": "is shorter than expected length 3",
        "path": [],
        "pathString": "ab",
        "value": "ab",
      }
    `)
  }

  // Test maxLength key validation
  const maxLengthValidator = record(string({ maxLength: 5 }), number())

  try {
    maxLengthValidator.validate({ toolongkey: 1 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "maxLength",
        "constraint": {
          "code": "maxLength",
          "maxLength": 5,
        },
        "context": "key",
        "key": "toolongkey",
        "message": "is longer than expected length 5",
        "path": [],
        "pathString": "toolongkey",
        "value": "toolongkey",
      }
    `)
  }
})

it('should provide key-specific errors in nested records with proper paths', () => {
  const nestedValidator = record(
    string({ pattern: /^[a-z0-9]+$/ }),
    record(string({ oneOf: ['name', 'email'] }), string()),
  )

  try {
    nestedValidator.validate({
      user1: { name: 'John' },
      user2: { invalidfield: 'value' },
    })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "one-of",
        "constraint": {
          "code": "one-of",
          "oneOf": [
            "name",
            "email",
          ],
        },
        "context": "key",
        "key": "invalidfield",
        "message": "is not one of the allowed values",
        "path": [
          "user2",
        ],
        "pathString": "user2.invalidfield",
        "value": "invalidfield",
      }
    `)
  }
})
