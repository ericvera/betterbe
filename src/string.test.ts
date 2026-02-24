import { expect, it, vi } from 'vitest'
import { object, string, ValidationError } from './index.js'

it('should be able to create a string with no options defined', () => {
  const validator = string()

  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()
})

it('should throw an error if the value is not a string', () => {
  const validator = string()

  try {
    validator.validate(42)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "number",
          "code": "type",
          "expected": "string",
        },
        "context": "value",
        "key": undefined,
        "message": "is not string",
        "path": [],
        "pathString": "",
        "value": 42,
      }
    `)
  }
})

it('should throw an error if the value is undefined', () => {
  const validator = string()

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

it('should throw an error if the value is an empty string', () => {
  const validator = string()

  try {
    validator.validate('')
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
        "value": "",
      }
    `)
  }
})

it('should throw an error if the value is shorter than expected', () => {
  const validator = string({ minLength: 3 })

  try {
    validator.validate('hi')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is shorter than expected length 3",
        "path": [],
        "pathString": "",
        "value": "hi",
      }
    `)
  }
})

it('should not throw if the value is exactly minLength', () => {
  const validator = string({ minLength: 3 })

  expect(() => {
    validator.validate('ola')
  }).not.toThrow()
})

it('should throw an error if the value is longer than maxLength', () => {
  const validator = string({ maxLength: 3 })

  try {
    validator.validate('hola')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "maxLength",
        "constraint": {
          "code": "maxLength",
          "maxLength": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is longer than expected length 3",
        "path": [],
        "pathString": "",
        "value": "hola",
      }
    `)
  }
})

it('should not throw if the value is exactly maxLength', () => {
  const validator = string({ maxLength: 3 })

  expect(() => {
    validator.validate('ola')
  }).not.toThrow()
})

it('should throw an error if the value does not match the pattern', () => {
  const validator = string({ pattern: /^[a-z]+$/ })

  try {
    validator.validate('123')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "pattern",
        "constraint": {
          "code": "pattern",
          "pattern": "/^[a-z]+$/",
        },
        "context": "value",
        "key": undefined,
        "message": "does not match pattern",
        "path": [],
        "pathString": "",
        "value": "123",
      }
    `)
  }
})

it('should throw an error if the value does not match the alphabet', () => {
  const validator = string({ alphabet: 'abc' })

  try {
    validator.validate('def')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "alphabet",
        "constraint": {
          "alphabet": "abc",
          "code": "alphabet",
        },
        "context": "value",
        "key": undefined,
        "message": "contains character 'd' which is not in alphabet 'abc'",
        "path": [],
        "pathString": "",
        "value": "def",
      }
    `)
  }
})

it('should not throw an error if the value matches the alphabet', () => {
  const validator = string({ alphabet: 'abc' })

  expect(() => {
    validator.validate('bbbbbc')
  }).not.toThrow()
})

it('should not throw when required: false for undefined, empty string, or valid value', () => {
  const validator = string({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
  expect(() => {
    validator.validate('')
  }).not.toThrow()
  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()
})

it('should throw if the value is shorter than expected and not required', () => {
  const validator = string({ minLength: 3, required: false })
  try {
    validator.validate('hi')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is shorter than expected length 3",
        "path": [],
        "pathString": "",
        "value": "hi",
      }
    `)
  }
})

it('should throw if the value is longer than expected and not required', () => {
  const validator = string({ maxLength: 3, required: false })
  try {
    validator.validate('hello')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "maxLength",
        "constraint": {
          "code": "maxLength",
          "maxLength": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is longer than expected length 3",
        "path": [],
        "pathString": "",
        "value": "hello",
      }
    `)
  }
})

it('should throw if the value does not match the pattern and not required', () => {
  const validator = string({ pattern: /^[a-z]+$/, required: false })
  try {
    validator.validate('123')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "pattern",
        "constraint": {
          "code": "pattern",
          "pattern": "/^[a-z]+$/",
        },
        "context": "value",
        "key": undefined,
        "message": "does not match pattern",
        "path": [],
        "pathString": "",
        "value": "123",
      }
    `)
  }
})

it('should throw if the value does not match the alphabet and not required', () => {
  const validator = string({ alphabet: 'abc', required: false })
  try {
    validator.validate('abdc')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "alphabet",
        "constraint": {
          "alphabet": "abc",
          "code": "alphabet",
        },
        "context": "value",
        "key": undefined,
        "message": "contains character 'd' which is not in alphabet 'abc'",
        "path": [],
        "pathString": "",
        "value": "abdc",
      }
    `)
  }
})

it('should not throw an error if the value matches the alphabet and not required', () => {
  const validator = string({ alphabet: 'abc', required: false })

  expect(() => {
    validator.validate('bbbbbc')
  }).not.toThrow()
})

it('should not throw when value satisfies all constraints', () => {
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

  try {
    validator.validate('foo')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "one-of",
        "constraint": {
          "code": "one-of",
          "oneOf": [
            "hello",
            "world",
          ],
        },
        "context": "value",
        "key": undefined,
        "message": "is not one of the allowed values",
        "path": [],
        "pathString": "",
        "value": "foo",
      }
    `)
  }
})

it('should not throw when undefined and not required with oneOf', () => {
  enum Value {
    One = 'one',
    Two = 'two',
  }

  const validator = string({ required: false, oneOf: Object.values(Value) })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should not throw when the test function does not report', () => {
  const test = vi.fn().mockImplementation(() => undefined)

  const validator = string({
    required: false,
    test,
  })

  expect(() => {
    validator.validate('John Doe')
  }).not.toThrow()

  expect(test).toHaveBeenCalledTimes(1)
  expect(test).toHaveBeenCalledWith(
    'John Doe',
    expect.any(Function),
    undefined,
    undefined,
  )
})

it('should pass correct path and key to test report callback', () => {
  const validator = object({
    name: string({
      test: (_value, report, path, key) => {
        expect(path).toEqual([])
        expect(key).toBe('name')
        report({ message: 'string test fail' })
      },
    }),
  })

  try {
    validator.validate({ name: 'John' })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "test",
        "constraint": {
          "code": "test",
        },
        "context": "value",
        "key": "name",
        "message": "string test fail",
        "path": [],
        "pathString": "name",
        "value": "John",
      }
    `)
  }
})

it('should throw an error when the test function reports a failure', () => {
  const validator = string({
    required: true,
    alphabet: 'JDohne ',
    test: (value: string, report) => {
      report({ message: `Can't be ${value}.` })
    },
  })

  try {
    validator.validate('John Doe')
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
        "message": "Can't be John Doe.",
        "path": [],
        "pathString": "",
        "value": "John Doe",
      }
    `)
  }
})
