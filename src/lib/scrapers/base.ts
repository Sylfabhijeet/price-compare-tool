// Base scraper class with common functionality

import axios, { AxiosInstance } from 'axios';
import { load } from 'cheerio';
import { getRandomUserAgent, randomDelay } from './utils';
import { getCache, setCache, generateProductCacheKey } from '../cache';

export interface ScrapedProduct {
    title: string;
    price: number | null;
    originalPrice: number | null;
    imageUrl: string | null;
    rating: number | null;
    reviewCount: number | null;
    inStock: boolean;
    url: string;
}

export abstract class BaseScraper {
    protected client: AxiosInstance;
    protected baseDelay: number = 2000; // 2 seconds minimum delay

    constructor() {
        this.client = axios.create({
            timeout: 15000,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
        });
    }

    /**
     * Fetch HTML from URL with rate limiting and caching
     */
    protected async fetchHtml(url: string): Promise<string> {
        // Check cache first
        const cacheKey = generateProductCacheKey(url);
        const cached = getCache<string>(cacheKey);

        if (cached) {
            console.log(`Cache hit for ${url}`);
            return cached;
        }

        // Add random delay to avoid rate limiting
        await randomDelay(this.baseDelay, this.baseDelay + 2000);

        try {
            const response = await this.client.get(url, {
                headers: {
                    'User-Agent': getRandomUserAgent(),
                },
            });

            const html = response.data;

            // Cache the HTML for 24 hours
            setCache(cacheKey, html, { ttl: 24 * 60 * 60 });

            return html;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    throw new Error('Access forbidden - possible bot detection');
                }
                if (error.response?.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error(`Failed to fetch: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Parse HTML using cheerio
     */
    protected parseHtml(html: string): any {
        return load(html);
    }

    /**
     * Abstract method to be implemented by platform-specific scrapers
     */
    abstract scrapeProduct(url: string): Promise<ScrapedProduct>;

    /**
     * Validate scraped data
     */
    protected validateScrapedData(data: ScrapedProduct): void {
        if (!data.title) {
            throw new Error('Failed to extract product title');
        }
        if (data.price === null) {
            throw new Error('Failed to extract product price');
        }
    }
}
