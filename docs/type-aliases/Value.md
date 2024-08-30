[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / Value

# Type Alias: Value\<TData\>

> **Value**\<`TData`\>: `TData` _extends_ `object` ? [`ObjectValidator`](../interfaces/ObjectValidator.md)\<`TData`\> : `TData` _extends_ `string` ? [`StringValidator`](../interfaces/StringValidator.md) : `TData` _extends_ `number` ? [`NumberValidator`](../interfaces/NumberValidator.md) : `TData` _extends_ `boolean` ? [`BooleanValidator`](../interfaces/BooleanValidator.md) : [`ValidatorBase`](../interfaces/ValidatorBase.md)

## Type Parameters

| Type Parameter |
| -------------- |
| `TData`        |

## Defined in

[src/types.ts:51](https://github.com/ericvera/betterbe/blob/main/src/types.ts#L51)
