[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / StringOptionsOneOf

# Interface: StringOptionsOneOf

## Properties

### alphabet?

> `optional` **alphabet**: `undefined`

#### Defined in

[src/string.ts:45](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L45)

---

### maxLength?

> `optional` **maxLength**: `undefined`

#### Defined in

[src/string.ts:43](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L43)

---

### minLength?

> `optional` **minLength**: `undefined`

#### Defined in

[src/string.ts:42](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L42)

---

### oneOf

> **oneOf**: `string`[]

#### Defined in

[src/string.ts:30](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L30)

---

### pattern?

> `optional` **pattern**: `undefined`

#### Defined in

[src/string.ts:44](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L44)

---

### required?

> `optional` **required**: `boolean`

Default is true

#### Defined in

[src/string.ts:35](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L35)

---

### test?

> `optional` **test**: [`TestFunction`](../type-aliases/TestFunction.md)\<`string`\>

Expects a function that receives the string value and throws an Error if it
is invalid.

#### Defined in

[src/string.ts:40](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L40)
