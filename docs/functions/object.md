[betterbe](../README.md) • Docs

---

[betterbe](../README.md) / object

# Function: object()

> **object**(`schema`): [`ValidationFunction`](../type-aliases/ValidationFunction.md)

Returns a validation function that checks if a value is an object and
validates its properties against a schema.

## Parameters

| Parameter | Type                                  | Description                                                           |
| :-------- | :------------------------------------ | :-------------------------------------------------------------------- |
| `schema`  | [`Schema`](../type-aliases/Schema.md) | An object containing the validation functions for each<br />property. |

## Returns

[`ValidationFunction`](../type-aliases/ValidationFunction.md)

## Source

[object.ts:14](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L14)
