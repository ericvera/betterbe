[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / ArrayOptions

# Interface: ArrayOptions\<T\>

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Properties

### maxLength?

> `optional` **maxLength**: `number`

#### Defined in

[src/array.ts:13](https://github.com/ericvera/betterbe/blob/main/src/array.ts#L13)

---

### minLength?

> `optional` **minLength**: `number`

#### Defined in

[src/array.ts:12](https://github.com/ericvera/betterbe/blob/main/src/array.ts#L12)

---

### required?

> `optional` **required**: `boolean`

Default is true

#### Defined in

[src/array.ts:24](https://github.com/ericvera/betterbe/blob/main/src/array.ts#L24)

---

### test?

> `optional` **test**: [`TestFunction`](../type-aliases/TestFunction.md)\<`T`[]\>

Expects a function that receives the array value and throws an Error if it
is invalid.

#### Defined in

[src/array.ts:19](https://github.com/ericvera/betterbe/blob/main/src/array.ts#L19)
