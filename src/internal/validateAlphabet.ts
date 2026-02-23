import { ValidationError } from '../ValidationError.js'

export const validateAlphabet = (
  alphabet: string,
  value: string,
  path?: string[],
  key?: string,
  context?: 'key' | 'value',
) => {
  for (const character of value) {
    if (!alphabet.includes(character)) {
      throw new ValidationError({
        message: `contains character '${character}' which is not in alphabet '${alphabet}'`,
        path: path ?? [],
        key,
        context: context ?? 'value',
        value,
        constraint: { code: 'alphabet', alphabet },
      })
    }
  }
}
