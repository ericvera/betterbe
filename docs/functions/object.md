[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / object

# Function: object()

> **object**\<`T`\>(`schema`, `options`): [`ObjectValidator`](../interfaces/ObjectValidator.md)\<`T`\>

Returns a validation function that checks if a value is an object and
validates its properties against a schema.

## Type Parameters

| Type Parameter         |
| ---------------------- |
| `T` _extends_ `object` |

## Parameters

| Parameter | Type                                                     | Description                                                      |
| --------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| `schema`  | [`Schema`](../type-aliases/Schema.md)\<`T`\>             | An object containing the validation functions for each property. |
| `options` | [`ObjectOptions`](../interfaces/ObjectOptions.md)\<`T`\> | -                                                                |

## Returns

[`ObjectValidator`](../interfaces/ObjectValidator.md)\<`T`\>

## Defined in

[src/object.ts:32](https://github.com/ericvera/betterbe/blob/main/src/object.ts#L32)
