[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / object

# Function: object()

> **object**\<`T`\>(`schema`, `options`): [`ObjectValidator`](../interfaces/ObjectValidator.md)

Returns a validation function that checks if a value is an object and
validates its properties against a schema.

## Type parameters

| Type parameter         |
| :--------------------- |
| `T` _extends_ `object` |

## Parameters

| Parameter | Type                                                     | Description                                                           |
| :-------- | :------------------------------------------------------- | :-------------------------------------------------------------------- |
| `schema`  | [`Schema`](../type-aliases/Schema.md)\<`T`\>             | An object containing the validation functions for each<br />property. |
| `options` | [`ObjectOptions`](../interfaces/ObjectOptions.md)\<`T`\> | -                                                                     |

## Returns

[`ObjectValidator`](../interfaces/ObjectValidator.md)

## Source

[object.ts:27](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L27)
