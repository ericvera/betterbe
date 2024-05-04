import { ValidationError } from './ValidationError'

export const validateAlphabet = (
  alphabet: string,
  value: string,
  path?: string[],
  key?: string,
) => {
  for (const char of value) {
    if (!alphabet.includes(char)) {
      throw new ValidationError(
        `contains character '${char}' which is not in alphabet '${alphabet}'`,
        path,
        key,
      )
    }
  }

  return
}
