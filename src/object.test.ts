import { expect, it, vi } from 'vitest'
import { ValidationError } from './ValidationError.js'
import { Schema, array, boolean, number, object, string } from './index.js'

interface User {
  name: string
  age: number
}

it('should be able to create an object', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const nameSpy = vi.spyOn(schema.name, 'validate')
  const ageSpy = vi.spyOn(schema.age, 'validate')

  const validator = object<User>(schema)

  expect(nameSpy).not.toHaveBeenCalled()
  expect(ageSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).not.toThrow()

  expect(nameSpy).toHaveBeenCalledTimes(1)
  expect(ageSpy).toHaveBeenCalledTimes(1)

  expect(nameSpy).toHaveBeenCalledWith('John Doe', [], 'name', 'value')
  expect(ageSpy).toHaveBeenCalledWith(42, [], 'age', 'value')
})

it('should throw an error if the value is a number instead of object', () => {
  const schema = { name: string() }
  const validator = object<{ name: string }>(schema)

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
})

it('should throw an error if the value is a string instead of object', () => {
  const schema = { name: string() }
  const validator = object<{ name: string }>(schema)

  try {
    validator.validate('foo')
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
        "value": "foo",
      }
    `)
  }
})

it('should throw an error if the value is an array instead of object', () => {
  const schema = { name: string() }
  const validator = object<{ name: string }>(schema)

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

it('should throw an error when value is null', () => {
  const schema = { name: string() }
  const validator = object<{ name: string }>(schema)

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

it('should throw an error if a key is not allowed', () => {
  const schema = {
    name: string(),
  }

  const validator = object<{ name: string }>(schema)

  try {
    validator.validate({ name: 'John Doe', age: 42 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "unknown-keys",
        "constraint": {
          "code": "unknown-keys",
        },
        "context": "value",
        "key": "age",
        "message": "is not allowed",
        "path": [],
        "pathString": "age",
        "value": {
          "age": 42,
          "name": "John Doe",
        },
      }
    `)
  }
})

it('should work when nested', () => {
  const userSchema = {
    name: string(),
    age: number(),
  }

  const schema: Schema<{ user: User }> = {
    user: object<User>(userSchema),
  }

  const nameSpy = vi.spyOn(userSchema.name, 'validate')
  const ageSpy = vi.spyOn(userSchema.age, 'validate')

  const validator = object(schema)

  expect(() => {
    validator.validate({ user: { name: 'John Doe', age: 42 } })
  }).not.toThrow()

  expect(nameSpy).toHaveBeenCalledTimes(1)
  expect(ageSpy).toHaveBeenCalledTimes(1)

  expect(nameSpy).toHaveBeenCalledWith('John Doe', ['user'], 'name', 'value')
  expect(ageSpy).toHaveBeenCalledWith(42, ['user'], 'age', 'value')
})

it('should work when nested and there is an error', () => {
  const userSchema = {
    name: string(),
    age: number(),
  }

  const schema = {
    user: object<User>(userSchema),
  }

  const validator = object<{ user: User }>(schema)

  try {
    validator.validate({ user: { name: 'John Doe' } })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "required",
        "constraint": {
          "code": "required",
        },
        "context": "value",
        "key": "age",
        "message": "is required",
        "path": [
          "user",
        ],
        "pathString": "user.age",
        "value": undefined,
      }
    `)
  }
})

it('should work when nested and with other validation functions', () => {
  const validateUid = string({
    minLength: 10,
    maxLength: 12,
    alphabet: '0123456789',
  })

  interface Message {
    from: {
      uid: string
    }
    message: string
    utcTime: number
    urgent?: boolean
  }

  const validator = object<Message>({
    from: object<Message['from']>({
      uid: validateUid,
    }),
    message: string({ minLength: 1, maxLength: 280 }),
    utcTime: number({ integer: true }),
    urgent: boolean({ required: false }),
  })

  expect(() => {
    validator.validate({
      from: { uid: '1234567890' },
      message: 'Hello, World!',
      utcTime: 1630000000,
    })
  }).not.toThrow()
})

it('should throw an error if the value is undefined when required', () => {
  const schema = { name: string(), age: number() }

  for (const validator of [
    object<User>(schema),
    object<User>(schema, { required: true }),
  ]) {
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
  }
})

it('should not throw an error if the value is undefined and not required', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const validator = object<User>(schema, { required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should throw an error if the test function throws', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const test = vi.fn().mockImplementation((value: Partial<User>) => {
    if (value.age === 42) {
      throw new ValidationError({
        message: 'cannot be 42',
        path: [],
        key: 'age',
        context: 'value',
        constraint: { code: 'one-of', oneOf: ['a', 'b'] },
      })
    }
  })

  const validator = object<User>(schema, {
    test,
  })

  try {
    validator.validate({ name: 'John Doe', age: 42 })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "one-of",
        "constraint": {
          "code": "one-of",
          "oneOf": [
            "a",
            "b",
          ],
        },
        "context": "value",
        "key": "age",
        "message": "cannot be 42",
        "path": [],
        "pathString": "age",
        "value": undefined,
      }
    `)
  }

  expect(test).toHaveBeenCalledTimes(1)
  expect(test).toHaveBeenCalledWith(
    { name: 'John Doe', age: 42 },
    expect.any(Function),
    [],
    undefined,
  )
})

it('should not throw an error if the test function does not throw', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const test = vi.fn().mockImplementation((value: Partial<User>) => {
    if (value.age === 42) {
      throw new ValidationError({
        message: 'cannot be 42',
        path: [],
        key: 'age',
        context: 'value',
        constraint: { code: 'max', max: 42 },
      })
    }
  })

  const validator = object<User>(schema, {
    test,
  })

  expect(() => {
    validator.validate({ name: 'John Doe', age: 45 })
  }).not.toThrow()

  expect(test).toHaveBeenCalledTimes(1)
  expect(test).toHaveBeenCalledWith(
    { name: 'John Doe', age: 45 },
    expect.any(Function),
    [],
    undefined,
  )
})

it('should throw an error if an inner test function throws', () => {
  const schema = {
    name: string({
      test: (value: string, report) => {
        report({ message: `cannot be ${value}` })
      },
    }),
    age: number(),
  }

  const test = vi.fn().mockImplementation((value: Partial<User>) => {
    if (value.age === 42) {
      throw new ValidationError({
        message: 'cannot be 42',
        path: [],
        key: 'age',
        context: 'value',
        constraint: { code: 'one-of', oneOf: ['a', 'b'] },
      })
    }
  })

  const validator = object<User>(schema, {
    test,
  })

  try {
    validator.validate({ name: 'John Doe', age: 42 })
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
        "message": "cannot be John Doe",
        "path": [],
        "pathString": "name",
        "value": "John Doe",
      }
    `)
  }
})

it('should return schema validator via getProp', () => {
  const schema = { name: string(), age: number() }
  const validator = object<User>(schema)

  expect(validator.getProp('name')).toBe(schema.name)
  expect(validator.getProp('age')).toBe(schema.age)
})

it('should pass correct path and key to test report callback', () => {
  const schema = {
    user: object<User>({
      name: string({
        test: (_value, report, path, key) => {
          expect(path).toEqual(['user'])
          expect(key).toBe('name')
          report({ message: 'custom fail' })
        },
      }),
      age: number(),
    }),
  }
  const validator = object<{ user: User }>(schema)

  try {
    validator.validate({ user: { name: 'John', age: 30 } })
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
        "message": "custom fail",
        "path": [
          "user",
        ],
        "pathString": "user.name",
        "value": "John",
      }
    `)
  }
})

it('should work for object containing an array', () => {
  const schema = {
    uids: array(string({ minLength: 5, maxLength: 5 })),
  }

  interface UserList {
    uids: string[]
  }

  const validator = object<UserList>(schema)

  expect(() => {
    validator.validate({ uids: ['asdij', '01234', '1414k'] })
  }).not.throw()
})

it('should work with an object containing non-required keys', () => {
  const schema = {
    name: string({ required: false }),
    age: number({ required: false }),
  }

  const validator = object<User>(schema)

  expect(() => {
    validator.validate({ age: 12 })
  }).not.toThrow()
})

it('should include path and key for property validation errors', () => {
  const schema = {
    name: string({ minLength: 5 }),
    age: number(),
  }

  const validator = object(schema)

  try {
    validator.validate({ name: 'Bob', age: 25 })
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 5,
        },
        "context": "value",
        "key": "name",
        "message": "is shorter than expected length 5",
        "path": [],
        "pathString": "name",
        "value": "Bob",
      }
    `)
  }
})

it('should not duplicate path when array is required but missing', () => {
  const schema = {
    name: array(string()),
  }
  const validator = object<{ name: string[] }>(schema)

  try {
    validator.validate({ name: undefined })
    expect.fail('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "required",
        "constraint": {
          "code": "required",
        },
        "context": "value",
        "key": "name",
        "message": "is required",
        "path": [],
        "pathString": "name",
        "value": undefined,
      }
    `)
  }
})

it('should include path and key for nested object validation errors', () => {
  const itemSchema = { price: number({ min: 1 }) }
  const schema = {
    items: array(object(itemSchema)),
  }
  const validator = object(schema)

  try {
    validator.validate({ items: [{ price: 0 }] })
    expect.fail('Should have thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "min",
        "constraint": {
          "code": "min",
          "min": 1,
        },
        "context": "value",
        "key": "price",
        "message": "is less than minimum 1",
        "path": [
          "items",
          "[0]",
        ],
        "pathString": "items.[0].price",
        "value": 0,
      }
    `)
  }
})
