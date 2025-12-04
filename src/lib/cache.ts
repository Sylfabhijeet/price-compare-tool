// Simple in-memory cache implementation

import NodeCache from 'node-cache';

// Create cache instance with 24-hour TTL
const cache = new NodeCache({
    stdTTL: 24 * 60 * 60, // 24 hours in seconds
    checkperiod: 60 * 60, // Check for expired keys every hour
    useClones: false,
});

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
}

/**
 * Get value from cache
 */
export function getCache<T>(key: string): T | null {
    const value = cache.get<T>(key);
    return value !== undefined ? value : null;
}

/**
 * Set value in cache
 */
export function setCache<T>(key: string, value: T, options?: CacheOptions): void {
    if (options?.ttl) {
        cache.set(key, value, options.ttl);
    } else {
        cache.set(key, value);
    }
}

/**
 * Delete value from cache
 */
export function deleteCache(key: string): void {
    cache.del(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
    cache.flushAll();
}

/**
 * Check if key exists in cache
 */
export function hasCache(key: string): boolean {
    return cache.has(key);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return cache.getStats();
}

/**
 * Generate cache key for product URL
 */
export function generateProductCacheKey(url: string): string {
    return `product:${url}`;
}

/**
 * Generate cache key for search query
 */
export function generateSearchCacheKey(query: string): string {
    return `search:${query.toLowerCase()}`;
}

export default cache;
