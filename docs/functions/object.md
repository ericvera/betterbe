[betterbe](../README.md) • Docs

---

[betterbe](../README.md) / object

# Function: object()

> **object**\<`T`\>(`schema`): [`ValidationFunction`](../type-aliases/ValidationFunction.md)\<`T`\>

Returns a validation function that checks if a value is an object and
validates its properties against a schema.

## Type parameters

| Type parameter | Value     |
| :------------- | :-------- |
| `T`            | `unknown` |

## Parameters

| Parameter | Type                                  | Description                                                           |
| :-------- | :------------------------------------ | :-------------------------------------------------------------------- |
| `schema`  | [`Schema`](../type-aliases/Schema.md) | An object containing the validation functions for each<br />property. |

## Returns

[`ValidationFunction`](../type-aliases/ValidationFunction.md)\<`T`\>

## Source

[object.ts:14](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L14)
