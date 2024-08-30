import { expect, it, vi } from 'vitest'
import { array, number, string, ValidationError } from './index.js'

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
    ]
  `)
  expect(valueSpy.mock.calls[1]).toMatchInlineSnapshot(`
    [
      "hello",
      [],
      "[1]",
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

it('should throw an error if the array is shorter than expected', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { minLength: 2 })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a'])
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is shorter than expected length 2]`,
  )

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
    ]
  `)
})

it('should throw if the arr is longer than maxLength', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5 })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['a', 'b', 'c', 'd', 'e', 'f'])
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: is longer than expected length 5]`,
  )

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
    ]
  `)
  expect(valueSpy.mock.calls[1]).toMatchInlineSnapshot(`
    [
      "b",
      [],
      "[1]",
    ]
  `)
  expect(valueSpy.mock.calls[2]).toMatchInlineSnapshot(`
    [
      "c",
      [],
      "[2]",
    ]
  `)
  expect(valueSpy.mock.calls[3]).toMatchInlineSnapshot(`
    [
      "d",
      [],
      "[3]",
    ]
  `)
  expect(valueSpy.mock.calls[4]).toMatchInlineSnapshot(`
    [
      "e",
      [],
      "[4]",
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

  expect(() => {
    validator.validate([
      [1, 4, 123],
      [0, 5],
    ])
  }).toThrowErrorMatchingInlineSnapshot(
    `[Error: '[2]' is greater than maximum 10 at path '[0]']`,
  )

  expect(arraySpy).toHaveBeenCalledTimes(1)
  expect(numberSpy).toHaveBeenCalledTimes(3)
})

it('should throw an error if the value is undefined (required: true)', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const validator = array(itemValidator, { maxLength: 5 })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)

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

it('should throw an error if the test function throws', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const test = vi.fn().mockImplementation((value: string[]) => {
    if (value.length > 0 && value.some((v) => v === 'boom')) {
      throw new ValidationError('test', 'cannot be boom', [], '[0]')
    }
  })

  const validator = array(itemValidator, { minLength: 2, test })

  expect(valueSpy).not.toHaveBeenCalled()

  expect(() => {
    validator.validate(['ok', 'ok', 'boom'])
  }).toThrowErrorMatchingInlineSnapshot(`[Error: '[0]' cannot be boom]`)

  expect(valueSpy).toHaveBeenCalledTimes(3)
})

it('should not throw an error if the test function does not throw', () => {
  const itemValidator = string()

  const valueSpy = vi.spyOn(itemValidator, 'validate')

  const test = vi.fn().mockImplementation((value: string[]) => {
    if (value.length > 0 && value.some((v) => v === 'boom')) {
      throw new ValidationError('test', 'cannot be boom', [], '[0]')
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
