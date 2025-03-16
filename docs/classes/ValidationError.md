[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / ValidationError

# Class: ValidationError

## Extends

- `Error`

## Constructors

### new ValidationError()

> **new ValidationError**(`type`, `message`, `path`?, `key`?, `meta`?): [`ValidationError`](ValidationError.md)

#### Parameters

| Parameter | Type                                                            |
| --------- | --------------------------------------------------------------- |
| `type`    | [`ValidationErrorType`](../type-aliases/ValidationErrorType.md) |
| `message` | `string`                                                        |
| `path`?   | `string`[]                                                      |
| `key`?    | `string`                                                        |
| `meta`?   | [`ValidationErrorMeta`](../interfaces/ValidationErrorMeta.md)   |

#### Returns

[`ValidationError`](ValidationError.md)

#### Overrides

`Error.constructor`

#### Defined in

[src/ValidationError.ts:31](https://github.com/ericvera/betterbe/blob/main/src/ValidationError.ts#L31)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:26

---

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

---

### meta

> `readonly` **meta**: [`ValidationErrorMeta`](../interfaces/ValidationErrorMeta.md)

#### Defined in

[src/ValidationError.ts:29](https://github.com/ericvera/betterbe/blob/main/src/ValidationError.ts#L29)

---

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1076

---

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1078

---

### type

> `readonly` **type**: [`ValidationErrorType`](../type-aliases/ValidationErrorType.md)

#### Defined in

[src/ValidationError.ts:28](https://github.com/ericvera/betterbe/blob/main/src/ValidationError.ts#L28)

---

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

| Parameter     | Type         |
| ------------- | ------------ |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

#### Defined in

node_modules/@types/node/globals.d.ts:143

---

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node_modules/@types/node/globals.d.ts:145

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Defined in

node_modules/@types/node/globals.d.ts:136
