[betterbe](../README.md) • Docs

---

[betterbe](../README.md) / number

# Function: number()

> **number**(`options`): [`ValidationFunction`](../type-aliases/ValidationFunction.md)

Returns a validation function that checks if a value is a number and
optionally validates its minimum, maximum, and integer properties.

## Parameters

| Parameter | Type                                              | Description                                                                                                                                                                                                                                                                                                             |
| :-------- | :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options` | [`NumberOptions`](../interfaces/NumberOptions.md) | An object containing the following properties:<br />- `min` (optional): The minimum value of the number.<br />- `max` (optional): The maximum value of the number.<br />- `integer` (optional): Whether the number must be an integer.<br />- `required` (optional): Whether the value is required (default is `true`). |

## Returns

[`ValidationFunction`](../type-aliases/ValidationFunction.md)

## Source

[number.ts:26](https://github.com/ericvera/betterbe/blob/main/src/number.ts#L26)
