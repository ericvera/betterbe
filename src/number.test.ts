import { expect, it } from 'vitest'
import { number, ValidationError } from './index.js'

it('should be able to create a number with no options defined', () => {
  const validator = number()

  expect(() => {
    validator.validate(42)
  }).not.toThrow()
})

it('should throw an error if the value is not a number', () => {
  const validator = number()

  try {
    validator.validate('42')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "string",
          "code": "type",
          "expected": "number",
        },
        "context": "value",
        "key": undefined,
        "message": "is not number",
        "path": [],
        "pathString": "",
        "value": "42",
      }
    `)
  }
})

it('should throw an error if the value is NaN', () => {
  const validator = number()

  try {
    validator.validate(Number.NaN)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "NaN",
          "code": "type",
          "expected": "number",
        },
        "context": "value",
        "key": undefined,
        "message": "is not a number",
        "path": [],
        "pathString": "",
        "value": NaN,
      }
    `)
  }
})

it('should throw an error if the value is NaN with options', () => {
  const validator = number({ min: 0, max: 100 })

  try {
    validator.validate(Number.NaN)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "NaN",
          "code": "type",
          "expected": "number",
        },
        "context": "value",
        "key": undefined,
        "message": "is not a number",
        "path": [],
        "pathString": "",
        "value": NaN,
      }
    `)
  }
})

it('should throw an error if the value is undefined', () => {
  const validator = number()

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

it('should throw an error if the value is less than the minimum', () => {
  const validator = number({ min: 3 })

  try {
    validator.validate(2)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "min",
        "constraint": {
          "code": "min",
          "min": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is less than minimum 3",
        "path": [],
        "pathString": "",
        "value": 2,
      }
    `)
  }
})

it('should throw an error if the value is greater than the maximum', () => {
  const validator = number({ max: 3 })

  try {
    validator.validate(4)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "max",
        "constraint": {
          "code": "max",
          "max": 3,
        },
        "context": "value",
        "key": undefined,
        "message": "is greater than maximum 3",
        "path": [],
        "pathString": "",
        "value": 4,
      }
    `)
  }
})

it('should throw an error if the value is not an integer', () => {
  const validator = number({ integer: true })

  try {
    validator.validate(3.14)
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "int",
        "constraint": {
          "code": "int",
        },
        "context": "value",
        "key": undefined,
        "message": "is not an integer",
        "path": [],
        "pathString": "",
        "value": 3.14,
      }
    `)
  }
})

it('should not throw an error if the value is an integer', () => {
  const validator = number({ integer: true })

  expect(() => {
    validator.validate(3)
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validator = number({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})

it('should not throw an error if the value is a number and not required', () => {
  const validator = number({ required: false })

  expect(() => {
    validator.validate(42)
  }).not.toThrow()
})

it('should not throw with all the options and a valid value', () => {
  const validator = number({
    min: 3,
    max: 10000000000,
    integer: true,
    required: true,
  })

  expect(() => {
    validator.validate(10000000000)
  }).not.toThrow()
})

it('should throw on a negative number when min is 0', () => {
  const validator = number({ min: 0 })

  try {
    validator.validate(-1)
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
        "key": undefined,
        "message": "is less than minimum 0",
        "path": [],
        "pathString": "",
        "value": -1,
      }
    `)
  }
})
