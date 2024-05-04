import { expect, it } from 'vitest'
import { boolean } from '.'

it('should be able to create a boolean with no options defined', () => {
  const validateBoolean = boolean()

  expect(() => {
    validateBoolean(true)
  }).not.toThrow()
})

it('should throw an error if the value is not a boolean', () => {
  const validateBoolean = boolean()

  expect(() => {
    validateBoolean('true')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a boolean]`)
})

it('should throw an error if the value is undefined', () => {
  const validateBoolean = boolean()

  expect(() => {
    validateBoolean(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should not throw an error if the value is undefined and not required', () => {
  const validateBoolean = boolean({ required: false })

  expect(() => {
    validateBoolean(undefined)
  }).not.toThrow()
})
