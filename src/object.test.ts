import { expect, it, vi } from 'vitest'
import { Schema, boolean, number, object, string } from './index.js'
import { ValidationError } from './internal/ValidationError.js'

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

  expect(nameSpy).toHaveBeenCalledWith('John Doe', [], 'name')
  expect(ageSpy).toHaveBeenCalledWith(42, [], 'age')
})

it('should throw an error if a key is not allowed', () => {
  const schema = {
    name: string(),
  }

  const validator = object<{ name: string }>(schema)

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[Error: 'age' is not allowed]`)
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

  expect(nameSpy).toHaveBeenCalledWith('John Doe', ['user'], 'name')
  expect(ageSpy).toHaveBeenCalledWith(42, ['user'], 'age')
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
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: 'age' is required at path 'user']`,
  )
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
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is undefined (required: true)', () => {
  const schema = {
    name: string(),
    age: number(),
  }

  const validator = object<User>(schema, { required: true })

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
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
      throw new ValidationError('cannot be 42', [], 'age')
    }
  })

  const validator = object<User>(schema, {
    test,
  })

  expect(() => {
    validator.validate({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[Error: 'age' cannot be 42]`)

  expect(test).toHaveBeenCalledTimes(1)
  expect(test).toHaveBeenCalledWith(
    { name: 'John Doe', age: 42 },
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
      throw new ValidationError('cannot be 42', [], 'age')
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
    [],
    undefined,
  )
})
