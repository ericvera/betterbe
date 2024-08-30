[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / array

# Function: array()

> **array**\<`T`\>(`itemValidator`, `options`): [`ArrayValidator`](../interfaces/ArrayValidator.md)

Returns a validation function that checks if a value is an array and
validates its items against a validator.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter       | Type                                                   | Description                                             |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| `itemValidator` | [`Value`](../type-aliases/Value.md)\<`T`\>             | A validation functions for each the items of the array. |
| `options`       | [`ArrayOptions`](../interfaces/ArrayOptions.md)\<`T`\> | -                                                       |

## Returns

[`ArrayValidator`](../interfaces/ArrayValidator.md)

## Defined in

[src/array.ts:33](https://github.com/ericvera/betterbe/blob/main/src/array.ts#L33)
