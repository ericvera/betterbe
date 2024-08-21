[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / string

# Function: string()

> **string**(`options`): [`StringValidator`](../interfaces/StringValidator.md)

Returns a validation function that checks if a value is a string and
optionally validates its length, pattern, and alphabet.

## Parameters

| Parameter | Type                                                | Description                                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options` | [`StringOptions`](../type-aliases/StringOptions.md) | An object containing the following properties: - `minLength` (optional): The minimum length of the string. - `maxLength` (optional): The maximum length of the string. - `pattern` (optional): A regular expression that the string must match. - `alphabet` (optional): A string containing the allowed characters. - `required` (optional): Whether the value is required (default is `true`). |

## Returns

[`StringValidator`](../interfaces/StringValidator.md)

## Defined in

[src/string.ts:61](https://github.com/ericvera/betterbe/blob/main/src/string.ts#L61)
