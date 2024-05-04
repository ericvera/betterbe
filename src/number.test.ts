import { expect, it } from 'vitest'
import { number } from '.'

it('should be able to create a number with no options defined', () => {
  const validateNumber = number()

  expect(() => {
    validateNumber(42)
  }).not.toThrow()
})

it('should throw an error if the value is not a number', () => {
  const validateNumber = number()

  expect(() => {
    validateNumber('42')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a number]`)
})

it('should throw an error if the value is undefined', () => {
  const validateNumber = number()

  expect(() => {
    validateNumber(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should throw an error if the value is less than the minimum', () => {
  const validateNumber = number({ min: 3 })

  expect(() => {
    validateNumber(2)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is less than minimum 3]`)
})

it('should throw an error if the value is greater than the maximum', () => {
  const validateNumber = number({ max: 3 })

  expect(() => {
    validateNumber(4)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is greater than maximum 3]`)
})

it('should throw an error if the value is not an integer', () => {
  const validateNumber = number({ integer: true })

  expect(() => {
    validateNumber(3.14)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not an integer]`)
})

it('should not throw an error if the value is an integer', () => {
  const validateNumber = number({ integer: true })

  expect(() => {
    validateNumber(3)
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and not required', () => {
  const validateNumber = number({ required: false })

  expect(() => {
    validateNumber(undefined)
  }).not.toThrow()
})

it('should not throw an error if the value is undefined and required', () => {
  const validateNumber = number({ required: true })

  expect(() => {
    validateNumber(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should not throw an error if the value is a number and not required', () => {
  const validateNumber = number({ required: false })

  expect(() => {
    validateNumber(42)
  }).not.toThrow()
})

it('should not throw with all the options and a valid value', () => {
  const validateNumber = number({
    min: 3,
    max: 10000000000,
    integer: true,
    required: true,
  })

  expect(() => {
    validateNumber(10000000000)
  }).not.toThrow()
})

it('should throw no a negative number when min is 0', () => {
  const validateNumber = number({ min: 0 })

  expect(() => {
    validateNumber(-1)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is less than minimum 0]`)
})
