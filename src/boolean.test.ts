import { expect, it } from 'vitest'
import { boolean, ValidationError } from './index.js'

it('should be able to create a boolean with no options defined', () => {
  const validator = boolean()

  expect(() => {
    validator.validate(true)
  }).not.toThrow()
})

it('should throw an error if the value is not a boolean', () => {
  const validator = boolean()

  try {
    validator.validate('true')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "string",
          "code": "type",
          "expected": "boolean",
        },
        "context": "value",
        "key": undefined,
        "message": "is not boolean",
        "path": [],
        "pathString": "",
        "value": "true",
      }
    `)
  }
})

it('should throw an error if the value is undefined', () => {
  const validator = boolean()

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

it('should not throw an error if the value is undefined and not required', () => {
  const validator = boolean({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})
