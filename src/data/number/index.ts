export class Number {
  /**
     * Add two numbers.
     */
  static add(a: number, b: number): number {
    return a + b;
  }

  /**
     * Subtract two numbers.
     */
  static subtract(a: number, b: number): number {
    return a - b;
  }

  /**
     * Multiply two numbers.
     */
  static multiply(a: number, b: number): number {
    return a * b;
  }

  /**
     * Divide two numbers.
     */
  static divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero.');
    }
    return a / b;
  }

  /**
     * Get the remainder of a division.
     */
  static remainder(a: number, b: number): number {
    return a % b;
  }

  /**
     * Check if a number is even.
     */
  static isEven(num: number): boolean {
    return num % 2 === 0;
  }

  /**
     * Check if a number is odd.
     */
  static isOdd(num: number): boolean {
    return num % 2 !== 0;
  }

  /**
     * Check if a number is positive.
     */
  static isPositive(num: number): boolean {
    return num > 0;
  }

  /**
     * Check if a number is negative.
     */
  static isNegative(num: number): boolean {
    return num < 0;
  }

  /**
     * Check if a number is zero.
     */
  static isZero(num: number): boolean {
    return num === 0;
  }

  /**
     * Get the absolute value of a number.
     */
  static abs(num: number): number {
    return Math.abs(num);
  }

  /**
     * Round a number to the nearest integer.
     */
  static round(num: number): number {
    return Math.round(num);
  }

  /**
     * Round a number up to the nearest integer.
     */
  static ceil(num: number): number {
    return Math.ceil(num);
  }

  /**
     * Round a number down to the nearest integer.
     */
  static floor(num: number): number {
    return Math.floor(num);
  }

  /**
     * Get the minimum of two numbers.
     */
  static min(a: number, b: number): number {
    return Math.min(a, b);
  }

  /**
     * Get the maximum of two numbers.
     */
  static max(a: number, b: number): number {
    return Math.max(a, b);
  }

  /**
     * Generate a random integer between a minimum and maximum value.
     */
  static random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
     * Convert degrees to radians.
     */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
     * Convert radians to degrees.
     */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
     * Format a number with a specific precision.
     */
  static format(num: number, precision: number = 2): string {
    return num.toFixed(precision);
  }

  /**
     * Check if a number is within a specified range.
     */
  static inRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }
}