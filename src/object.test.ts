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

it('should throw an error if a key is not allowed', () => {
  const schema = {
    name: string(),
  }

  const validator = object<{ name: string }>(schema)

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: is not allowed]`)
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

  expect(() => {
    validator.validate({ user: { name: 'John Doe' } })
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: is required]`)
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

it('should throw an error if the value is undefined (default required)', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const validator = object<User>(schema)

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: is required]`)
})

it('should throw an error if the value is undefined (required: true)', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const validator = object<User>(schema, { required: true })

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: is required]`)
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

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: cannot be 42]`)

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

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[ValidationError: cannot be John Doe]`)
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
    const validationError = error as ValidationError
    expect(validationError.code).toBe('minLength')
    expect(validationError.path).toEqual([])
    expect(validationError.key).toBe('name')
    expect(validationError.value).toBe('Bob')
    expect(validationError.constraint).toEqual({
      code: 'minLength',
      minLength: 5,
    })
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
    const e = error as ValidationError
    expect(e.code).toBe('min')
    expect(e.path).toEqual(['items', '[0]'])
    expect(e.key).toBe('price')
    expect(e.value).toBe(0)
    expect(e.constraint).toEqual({ code: 'min', min: 1 })
    const json = e.toJSON()
    expect(json['path']).toEqual(['items', '[0]'])
    expect(json['key']).toBe('price')
    expect(json['value']).toBe(0)
  }
})
