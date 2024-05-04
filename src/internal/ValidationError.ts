export class ValidationError extends Error {
  constructor(message: string, path?: string[], key?: string) {
    let errorMessage = message

    if (path !== undefined && path.length > 0) {
      errorMessage += ` at path '${path.join('.')}'`
    }

    if (key !== undefined) {
      errorMessage = `'${key}' ${errorMessage}`
    }

    super(errorMessage)
  }
}
