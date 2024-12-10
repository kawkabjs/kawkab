import { Resource } from '../data/resource';

export abstract class BaseResource extends Resource {
    public abstract resource(): Record<string, any>;
}