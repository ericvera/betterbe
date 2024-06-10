[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / string

# Function: string()

> **string**(`options`): [`StringValidator`](../interfaces/StringValidator.md)

Returns a validation function that checks if a value is a string and
optionally validates its length, pattern, and alphabet.

## Parameters

| Parameter | Type                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :-------- | :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options` | [`StringOptions`](../type-aliases/StringOptions.md) | <p>An object containing the following properties:</p><ul><li>`minLength` (optional): The minimum length of the string.</li><li>`maxLength` (optional): The maximum length of the string.</li><li>`pattern` (optional): A regular expression that the string must match.</li><li>`alphabet` (optional): A string containing the allowed characters.</li><li>`required` (optional): Whether the value is required (default is `true`).</li></ul> |

## Returns

[`StringValidator`](../interfaces/StringValidator.md)

## Source

[src/string.ts:46](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L46)
