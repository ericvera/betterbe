[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / ObjectOptions

# Interface: ObjectOptions\<T\>

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Properties

### required?

> `optional` **required**: `boolean`

Default is true

#### Defined in

[src/object.ts:22](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L22)

---

### test?

> `optional` **test**: [`TestFunction`](../type-aliases/TestFunction.md)\<`T`\>

Expects a function that receives the object value and throws an Error if it
is invalid.

#### Defined in

[src/object.ts:17](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L17)
