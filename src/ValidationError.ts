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

export class ValidationError extends Error {
  public readonly type: ValidationErrorType

  constructor(
    type: ValidationErrorType,
    message: string,
    path?: string[],
    key?: string,
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
  }
}
