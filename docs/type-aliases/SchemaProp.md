[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / SchemaProp

# Type alias: SchemaProp\<TData\>

> **SchemaProp**\<`TData`\>: `TData` _extends_ `object` ? [`ObjectValidator`](../interfaces/ObjectValidator.md)\<`TData`\> : `TData` _extends_ `string` ? [`StringValidator`](../interfaces/StringValidator.md) : `TData` _extends_ `number` ? [`NumberValidator`](../interfaces/NumberValidator.md) : `TData` _extends_ `boolean` ? [`BooleanValidator`](../interfaces/BooleanValidator.md) : `ValidatorBase`

## Type parameters

| Type parameter |
| :------------- |
| `TData`        |

## Source

[src/types.ts:46](https://github.com/ericvera/betterbe/blob/main/src/types.ts#L46)
