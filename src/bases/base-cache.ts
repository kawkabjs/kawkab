import { cache } from '..';

export class BaseCache {
  // Static property to store temporary data.
  public static data:any;

  /**
     * Defines the default cache time-to-live (TTL) in seconds.
     * This method can be overridden in subclasses to specify a custom TTL.
     * @returns {number} The default TTL in seconds (1 hour by default).
     */
  static time(): number {
    return 60 * 60; // 1 hour default TTL
  }

  /**
     * Defines the cache key.
     * This method must be overridden in subclasses to provide a unique key for each cache.
     * @returns {string} A unique string identifier for the cache.
     */
  static key(): string {
    return ''; // Default implementation returns an empty string
  }

  /**
     * Defines the logic for generating or fetching the data to be cached.
     * This method should be overridden in subclasses to provide custom logic for data generation.
     * @returns {any} The data to be cached.
     */
  static handle(): any {
    return {}; // Default implementation returns an empty object
  }

  /**
     * Implements the caching logic.
     * - Checks if the cache already contains data for the specified key.
     * - If the key exists, it retrieves and returns the cached data.
     * - If the key does not exist, it generates new data using the `handle` method, 
     *   stores it in the cache, and returns the new data.
     * 
     * @param {object} data - Optional data that can be used or updated in the caching logic.
     * @returns {any} The cached data or newly generated data.
     */
  static cache(data: {} = {}): any {
    // Update the static `data` property with the provided input
    this.data = data;

    // Retrieve the unique cache key using the `key` method
    const key = this.key();

    // Check if the cache already contains data for the specified key
    if (cache.has(key)) {
      // If the data exists in the cache, retrieve and return it
      return cache.get(key);
    }

    // Generate new data using the `handle` method
    const value = this.handle();

    // Store the new data in the cache with the specified key and TTL
    cache.set(key, value, this.time());

    // Return the newly generated data
    return value;
  }
}
