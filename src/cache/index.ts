import NodeCache from 'node-cache';

/**
 * CacheWrapper class to abstract the usage of NodeCache
 * This class provides a simplified interface for caching data.
 */
export class Cache {
  private cache: NodeCache;

  /**
   * Constructor to initialize the cache with optional TTL and check period.
   * 
   * @param ttl - Time-to-live for cache items in seconds.
   * @param checkPeriod - Time interval (in seconds) to check for expired cache keys.
   */
  constructor(ttl: number = 3600, checkPeriod: number = 600) {
    // Initialize NodeCache with given TTL and check period
    this.cache = new NodeCache({ stdTTL: ttl, checkperiod: checkPeriod });
  }

  /**
   * Get an item from the cache.
   * 
   * @param key - The key of the cached item.
   * @returns The cached item, or undefined if not found.
   */
  get(key: string): any {
    return this.cache.get(key);
  }

  /**
   * Set an item in the cache.
   * 
   * @param key - The key to store the item under.
   * @param value - The value to store in the cache.
   * @param ttl - Optional TTL for this specific cache item (in seconds).
   * @returns True if the item was successfully set, false otherwise.
   */
  set(key: string, value: any, ttl?: number): boolean {
    if(ttl){
      return this.cache.set(key, value, ttl);
    }else{
      return this.cache.set(key, value);
    }
  }

  /**
   * Delete an item from the cache.
   * 
   * @param key - The key of the item to delete.
   * @returns True if the item was deleted, false if not found.
   */
  delete(key: string) {
    return this.cache.del(key);
  }

  /**
   * Clear all items from the cache.
   * 
   * @returns True if cache was successfully cleared.
   */
  clear() {
    return this.cache.flushAll();
  }

  /**
   * Check if an item exists in the cache.
   * 
   * @param key - The key to check for existence.
   * @returns True if the item exists, false otherwise.
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}
