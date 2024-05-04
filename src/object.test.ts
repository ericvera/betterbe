import { expect, it, vi } from 'vitest'
import { boolean, number, object, string } from '.'
import { Schema } from './types'

it('should be able to create an object', () => {
  const schema = {
    name: vi.fn(),
    age: vi.fn(),
  }

  const validateObject = object(schema)

  expect(schema.name).not.toHaveBeenCalled()
  expect(schema.age).not.toHaveBeenCalled()

  expect(() => {
    validateObject({ name: 'John Doe', age: 42 })
  }).not.toThrow()

  expect(schema.name).toHaveBeenCalledTimes(1)
  expect(schema.age).toHaveBeenCalledTimes(1)

  expect(schema.name).toHaveBeenCalledWith('John Doe', [], 'name')
  expect(schema.age).toHaveBeenCalledWith(42, [], 'age')
})

it('should throw an error if a key is not allowed', () => {
  const schema = {
    name: vi.fn(),
  }

  const validateObject = object(schema)

  expect(() => {
    validateObject({ name: 'John Doe', age: 42 })
  }).toThrowErrorMatchingInlineSnapshot(`[Error: 'age' is not allowed]`)
})

it('should work when nested', () => {
  const userSchema = {
    name: vi.fn(),
    age: vi.fn(),
  }

  const schema: Schema = {
    user: object(userSchema),
  }

  const validateObject = object(schema)

  expect(() => {
    validateObject({ user: { name: 'John Doe', age: 42 } })
  }).not.toThrow()

  expect(userSchema.name).toHaveBeenCalledTimes(1)
  expect(userSchema.age).toHaveBeenCalledTimes(1)

  expect(userSchema.name).toHaveBeenCalledWith('John Doe', ['user'], 'name')
  expect(userSchema.age).toHaveBeenCalledWith(42, ['user'], 'age')
})

it('should work when nested and there is an error', () => {
  const userSchema = {
    name: vi.fn(),
    age: number(),
  }

  const schema: Schema = {
    user: object(userSchema),
  }

  const validateObject = object(schema)

  expect(() => {
    validateObject({ user: { name: 'John Doe' } })
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

  const validateMessage = object({
    from: object({
      uid: validateUid,
    }),
    message: string({ minLength: 1, maxLength: 280 }),
    utcTime: number({ integer: true }),
    urgent: boolean({ required: false }),
  })

  expect(() => {
    validateMessage({
      from: { uid: '1234567890' },
      message: 'Hello, World!',
      utcTime: 1630000000,
    })
  }).not.toThrow()
})
