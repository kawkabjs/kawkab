import * as dotenv from "dotenv";

export class Env {
  /**
   * Load the environment variables from the .env file.
   * @returns void
   */
  public init(): this {
    const env =
      process.env.NODE_ENV === "production" ? "production" : "development";

    const envFile = `.env.${env}`;

    dotenv.config({ path: envFile });

    return this;
  }

  /**
   * Check if an environment variable exists.
   * @param key The name of the environment variable.
   * @returns True if the variable exists, false otherwise.
   */
  has(key: string): boolean {
    return process.env.hasOwnProperty(key);
  }

  /**
   * Get the value of an environment variable, with support for placeholder replacement.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found.
   * @returns The value of the environment variable, or the default value if not found.
   */
  get(key: string, defaultValue: string = ""): string {
    const value = process.env[key] ?? defaultValue;
    return this.replacePlaceholders(value);
  }

  /**
   * Get the boolean value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the key is not set or not a valid boolean value.
   * @returns True if the value is "true" or "1", false if "false" or "0", defaultValue otherwise.
   */
  bool(key: string, defaultValue: boolean = false): boolean {
    const value = this.get(key);

    if (value === undefined || value === null) {
      return defaultValue;
    }

    const lowercaseValue = String(value).trim().toLowerCase();

    switch (lowercaseValue) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
        return false;
      default:
        return defaultValue;
    }
  }

  /**
   * Get the numeric value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found or not a number.
   * @returns The numeric value of the environment variable, or the default value if not found.
   */
  number(key: string, defaultValue: number = 0): number {
    const value = this.get(key);
    return value !== undefined ? Number(value) : defaultValue;
  }

  /**
   * Get the string value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found.
   * @returns The string value of the environment variable, or the default value if not found.
   */
  string(key: string, defaultValue: string = ""): string {
    return this.get(key, defaultValue);
  }

  /**
   * Get the JSON-parsed value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found or parsing fails.
   * @returns The parsed JSON value, or the default value if parsing fails.
   */
  json(key: string, defaultValue: any = {}): any {
    const value = this.get(key, "");
    try {
      return JSON.parse(value);
    } catch (e) {
      return defaultValue;
    }
  }

  /**
   * Get the array value of an environment variable, split by a delimiter.
   * @param key The name of the environment variable.
   * @param delimiter The delimiter to use for splitting the string.
   * @param defaultValue The default value to return if the variable is not found.
   * @returns An array of strings split by the delimiter, or the default value if not found.
   */
  array(
    key: string,
    delimiter: string = ",",
    defaultValue: string[] = []
  ): string[] {
    const value = this.get(key, "");
    return value ? value.split(delimiter) : defaultValue;
  }

  /**
   * Get the integer value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found or not an integer.
   * @returns The integer value of the environment variable, or the default value if not found.
   */
  int(key: string, defaultValue: number = 0): number {
    const value = this.number(key, defaultValue);
    return Math.floor(value);
  }

  /**
   * Get the float value of an environment variable.
   * @param key The name of the environment variable.
   * @param defaultValue The default value to return if the variable is not found or not a float.
   * @returns The float value of the environment variable, or the default value if not found.
   */
  float(key: string, defaultValue: number = 0.0): number {
    return this.number(key, defaultValue);
  }

  /**
   * Set the value of an environment variable.
   * @param key The name of the environment variable.
   * @param value The value to set for the environment variable.
   */
  set(key: string, value: string): void {
    process.env[key] = value;
  }

  /**
   * Delete an environment variable.
   * @param key The name of the environment variable.
   */
  delete(key: string): void {
    delete process.env[key];
  }

  /**
   * Replace placeholders in the format ${VAR} with their corresponding values from the environment.
   * @param value The string value with potential placeholders.
   * @returns The string with placeholders replaced.
   */
  private replacePlaceholders(value: string): string {
    return value.replace(/\${(.*?)}/g, (_, varName) => {
      return process.env[varName] || "";
    });
  }
}
