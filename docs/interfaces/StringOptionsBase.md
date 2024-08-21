[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / StringOptionsBase

# Interface: StringOptionsBase

## Properties

### alphabet?

> `optional` **alphabet**: `string`

#### Defined in

[src/string.ts:15](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L15)

---

### maxLength?

> `optional` **maxLength**: `number`

#### Defined in

[src/string.ts:13](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L13)

---

### minLength?

> `optional` **minLength**: `number`

#### Defined in

[src/string.ts:12](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L12)

---

### oneOf?

> `optional` **oneOf**: `undefined`

#### Defined in

[src/string.ts:26](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L26)

---

### pattern?

> `optional` **pattern**: `RegExp`

#### Defined in

[src/string.ts:14](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L14)

---

### required?

> `optional` **required**: `boolean`

Default is true

#### Defined in

[src/string.ts:19](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L19)

---

### test?

> `optional` **test**: [`TestFunction`](../type-aliases/TestFunction.md)\<`string`\>

Expects a function that receives the string value and throws an Error if it
is invalid.

#### Defined in

[src/string.ts:24](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L24)
