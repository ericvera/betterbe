import { expect, it } from 'vitest'
import { boolean } from './index.js'

it('should be able to create a boolean with no options defined', () => {
  const validator = boolean()

  expect(() => {
    validator.validate(true)
  }).not.toThrow()
})

it('should throw an error if the value is not a boolean', () => {
  const validator = boolean()

  expect(() => {
    validator.validate('true')
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is not a boolean]`)
})

it('should throw an error if the value is undefined', () => {
  const validator = boolean()

  expect(() => {
    validator.validate(undefined)
  }).toThrowErrorMatchingInlineSnapshot(`[Error: is required]`)
})

it('should not throw an error if the value is undefined and not required', () => {
  const validator = boolean({ required: false })

  expect(() => {
    validator.validate(undefined)
  }).not.toThrow()
})
