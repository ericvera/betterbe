export const getRequiredProp =
  <T>(object: Record<string, T>) =>
  (key: string): T => {
    if (typeof object !== 'object') {
      throw new Error('Expected object')
    }

    const value = object[key]

    if (value === undefined || value === null) {
      throw new Error(`Property '${key.toString()}' is unexpectedly undefined`)
    }

    return value
  }
