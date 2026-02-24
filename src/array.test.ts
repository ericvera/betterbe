import { expect, it, vi } from 'vitest'
import type { TestReport } from './index.js'
import { array, number, object, string, ValidationError } from './index.js'

it('should be able to create an array', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator)

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['1', 'hello'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(2)

  expect(valueSpy.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "1",
      [],
      "[0]",
      "value",
    ]
  `)
  expect(valueSpy.mock.calls[1]).toMatchInlineSnapshot(`
    [
      "hello",
      [],
      "[1]",
      "value",
    ]
  `)
})

it('should work with empty array', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator)

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate([])
  }).not.toThrow()

  expect(valueSpy).not.toHaveBeenCalled()
})

it('should throw an error if the value is a number instead of array', () => {
  const validator = array(string())

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
          "expected": "array",
        },
        "context": "value",
        "key": undefined,
        "message": "is not array",
        "path": [],
        "pathString": "",
        "value": 42,
      }
    `)
  }
})

it('should throw an error if the value is a string instead of array', () => {
  const validator = array(string())

  try {
    validator.validate('foo')
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "string",
          "code": "type",
          "expected": "array",
        },
        "context": "value",
        "key": undefined,
        "message": "is not array",
        "path": [],
        "pathString": "",
        "value": "foo",
      }
    `)
  }
})

it('should throw an error if the value is an object instead of array', () => {
  const validator = array(string())

  try {
    validator.validate({})
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "type",
        "constraint": {
          "actual": "object",
          "code": "type",
          "expected": "array",
        },
        "context": "value",
        "key": undefined,
        "message": "is not array",
        "path": [],
        "pathString": "",
        "value": {},
      }
    `)
  }
})

it('should throw an error if the array is shorter than expected', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { minLength: 2 })

  expect(valueSpy).not.toHaveBeenCalled()

  try {
    validator.validate(['a'])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 2,
        },
        "context": "value",
        "key": undefined,
        "message": "is shorter than expected length 2",
        "path": [],
        "pathString": "",
        "value": [
          "a",
        ],
      }
    `)
  }

  expect(valueSpy).not.toHaveBeenCalled()
})

it('should not throw if the array is exactly the minLength', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { minLength: 1 })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(1)

  expect(valueSpy.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "a",
      [],
      "[0]",
      "value",
    ]
  `)
})

it('should throw if the array is longer than maxLength', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5 })

  expect(valueSpy).not.toHaveBeenCalled()

  try {
    validator.validate(['a', 'b', 'c', 'd', 'e', 'f'])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "maxLength",
        "constraint": {
          "code": "maxLength",
          "maxLength": 5,
        },
        "context": "value",
        "key": undefined,
        "message": "is longer than expected length 5",
        "path": [],
        "pathString": "",
        "value": [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
        ],
      }
    `)
  }

  expect(valueSpy).not.toHaveBeenCalled()
})

it('should not throw if value is exactly maxLength', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5 })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a', 'b', 'c', 'd', 'e'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(5)
  expect(valueSpy.mock.calls[0]).toMatchInlineSnapshot(`
    [
      "a",
      [],
      "[0]",
      "value",
    ]
  `)
  expect(valueSpy.mock.calls[1]).toMatchInlineSnapshot(`
    [
      "b",
      [],
      "[1]",
      "value",
    ]
  `)
  expect(valueSpy.mock.calls[2]).toMatchInlineSnapshot(`
    [
      "c",
      [],
      "[2]",
      "value",
    ]
  `)
  expect(valueSpy.mock.calls[3]).toMatchInlineSnapshot(`
    [
      "d",
      [],
      "[3]",
      "value",
    ]
  `)
  expect(valueSpy.mock.calls[4]).toMatchInlineSnapshot(`
    [
      "e",
      [],
      "[4]",
      "value",
    ]
  `)
})

it('should work when nested', () => {
  const numberValidator = number()
  const itemValidator = array(numberValidator, { required: true, maxLength: 3 })

  const numberSpy = vi.spyOn(numberValidator, 'validate')
  const arraySpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 2, minLength: 1 })

  expect(numberSpy).not.toHaveBeenCalled()
  expect(arraySpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate([
      [1, 4, 5],
      [0, 123],
    ])
  }).not.toThrow()

  expect(arraySpy).toHaveBeenCalledTimes(2)
  expect(numberSpy).toHaveBeenCalledTimes(5)
})

it('should work when nested and there is an error', () => {
  const numberValidator = number({
    max: 10,
  })
  const itemValidator = array(numberValidator, { required: true, maxLength: 3 })

  const numberSpy = vi.spyOn(numberValidator, 'validate')
  const arraySpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 2, minLength: 1 })

  expect(numberSpy).not.toHaveBeenCalled()
  expect(arraySpy).not.toHaveBeenCalled()

  try {
    validator.validate([
      [1, 4, 123],
      [0, 5],
    ])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "max",
        "constraint": {
          "code": "max",
          "max": 10,
        },
        "context": "value",
        "key": "[2]",
        "message": "is greater than maximum 10",
        "path": [
          "[0]",
        ],
        "pathString": "[0].[2]",
        "value": 123,
      }
    `)
  }

  expect(arraySpy).toHaveBeenCalledTimes(1)
  expect(numberSpy).toHaveBeenCalledTimes(3)
})

it('should throw an error if the value is undefined (required: true)', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5 })

  expect(valueSpy).not.toHaveBeenCalled()

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

  expect(valueSpy).not.toHaveBeenCalled()
})

it('should not throw an error if the value is undefined and not required', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5, required: false })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()

  expect(valueSpy).not.toHaveBeenCalled()
})

it('should pass correct path and key to test report callback', () => {
  const validator = array(string(), {
    test: (_value, report, path, key) => {
      expect(path).toEqual([])
      expect(key).toBe('items')
      report({ message: 'array test fail' })
    },
  })
  const rootValidator = object({ items: validator })

  try {
    rootValidator.validate({ items: ['a', 'b'] })
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "test",
        "constraint": {
          "code": "test",
        },
        "context": "value",
        "key": "items",
        "message": "array test fail",
        "path": [],
        "pathString": "items",
        "value": [
          "a",
          "b",
        ],
      }
    `)
  }
})

it('should throw an error if the test function throws', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const test = vi
    .fn()
    .mockImplementation((value: string[], report: TestReport) => {
      if (value.length > 0 && value.some((v) => v === 'boom')) {
        report({ message: 'cannot be boom' })
      }
    })

  const validator = array(itemValidator, { minLength: 2, test })

  expect(valueSpy).not.toHaveBeenCalled()

  try {
    validator.validate(['ok', 'ok', 'boom'])
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
        "message": "cannot be boom",
        "path": [],
        "pathString": "",
        "value": [
          "ok",
          "ok",
          "boom",
        ],
      }
    `)
  }

  expect(valueSpy).toHaveBeenCalledTimes(3)
})

it('should not throw an error if the test function does not throw', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const test = vi
    .fn()
    .mockImplementation((value: string[], report: TestReport) => {
      if (value.length > 0 && value.some((v) => v === 'boom')) {
        report({ message: 'cannot be boom' })
      }
    })

  const validator = array(itemValidator, {
    minLength: 2,
    required: false,
    maxLength: 10,
    test,
  })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['ok', 'ok', 'meh'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(3)
})

it('should throw an error if unique is true and array contains duplicates', () => {
  const itemValidator = string()
  const valueSpy = vi.spyOn(itemValidator, 'validate')
  const validator = array(itemValidator, { unique: true })

  expect(valueSpy).not.toHaveBeenCalled()

  try {
    validator.validate(['a', 'b', 'a'])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "unique",
        "constraint": {
          "code": "unique",
        },
        "context": "value",
        "key": "[2]",
        "message": "contains duplicate values",
        "path": [],
        "pathString": "[2]",
        "value": "a",
      }
    `)
  }

  expect(valueSpy).toHaveBeenCalledTimes(0)
})

it('should not throw an error if unique is true and array has no duplicates', () => {
  const itemValidator = string()
  const valueSpy = vi.spyOn(itemValidator, 'validate')
  const validator = array(itemValidator, { unique: true })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a', 'b', 'c'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(3)
})

it('should not throw an error if unique is false and array contains duplicates', () => {
  const itemValidator = string()
  const valueSpy = vi.spyOn(itemValidator, 'validate')
  const validator = array(itemValidator, { unique: false })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a', 'b', 'a'])
  }).not.toThrow()

  expect(valueSpy).toHaveBeenCalledTimes(3)
})

it('should handle unique validation with object values', () => {
  const itemValidator = string()
  const valueSpy = vi.spyOn(itemValidator, 'validate')
  const validator = array(itemValidator, { unique: true })

  expect(valueSpy).not.toHaveBeenCalled()

  const obj1 = { id: 1 }
  const obj2 = { id: 2 }
  // Same content as obj1, different reference
  const obj3 = { id: 1 }

  try {
    validator.validate([obj1, obj2, obj3])
    expect.fail('Should have thrown')
  } catch (error) {
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "unique",
        "constraint": {
          "code": "unique",
        },
        "context": "value",
        "key": "[2]",
        "message": "contains duplicate values",
        "path": [],
        "pathString": "[2]",
        "value": {
          "id": 1,
        },
      }
    `)
  }

  expect(valueSpy).toHaveBeenCalledTimes(0)
})

it('should include path and key when array item validation fails', () => {
  const validator = array(string({ minLength: 3 }))

  try {
    validator.validate(['valid', 'ab', 'also-valid'])
    expect.fail('Should have thrown an error')
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError)
    expect((error as ValidationError).toJSON()).toMatchInlineSnapshot(`
      {
        "code": "minLength",
        "constraint": {
          "code": "minLength",
          "minLength": 3,
        },
        "context": "value",
        "key": "[1]",
        "message": "is shorter than expected length 3",
        "path": [],
        "pathString": "[1]",
        "value": "ab",
      }
    `)
  }
})
