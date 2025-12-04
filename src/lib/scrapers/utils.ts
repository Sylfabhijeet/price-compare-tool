// Utility functions for web scraping

import { Platform } from '../types';

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): Platform | null {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('amazon.in') || urlLower.includes('amazon.com')) {
        return Platform.AMAZON;
    }
    if (urlLower.includes('flipkart.com')) {
        return Platform.FLIPKART;
    }
    if (urlLower.includes('myntra.com')) {
        return Platform.MYNTRA;
    }
    if (urlLower.includes('snapdeal.com')) {
        return Platform.SNAPDEAL;
    }
    if (urlLower.includes('ajio.com')) {
        return Platform.AJIO;
    }

    return null;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Parse price from text (handles ₹, commas, etc.)
 */
export function parsePrice(priceText: string): number | null {
    if (!priceText) return null;

    // Remove currency symbols, commas, and whitespace
    const cleaned = priceText
        .replace(/[₹$,\s]/g, '')
        .replace(/[^\d.]/g, '');

    const price = parseFloat(cleaned);
    return isNaN(price) ? null : Math.round(price);
}

/**
 * Parse rating from text
 */
export function parseRating(ratingText: string): number | null {
    if (!ratingText) return null;

    const cleaned = ratingText.replace(/[^\d.]/g, '');
    const rating = parseFloat(cleaned);

    return isNaN(rating) ? null : Math.min(5, Math.max(0, rating));
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
}

/**
 * Extract product ID from URL
 */
export function extractProductId(url: string, platform: Platform): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        switch (platform) {
            case Platform.AMAZON:
                // Amazon: /dp/PRODUCTID or /gp/product/PRODUCTID
                const amazonMatch = pathname.match(/\/(dp|gp\/product)\/([A-Z0-9]+)/);
                return amazonMatch ? amazonMatch[2] : pathname;

            case Platform.FLIPKART:
                // Flipkart: /product-name/p/PRODUCTID
                const flipkartMatch = pathname.match(/\/p\/([^?]+)/);
                return flipkartMatch ? flipkartMatch[1] : pathname;

            default:
                return pathname;
        }
    } catch {
        return url;
    }
}

/**
 * Generate random user agent
 */
export function getRandomUserAgent(): string {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Add random delay to mimic human behavior
 */
export async function randomDelay(min: number = 1000, max: number = 3000): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '');
}
