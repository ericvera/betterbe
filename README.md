# betterbe

**A minimally flexible data validator**

[![github license](https://img.shields.io/github/license/ericvera/betterbe.svg?style=flat-square)](https://github.com/ericvera/betterbe/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/betterbe.svg?style=flat-square)](https://npmjs.org/package/betterbe)

Features:

- Props are required by default
- Strict by default (no type cohersion)
- No unknown properties allowed

## Example

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

// This is not expected to throw
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

See [docs](docs/README.md)
