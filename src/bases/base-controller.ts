import { trans } from '..';

export class BaseController {
  t(key: string, replacements: Record<string, string> = {}, fallback?: string): string {
    return trans.get(key, replacements, fallback);
  }
}