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
  | 'unique'

/**
 * Metadata associated with validation errors, providing additional context
 * and information about the specific validation failure.
 */
export interface ValidationErrorMeta {
  /** Maximum allowed length for string or array validation */
  maxLength?: number
  /** Minimum required length for string or array validation */
  minLength?: number
  /** Regular expression pattern that the value must match */
  pattern?: RegExp
  /** Array of allowed values for oneOf validation */
  oneOf?: string[] | readonly string[]
  /** Type information for validation errors */
  type?: string
  /** Allowed character set for alphabet validation */
  alphabet?: string
  /** Minimum allowed value for number validation */
  min?: number
  /** Maximum allowed value for number validation */
  max?: number
  /**
   * Context of the validation error - indicates whether the error is for a key
   * or value
   */
  context?: 'key' | 'value'
  /** The original key that failed validation (used in record validation) */
  originalKey?: string
  /** The property name that failed validation (used in object validation) */
  propertyName?: string
  /** The array index where validation failed (used in array validation) */
  arrayIndex?: number
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
