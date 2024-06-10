[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / number

# Function: number()

> **number**(`options`): [`NumberValidator`](../interfaces/NumberValidator.md)

Returns a validation function that checks if a value is a number and
optionally validates its minimum, maximum, and integer properties.

## Parameters

| Parameter | Type                                              | Description                                                                                                                                                                                                                                                                                                                                 |
| :-------- | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options` | [`NumberOptions`](../interfaces/NumberOptions.md) | <p>An object containing the following properties:</p><ul><li>`min` (optional): The minimum value of the number.</li><li>`max` (optional): The maximum value of the number.</li><li>`integer` (optional): Whether the number must be an integer.</li><li>`required` (optional): Whether the value is required (default is `true`).</li></ul> |

## Returns

[`NumberValidator`](../interfaces/NumberValidator.md)

## Source

[src/number.ts:25](https://github.com/ericvera/betterbe/blob/main/src/number.ts#L25)
