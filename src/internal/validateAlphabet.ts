import { ValidationError } from '../ValidationError.js'

export const validateAlphabet = (
  alphabet: string,
  value: string,
  path?: string[],
  key?: string,
) => {
  for (const char of value) {
    if (!alphabet.includes(char)) {
      throw new ValidationError(
        'alphabet',
        `contains character '${char}' which is not in alphabet '${alphabet}'`,
        path,
        key,
        { alphabet, context: 'value' },
      )
    }
  }

  return
}
