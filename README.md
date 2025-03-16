# betterbe

**A minimally flexible data validator**

[![github license](https://img.shields.io/github/license/ericvera/betterbe.svg?style=flat-square)](https://github.com/ericvera/betterbe/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/betterbe.svg?style=flat-square)](https://npmjs.org/package/betterbe)

## Features

- Props are required by default
- Strict by default (no type coercion)
- No unknown properties allowed
- Lightweight with no dependencies
- TypeScript-first design

## Installation

```bash
# npm
npm install betterbe

# yarn
yarn add betterbe
```

## Basic Example

```ts
import { boolean, number, object, string } from 'betterbe'

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

// This is not expected to throw (valid input)
validateMessage.validate({
  from: { uid: '1234567890' },
  message: 'Hello, World!',
  utcTime: 1630000000,
})

// This is expected to throw as character `-` is not valid in the uid alphabet
validateMessage.validate({
  from: { uid: '1234567-90' },
  message: 'Hello, World!',
  utcTime: 1630000000,
})
```

## API Reference

### String Validator

```ts
import { string } from 'betterbe'

// Basic usage
const validateName = string()

// With options
const validateUsername = string({
  minLength: 3,
  maxLength: 20,
  pattern: /^[a-zA-Z0-9_]+$/,
  required: true,
})

// With alphabet restriction
const validateDigitCode = string({
  alphabet: '0123456789',
  minLength: 6,
  maxLength: 6,
})

// With oneOf (enumeration)
const validateColor = string({
  oneOf: ['red', 'green', 'blue'],
})

// With custom test function
const validateEmail = string({
  test: (value) => {
    if (!value.includes('@')) {
      throw new Error('Invalid email format')
    }
  },
})
```

Options:

- `minLength`: Minimum string length
- `maxLength`: Maximum string length
- `pattern`: RegExp pattern the string must match
- `alphabet`: String of allowed characters
- `required`: Whether the value is required (default: `true`)
- `test`: Custom validation function
- `oneOf`: Array of allowed string values (cannot be used with other string options)

### Number Validator

```ts
import { number } from 'betterbe'

// Basic usage
const validateAge = number()

// With options
const validatePositiveInteger = number({
  min: 1,
  integer: true,
})

// With range
const validatePercentage = number({
  min: 0,
  max: 100,
})

// Optional number
const validateOptionalCount = number({
  required: false,
})
```

Options:

- `min`: Minimum value
- `max`: Maximum value
- `integer`: Whether the number must be an integer
- `required`: Whether the value is required (default: `true`)

### Boolean Validator

```ts
import { boolean } from 'betterbe'

// Basic usage
const validateIsActive = boolean()

// Optional boolean
const validateOptionalFlag = boolean({
  required: false,
})
```

Options:

- `required`: Whether the value is required (default: `true`)

### Array Validator

```ts
import { array, string, number } from 'betterbe'

// Array of strings
const validateTags = array(string())

// Array of numbers with length constraints
const validateScores = array(number(), {
  minLength: 1,
  maxLength: 10,
})

// Array with unique values
const validateUniqueIds = array(string(), {
  unique: true,
})

// Optional array
const validateOptionalItems = array(string(), {
  required: false,
})

// With custom test function
const validateSortedNumbers = array(number(), {
  test: (values) => {
    for (let i = 1; i < values.length; i++) {
      if (values[i] < values[i - 1]) {
        throw new Error('Array must be sorted in ascending order')
      }
    }
  },
})
```

Options:

- `minLength`: Minimum array length
- `maxLength`: Maximum array length
- `required`: Whether the value is required (default: `true`)
- `unique`: Whether array values must be unique (default: `false`)
- `test`: Custom validation function

### Object Validator

```ts
import { object, string, number, boolean } from 'betterbe'

// Basic usage
const validateUser = object({
  name: string(),
  age: number(),
  isActive: boolean(),
})

// Nested objects
const validatePost = object({
  title: string(),
  content: string(),
  author: object({
    id: string(),
    name: string(),
  }),
  published: boolean(),
})

// Optional object
const validateOptionalMetadata = object(
  {
    tags: array(string()),
  },
  {
    required: false,
  },
)

// With custom test function
const validateCredentials = object(
  {
    username: string(),
    password: string(),
  },
  {
    test: (value) => {
      if (value.username === value.password) {
        throw new Error('Username and password cannot be the same')
      }
    },
  },
)
```

Options:

- `required`: Whether the value is required (default: `true`)
- `test`: Custom validation function

## Error Handling

The library throws `ValidationError` instances when validation fails. These errors contain:

- `type`: The type of validation that failed (e.g., 'required', 'minLength', 'pattern')
- `message`: A human-readable error message
- `meta`: Additional metadata about the validation that failed

Example:

```ts
import { string } from 'betterbe'

const validateUsername = string({ minLength: 3 })

try {
  validateUsername.validate('ab')
} catch (error) {
  console.log(error.type) // 'minLength'
  console.log(error.message) // "'username' must be at least 3 characters"
  console.log(error.meta) // { minLength: 3 }
}
```

## License

MIT
