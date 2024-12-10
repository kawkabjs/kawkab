// @ts-nocheck
import { z, ZodRawShape } from 'zod';
import { trans } from '../..';

class Validation {
  static check<T extends ZodRawShape>(
    data: object,
    schemaDefinition: T,
    fieldAliases: { [key: string]: string } | null = null
  ): boolean | { field: string, name: string, message: string }[] {
    const schema = z.object(schemaDefinition);
    const result = schema.safeParse(data);

    if (result.success) {
      return true;
    } else {
      return result.error.errors.map(error => {
        const field = error.path.join('.');
        const name = fieldAliases ? fieldAliases[error.path[0]] || field : field;

        return {
          field,
          name,
          message_original: error,
          // @ts-ignore
          message: this.getMessage(error)
        };
      });
    }
  }

  private static getMessage(error: z.ZodIssue) {
    switch (error.code) {
    case 'invalid_type':
      const received = error.received;
      if (received === 'undefined') {
        return trans.get('plugins.validation.errors.invalid_type_received_undefined', error, error.code.toUpperCase());
      } else if (received === 'null') {
        return trans.get('plugins.validation.errors.invalid_type_received_null', error, error.code.toUpperCase());
      } else {
        return trans.get('plugins.validation.errors.invalid_type', error, error.code.toUpperCase())
          .replace(':expected', error.expected)
          .replace(':received', received);
      }
    case 'too_small':
      if (error.exact) {
        return trans.get(`plugins.validation.errors.too_small.${error.type}.exact`, error, error.code.toUpperCase());
      } else if (error.inclusive) {
        return trans.get(`plugins.validation.errors.too_small.${error.type}.inclusive`, error, error.code.toUpperCase());
      } else {
        return trans.get(`plugins.validation.errors.too_small.${error.type}.not_inclusive`, error, error.code.toUpperCase());
      }
    case 'too_big':
      if (error.exact) {
        return trans.get(`plugins.validation.errors.too_big.${error.type}.exact`, error, error.code.toUpperCase());
      } else if (error.inclusive) {
        return trans.get(`plugins.validation.errors.too_big.${error.type}.inclusive`, error, error.code.toUpperCase());
      } else {
        return trans.get(`plugins.validation.errors.too_big.${error.type}.not_inclusive`, error, error.code.toUpperCase());
      }
    case 'invalid_string':
      if (error.validation === 'email') {
        return trans.get('plugins.validation.errors.invalid_string.email', error, error.code.toUpperCase());
      } else if (error.validation === 'url') {
        return trans.get('plugins.validation.errors.invalid_string.url', error, error.code.toUpperCase());
      } else if (error.validation === 'uuid') {
        return trans.get('plugins.validation.errors.invalid_string.uuid', error, error.code.toUpperCase());
      } else if (error.validation === 'regex') {
        return trans.get('plugins.validation.errors.invalid_string.regex', error, error.code.toUpperCase());
      } else if (error.validation === 'datetime') {
        return trans.get('plugins.validation.errors.invalid_string.datetime', error, error.code.toUpperCase());
      } else if (error.validation === 'startsWith') {
        return trans.get('plugins.validation.errors.invalid_string.startsWith', error, error.code.toUpperCase());
      } else if (error.validation === 'endsWith') {
        return trans.get('plugins.validation.errors.invalid_string.endsWith', error, error.code.toUpperCase());
      }
    default:
      return trans.get(`plugins.validation.errors.${error.code}`, error, error.code.toUpperCase());
    }
  }
}

export {
  Validation,
  z as rule,
};
