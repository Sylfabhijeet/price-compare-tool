// Main scraper orchestrator

import { Platform } from '../types';
import { ScrapedProduct } from './base';
import { amazonScraper } from './amazon';
import { flipkartScraper } from './flipkart';
import { detectPlatform, isValidUrl } from './utils';

/**
 * Scrape product from any supported platform
 */
export async function scrapeProductFromUrl(url: string): Promise<ScrapedProduct> {
    // Validate URL
    if (!isValidUrl(url)) {
        throw new Error('Invalid URL format');
    }

    // Detect platform
    const platform = detectPlatform(url);
    if (!platform) {
        throw new Error('Unsupported platform. Please use Amazon, Flipkart, Myntra, Snapdeal, or Ajio URLs.');
    }

    // Select appropriate scraper
    switch (platform) {
        case Platform.AMAZON:
            return await amazonScraper.scrapeProduct(url);

        case Platform.FLIPKART:
            return await flipkartScraper.scrapeProduct(url);

        case Platform.MYNTRA:
        case Platform.SNAPDEAL:
        case Platform.AJIO:
            throw new Error(`${platform} scraping is not yet implemented. Coming soon!`);

        default:
            throw new Error('Unknown platform');
    }
}

/**
 * Scrape multiple products concurrently
 */
export async function scrapeMultipleProducts(urls: string[]): Promise<{
    success: ScrapedProduct[];
    errors: { url: string; error: string }[];
}> {
    const results = await Promise.allSettled(
        urls.map(url => scrapeProductFromUrl(url))
    );

    const success: ScrapedProduct[] = [];
    const errors: { url: string; error: string }[] = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            success.push(result.value);
        } else {
            errors.push({
                url: urls[index],
                error: result.reason?.message || 'Unknown error',
            });
        }
    });

    return { success, errors };
}

export { detectPlatform, isValidUrl };
