import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ar';

// Register plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export class Time {
  private date: Dayjs;

  constructor(date: string | Date | number | null = null) {
    this.date = dayjs(date);
  }

  /**
   * Get the current date and time as a Time instance.
   * @returns A new Time instance with the current date and time.
   */
  static now(): Time {
    return new Time(new Date());
  }

  /**
   * Create a new Time instance with a specific date or datetime.
   * @param date - The date or datetime to initialize.
   * @returns A new Time instance.
   */
  static create(date: string | Date | number): Time {
    return new Time(date);
  }

  /**
   * Format the datetime using a specific format.
   * @param formatStr - The format string (default: 'YYYY-MM-DD HH:mm:ss').
   * @returns The formatted datetime string.
   */
  format(formatStr: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return this.date.format(formatStr);
  }

  /**
   * Get only the time portion in a specific format.
   * @param formatStr - The format string for time (default: 'HH:mm:ss').
   * @returns The formatted time string.
   */
  formatTime(formatStr: string = 'HH:mm:ss'): string {
    return this.date.format(formatStr);
  }

  /**
   * Add a specific amount of time to the current instance.
   * @param value - The amount to add.
   * @param unit - The unit of time (e.g., 'day', 'hour', 'minute', 'second').
   * @returns The updated Time instance.
   */
  add(value: number, unit: ManipulateType): Time {
    this.date = this.date.add(value, unit);
    return this;
  }

  /**
   * Subtract a specific amount of time from the current instance.
   * @param value - The amount to subtract.
   * @param unit - The unit of time (e.g., 'day', 'hour', 'minute', 'second').
   * @returns The updated Time instance.
   */
  subtract(value: number, unit: ManipulateType): Time {
    this.date = this.date.subtract(value, unit);
    return this;
  }

  /**
   * Get the hour portion of the datetime.
   * @returns The hour as a number (0-23).
   */
  getHour(): number {
    return this.date.hour();
  }

  /**
   * Get the minute portion of the datetime.
   * @returns The minute as a number (0-59).
   */
  getMinute(): number {
    return this.date.minute();
  }

  /**
   * Get the second portion of the datetime.
   * @returns The second as a number (0-59).
   */
  getSecond(): number {
    return this.date.second();
  }

  /**
   * Set a specific time for the current instance.
   * @param hour - The hour to set (0-23).
   * @param minute - The minute to set (0-59).
   * @param second - The second to set (0-59).
   * @returns The updated Time instance.
   */
  setTime(hour: number, minute: number, second: number = 0): Time {
    this.date = this.date.hour(hour).minute(minute).second(second);
    return this;
  }

  /**
   * Set the locale for time formatting and relative time
   * @param locale - The locale code (e.g., 'ar' for Arabic, 'en' for English)
   * @returns The current Time instance for chaining
   */
  setLocale(locale: string): Time {
    this.date = this.date.locale(locale);
    return this;
  }

  /**
   * Check if the current datetime is before another datetime.
   * @param otherDate - The datetime to compare with.
   * @returns True if the current datetime is before the other datetime.
   */
  isBefore(otherDate: string | Date | number): boolean {
    return this.date.isBefore(dayjs(otherDate));
  }

  /**
   * Check if the current datetime is after another datetime.
   * @param otherDate - The datetime to compare with.
   * @returns True if the current datetime is after the other datetime.
   */
  isAfter(otherDate: string | Date | number): boolean {
    return this.date.isAfter(dayjs(otherDate));
  }

  /**
   * Check if the current datetime is the same as another datetime.
   * @param otherDate - The datetime to compare with.
   * @returns True if the current datetime is the same as the other datetime.
   */
  isSame(otherDate: string | Date | number): boolean {
    return this.date.isSame(dayjs(otherDate));
  }

  /**
   * Calculate the difference between the current datetime and another datetime.
   * @param otherDate - The datetime to compare with.
   * @param unit - The unit of time for the difference (default: 'millisecond').
   * @returns The difference as a number.
   */
  diff(otherDate: string | Date | number, unit: ManipulateType = 'millisecond'): number {
    return this.date.diff(dayjs(otherDate), unit);
  }

  /**
   * Get relative time from another date
   * @param otherDate - The date to compare with
   * @returns Formatted relative time string
   */
  from(otherDate: Time | string | Date | number): string {
    return this.date.from(dayjs(otherDate instanceof Time ? otherDate.toDate() : otherDate));
  }

  /**
   * Convert the current datetime to a native JavaScript Date object.
   * @returns The JavaScript Date object.
   */
  toDate(): Date {
    return this.date.toDate();
  }

  /**
   * Convert the current datetime to a Unix timestamp.
   * @returns The timestamp as a number.
   */
  toTimestamp(): number {
    return this.date.unix();
  }
}
