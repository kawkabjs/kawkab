
export class String {
  /**
     * Trim the whitespace from the beginning and end of the string
     */
  trim(value: string): string {
    return value.trim();
  }

  /**
     * Convert the string to lowercase
     */
  lower(value: string): string {
    return value.toLowerCase();
  }

  /**
     * Convert the string to uppercase
     */
  upper(value: string): string {
    return value.toUpperCase();
  }

  /**
     * Get the length of the string
     */
  length(value: string): number {
    return value.length;
  }

  /**
     * Check if the string contains a specific substring
     */
  contains(haystack: string, needle: string): boolean {
    return haystack.includes(needle);
  }

  /**
     * Check if the string starts with a specific substring
     */
  startsWith(haystack: string, needle: string): boolean {
    return haystack.startsWith(needle);
  }

  /**
     * Check if the string ends with a specific substring
     */
  endsWith(haystack: string, needle: string): boolean {
    return haystack.endsWith(needle);
  }

  /**
     * Replace the first occurrence of a substring with another string
     */
  replaceFirst(haystack: string, search: string, replace: string): string {
    return haystack.replace(search, replace);
  }

  /**
     * Replace the last occurrence of a substring with another string
     */
  replaceLast(haystack: string, search: string, replace: string): string {
    const index = haystack.lastIndexOf(search);
    if (index === -1) {
      return haystack;
    }
    return haystack.substring(0, index) + replace + haystack.substring(index + search.length);
  }

  /**
     * Generate a random string of the specified length
     */
  random(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
     * Convert string to camelCase
     */
  camel(value: string): string {
    return value.replace(/[_-](\w)/g, (_, c) => c ? c.toUpperCase() : '').replace(/^\w/, c => c.toLowerCase());
  }

  /**
     * Convert string to snake_case
     */
  snake(value: string): string {
    return value.replace(/[\sA-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
  }

  /**
     * Convert string to kebab-case
     */
  kebab(value: string): string {
    return value.replace(/[\sA-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
  }

  /**
     * Convert string to URL-friendly slug
     */
  slug(value: string): string {
    return value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
  }

  /**
     * Get the substring after a specific substring in the string
     */
  after(value: string, search: string) {
    return value.includes(search) ? value.split(search).pop() : value;
  }

  /**
     * Get the substring after the last occurrence of a substring in the string
     */
  afterLast(value: string, search: string): string {
    return value.includes(search) ? value.split(search).slice(-1)[0] : value;
  }

  /**
     * Remove non-ASCII characters from the string
     */
  ascii(value: string): string {
    return value.replace(/[^\x00-\x7F]/g, '');
  }

  /**
     * Get the substring before a specific substring in the string
     */
  before(value: string, search: string): string {
    return value.includes(search) ? value.split(search)[0] : value;
  }

  /**
     * Get the substring before the last occurrence of a substring in the string
     */
  beforeLast(value: string, search: string): string {
    return value.includes(search) ? value.substring(0, value.lastIndexOf(search)) : value;
  }

  /**
     * Get the substring between two substrings in the string
     */
  between(value: string|any, start: string, end: string): string {
    return value.split(start).pop().split(end)[0];
  }

  /**
     * Get the substring between the first occurrence of two substrings in the string
     */
  betweenFirst(value: string, start: string, end: string): string {
    return value.includes(start) && value.includes(end) ? value.split(start)[1].split(end)[0] : value;
  }

  /**
     * Get the character at a specific index in the string
     */
  charAt(value: string, index: number): string {
    return value.charAt(index);
  }

  /**
     * Remove a specified number of characters from the beginning of the string
     */
  chopStart(value: string, count: number): string {
    return value.slice(count);
  }

  /**
     * Remove a specified number of characters from the end of the string
     */
  chopEnd(value: string, count: number): string {
    return value.slice(0, -count);
  }

  /**
     * Check if all specified substrings are present in the string
     */
  containsAll(value: string, needles: string[]): boolean {
    return needles.every(needle => value.includes(needle));
  }

  /**
     * Extract an excerpt from the string surrounding a specific phrase
     */
  excerpt(value: string, phrase: string, options: { radius?: number; omission?: string } = {}): string | null {
    const { radius = 100, omission = '...' } = options;
    const index = value.indexOf(phrase);
    if (index === -1) return null;

    const start = Math.max(index - radius, 0);
    const end = Math.min(index + phrase.length + radius, value.length);

    return (start > 0 ? omission : '') + value.slice(start, end) + (end < value.length ? omission : '');
  }

  /**
     * Ensure the string ends with a specified string
     */
  finish(value: string, cap: string): string {
    return value.endsWith(cap) ? value : value + cap;
  }

  /**
     * Convert the string to a headline format (capitalize each word)
     */
  headline(value: string): string {
    return value.replace(/(\w)(\w*)/g, (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase());
  }

  /**
     * Convert inline Markdown formatting to HTML
     */
  inlineMarkdown(value: string): string {
    // Basic Markdown inline formatting conversion
    return value
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>');
  }

  /**
     * Check if the string matches a specified pattern
     */
  is(value: string, pattern: string): boolean {
    return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(value);
  }

  /**
     * Check if the string contains only ASCII characters
     */
  isAscii(value: string): boolean {
    return /^[\x00-\x7F]*$/.test(value);
  }

  /**
     * Check if the string is a valid JSON format
     */
  isJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
     * Check if the string is a valid ULID format
     */
  isUlid(value: string): boolean {
    // Basic ULID validation regex
    return /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/.test(value);
  }

  /**
     * Check if the string is a valid URL format
     */
  isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
     * Check if the string is a valid UUID format
     */
  isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4-9][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(value);
  }

  /**
     * Convert the first character of the string to lowercase
     */
  lcfirst(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  /**
     * Limit the length of the string, appending an ellipsis (...) if truncated
     */
  limit(value: string, limit: number = 100, end: string = '...'): string {
    return value.length > limit ? value.substring(0, limit) + end : value;
  }

  /**
     * Pad both sides of the string with a specified character, up to a specified length
     */
  padBoth(value: string, length: number, pad: string = ' '): string {
    if (value.length >= length) return value;
    const left = Math.floor((length - value.length) / 2);
    const right = length - value.length - left;
    return pad.repeat(left) + value + pad.repeat(right);
  }

  /**
     * Pad the left side of the string with a specified character, up to a specified length
     */
  padLeft(value: string, length: number, pad: string = ' '): string {
    return value.padStart(length, pad);
  }

  /**
     * Pad the right side of the string with a specified character, up to a specified length
     */
  padRight(value: string, length: number, pad: string = ' '): string {
    return value.padEnd(length, pad);
  }

  /**
     * Pluralize the string based on a count, defaulting to appending 's' if count is not 1
     */
  plural(value: string, count: number = 2): string {
    return count === 1 ? value : value + 's';
  }

  /**
     * Remove all whitespace from the string
     */
  removeWhitespace(value: string): string {
    return value.replace(/\s+/g, '');
  }

  /**
     * Repeat the string a specified number of times
     */
  repeat(value: string, times: number): string {
    return value.repeat(times);
  }

  /**
     * Reverse the characters in the string
     */
  reverse(value: string): string {
    return value.split('').reverse().join('');
  }

  /**
     * Rotate the string by a specified number of positions (positive for right, negative for left)
     */
  rotate(value: string, positions: number): string {
    const amount = ((positions % value.length) + value.length) % value.length; // Normalize negative positions
    return value.slice(-amount) + value.slice(0, -amount);
  }

  /**
     * Convert the string to a simplified form suitable for use as a URL slug
     */
  simplifySlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
  }

  /**
     * Sort the characters in the string alphabetically
     */
  sort(value: string): string {
    return value.split('').sort().join('');
  }

  /**
     * Split the string into an array of substrings based on a separator string
     */
  split(value: string, separator: string): string[] {
    return value.split(separator);
  }

  /**
     * Shuffle the characters in the string
     */
  shuffle(value: string): string {
    const array = value.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  /**
     * Strip HTML tags from the string
     */
  stripTags(value: string): string {
    return value.replace(/<[^>]*>?/gm, '');
  }

  /**
     * Convert the string to title case (capitalize each word, except specified exclusions)
     */
  title(value: string, exclusions: string[] = []): string {
    return value
      .toLowerCase()
      .replace(/(\b\w)/gi, (char) => exclusions.includes(char) ? char : char.toUpperCase());
  }

  /**
     * Transform the string by applying a callback function to each character
     */
  transform(value: string, callback: (char: string) => string): string {
    return value.split('').map(callback).join('');
  }

  /**
     * Trim characters from the left side of the string
     */
  trimLeft(value: string, char: string = ' '): string {
    return value.replace(new RegExp(`^${char}+`), '');
  }

  /**
     * Trim characters from the right side of the string
     */
  trimRight(value: string, char: string = ' '): string {
    return value.replace(new RegExp(`${char}+$`), '');
  }

  /**
     * Truncate the string to a specified length, replacing any overflow with an ellipsis (...)
     */
  truncate(value: string, length: number, end: string = '...'): string {
    return value.length > length ? value.slice(0, length - end.length) + end : value;
  }

  /**
     * Unescape HTML entities in the string
     */
  unescapeHtml(value: string): string {
    return value.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, '\'');
  }

  /**
     * Convert the first character of each word in the string to uppercase
     */
  ucwords(value: string): string {
    return value.replace(/\b\w/g, char => char.toUpperCase());
  }

  /**
     * URL-encode the string
     */
  urlencode(value: string): string {
    return encodeURIComponent(value);
  }

  /**
     * URL-decode the string
     */
  urldecode(value: string): string {
    return decodeURIComponent(value);
  }

  /**
     * Convert the string to a UUID format (32 hexadecimal characters, separated by hyphens)
     */
  uuid(value: string): string {
    return value.replace(/[^\da-f]/gi, '').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
  }

  /**
     * Convert the first character of the string to uppercase
     */
  ucfirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
