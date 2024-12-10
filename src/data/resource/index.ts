import { Collection } from 'collect.js';

export class Resource {
  protected data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
     * Factory method to handle both single items and collections.
     * 
     * @param data - The data to be handled. Can be a single item or a collection.
     * @returns A Collection of Resource instances.
     */
  public static collect(data: any) {
    if (typeof data.perPage === 'function') {
      return this.paginateable(data);
    }

    let items = data;

    if (items === undefined) {
      return undefined;
    }

    // Attempt to get items from a Collection if available
    try {
      items = data.all();
    } catch (error) {
      // If data is not a Collection, `data.all()` will throw an error
    }

    // If items is an array, convert it to a Collection of Resources
    if (Array.isArray(items)) {
      return this.collection(items);
    }

    // Otherwise, create a single Resource and wrap it in a Collection
    return this.make(items);
  }

  /**
     * Create a single Resource instance and wrap it in a Collection.
     * 
     * @param data - The data to be converted into a Resource.
     * @returns A Collection containing a single Resource instance.
     */
  public static make(data: any): Collection<Record<string, any>> {
    // Create a single Resource instance and wrap it in a Collection
    return new Collection([new (this as any)(data).resource()]);
  }

  /**
     * Convert an array of data items into a Collection of Resource instances.
     * 
     * @param data - The array of data items to be converted.
     * @returns A Collection of Resource instances.
     */
  public static collection(data: any): Collection<Record<string, any>> {
    // Map each item to a Resource instance and return as a Collection
    return new Collection(data.map((item: any) => new (this as any)(item).resource()));
  }

  /**
     * Convert paginated data into a paginated format with Collection.
     * 
     * @param data - An object containing paginated data and metadata.
     * @returns An object containing paginated data, current page, per page, total, etc.
     */
  public static paginate(data: {
        data: any[],
        current_page: number,
        per_page: number,
        total: number
    }): Record<string, any> {
    // Convert the paginated data into a Collection of Resources
    const collection = this.collect(data.data);
    return {
      // @ts-ignore
      items: collection.all(),
      current_page: data.current_page,
      per_page: data.per_page,
      total: data.total,
      last_page: Math.ceil(data.total / data.per_page),
      from: (data.current_page - 1) * data.per_page + 1,
      to: Math.min(data.current_page * data.per_page, data.total)
    };
  }

  private static paginateable(data: {
        data: any[],
        items: () => any[],
        currentPage: () => number,
        hasMorePages: () => boolean,
        lastPage: () => number,
        perPage: () => number,
        total: () => number
    }): Record<string, any> {
    const collection = this.collect(data.items());

    return {
      // @ts-ignore
      items: collection.all(),
      pagination: {
        current_page: data.currentPage(),
        has_more_pages: data.hasMorePages(),
        last_page: data.lastPage(),
        per_page: data.perPage(),
        total: data.total(),
      }
    };
  }

  /**
     * Convert the instance data to an array.
     * Should be implemented in subclasses to define the output format.
     * 
     * @returns The instance data as an array.
     */
  protected resource() {
    return this.data;
  }
}