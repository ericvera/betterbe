[betterbe](../README.md) • Docs

---

[betterbe](../README.md) / boolean

# Function: boolean()

> **boolean**\<`T`\>(`options`): [`ValidationFunction`](../type-aliases/ValidationFunction.md)\<`T`\>

Returns a validation function that checks if a value is a boolean.

## Type parameters

| Type parameter | Value     |
| :------------- | :-------- |
| `T`            | `unknown` |

## Parameters

| Parameter | Type                                                | Description                                                                                                                     |
| :-------- | :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `options` | [`BooleanOptions`](../interfaces/BooleanOptions.md) | An object containing the following properties:<br />- `required` (optional): Whether the value is required (default is `true`). |

## Returns

[`ValidationFunction`](../type-aliases/ValidationFunction.md)\<`T`\>

## Source

[boolean.ts:19](https://github.com/ericvera/betterbe/blob/main/src/boolean.ts#L19)
