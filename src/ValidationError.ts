export type ValidationErrorType =
  | 'required'
  | 'alphabet'
  | 'type'
  | 'min'
  | 'max'
  | 'int'
  | 'unknown-keys'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'one-of'
  | 'test'

export interface ValidationErrorMeta {
  maxLength?: number
  minLength?: number
  pattern?: RegExp
  oneOf?: string[]
  type?: string
  alphabet?: string
  min?: number
  max?: number
}

export class ValidationError extends Error {
  public readonly type: ValidationErrorType
  public readonly meta: ValidationErrorMeta

  constructor(
    type: ValidationErrorType,
    message: string,
    path?: string[],
    key?: string,
    meta: ValidationErrorMeta = {},
  ) {
    let errorMessage = message

    if (path !== undefined && path.length > 0) {
      errorMessage += ` at path '${path.join('.')}'`
    }

    if (key !== undefined) {
      errorMessage = `'${key}' ${errorMessage}`
    }

    super(errorMessage)

    this.type = type
    this.meta = meta
  }
}
