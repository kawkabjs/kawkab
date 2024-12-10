export class BaseEnum<T extends Record<string, any>> {
  private static enumValues: any;

  // Set the values for the Enum
  static set<T extends Record<string, any>>(values: T) {
    (this as any).enumValues = values;
  }

  // Get all values as an array
  static values(): string[] {
    return Object.values(this.enumValues);
  }

  // Get the value associated with a specific key
  static get(key: string): string | undefined {
    return this.enumValues[key as keyof typeof this.enumValues];
  }
}
