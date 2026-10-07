/**
 * Discriminated union of validation error codes and their constraint params.
 * Use `constraint.code` to narrow the type and access code-specific fields.
 */
export type ValidationErrorConstraint =
  | { code: 'min'; min: number }
  | { code: 'max'; max: number }
  | { code: 'minLength'; minLength: number }
  | { code: 'maxLength'; maxLength: number }
  | { code: 'pattern'; pattern: string }
  | { code: 'one-of'; oneOf: readonly string[] }
  | { code: 'type'; expected: string; actual: string }
  | { code: 'alphabet'; alphabet: string }
  | { code: 'unique' }
  | { code: 'required' | 'int' | 'unknown-keys' }
  | { code: 'test'; data?: Record<string, unknown> }

/** Error code identifying the validation rule that failed. */
export type ValidationErrorCode = ValidationErrorConstraint['code']

/** Options for constructing a {@link ValidationError}. */
export interface ValidationErrorOptions {
  /**
   * Raw constraint text. The stored `Error.message` is prefixed with the path
   * when the path is non-empty (and with `key ` when context is `'key'`).
   */
  message: string
  /** Error code and constraint parameters. */
  constraint: ValidationErrorConstraint
  /** Parent path segments (e.g. `['items', '[0]']`). Defaults to `[]`. */
  path?: string[]
  /** Current segment (e.g. `'price'` or `'[0]'`). Omitted at root level. */
  key?: string | undefined
  /** Whether the error is for a key or value. Defaults to `'value'`. */
  context?: 'key' | 'value'
  /** The invalid value that failed validation. */
  value?: unknown
}

const joinPath = (segments: string[]): string =>
  segments
    .filter(Boolean)
    .reduce(
      (acc, segment) =>
        acc === '' || segment.startsWith('[')
          ? acc + segment
          : `${acc}.${segment}`,
      '',
    )

const formatMessage = (options: ValidationErrorOptions): string => {
  const path = options.path ?? []
  const segments = options.key !== undefined ? [...path, options.key] : path
  const joined = joinPath(segments)

  if (joined === '') {
    return options.message
  }

  const prefix =
    (options.context ?? 'value') === 'key' ? `key ${joined}` : joined

  return `${prefix}: ${options.message}`
}

/**
 * Error thrown when validation fails. Extends `Error` with structured metadata
 * for the validation rule, path, and invalid value.
 */
export class ValidationError extends Error {
  /** Parent path segments. */
  public readonly path: string[]
  /** Current path segment, if any. */
  public readonly key: string | undefined
  /** The invalid value that failed validation. */
  public readonly value: unknown
  /** Whether this error is for a key or value. */
  public readonly context: 'key' | 'value'
  /** Error code and constraint parameters. */
  public readonly constraint: ValidationErrorConstraint

  /**
   * Creates a ValidationError.
   *
   * @param options - Message, constraint, and optional path/value metadata.
   */
  constructor(options: ValidationErrorOptions) {
    super(formatMessage(options))

    this.name = 'ValidationError'
    this.path = options.path ?? []
    this.key = options.key
    this.value = options.value
    this.context = options.context ?? 'value'
    this.constraint = options.constraint
  }

  /** Error code identifying the validation rule that failed. */
  get code(): ValidationErrorCode {
    return this.constraint.code
  }

  /**
   * Full path as a string; object keys are dot-separated and array indexes
   * attach directly (e.g. `'items[0].price'`).
   */
  get pathString(): string {
    const segments =
      this.key !== undefined ? [...this.path, this.key] : this.path

    return joinPath(segments)
  }

  /** Returns a plain object suitable for logging or serialization. */
  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      key: this.key,
      pathString: this.pathString,
      value: this.value,
      context: this.context,
      constraint: this.constraint,
    }
  }
}
