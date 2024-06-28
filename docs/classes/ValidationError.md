[**betterbe**](../README.md) • **Docs**

---

[betterbe](../README.md) / ValidationError

# Class: ValidationError

## Extends

- `Error`

## Constructors

### new ValidationError()

> **new ValidationError**(`type`, `message`, `path`?, `key`?): [`ValidationError`](ValidationError.md)

#### Parameters

| Parameter | Type                                                            |
| :-------- | :-------------------------------------------------------------- |
| `type`    | [`ValidationErrorType`](../type-aliases/ValidationErrorType.md) |
| `message` | `string`                                                        |
| `path`?   | `string`[]                                                      |
| `key`?    | `string`                                                        |

#### Returns

[`ValidationError`](ValidationError.md)

#### Overrides

`Error.constructor`

#### Source

[src/ValidationError.ts:18](https://github.com/ericvera/betterbe/blob/main/src/ValidationError.ts#L18)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Source

node_modules/typescript/lib/lib.es2022.error.d.ts:24

---

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Source

node_modules/typescript/lib/lib.es5.d.ts:1077

---

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Source

node_modules/typescript/lib/lib.es5.d.ts:1076

---

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node_modules/typescript/lib/lib.es5.d.ts:1078

---

### type

> `readonly` **type**: [`ValidationErrorType`](../type-aliases/ValidationErrorType.md)

#### Source

[src/ValidationError.ts:16](https://github.com/ericvera/betterbe/blob/main/src/ValidationError.ts#L16)

---

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

| Parameter     | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### Inherited from

`Error.prepareStackTrace`

#### Source

node_modules/@types/node/globals.d.ts:28

---

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

| Parameter         | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Source

node_modules/@types/node/globals.d.ts:21
