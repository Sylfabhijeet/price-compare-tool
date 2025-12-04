'use server';

import { Product, Price, PriceComparison, Platform } from '@/lib/types';
import { mockProducts, mockPrices, mockCardOffers, mockReviews } from '@/lib/api/mockData';
import { calculateAverageRating } from '@/lib/api/reviewAggregator';
import { findBestCardOffer } from '@/lib/api/offerCalculator';
import { scrapeProductFromUrl } from '@/lib/scrapers';

/**
 * Fetch real-time prices for a product by scraping its URLs
 */
async function getRealTimePrices(productId: string): Promise<Price[]> {
    const staticPrices = mockPrices[productId] || [];

    // Scrape current prices in parallel
    const realtimePrices = await Promise.all(
        staticPrices.map(async (staticPrice) => {
            try {
                // Scrape the URL
                const scrapedData = await scrapeProductFromUrl(staticPrice.productUrl);

                // If scraping successful, return updated price
                if (scrapedData.price) {
                    return {
                        ...staticPrice,
                        originalPrice: scrapedData.originalPrice || scrapedData.price,
                        discountedPrice: scrapedData.price,
                        // Recalculate discount
                        discount: scrapedData.originalPrice
                            ? ((scrapedData.originalPrice - scrapedData.price) / scrapedData.originalPrice) * 100
                            : 0,
                        inStock: scrapedData.inStock,
                        lastUpdated: new Date(),
                    };
                }
            } catch (error) {
                console.error(`Failed to scrape ${staticPrice.productUrl}:`, error);
            }

            // Fallback to static data if scraping fails
            return staticPrice;
        })
    );

    return realtimePrices;
}

/**
 * Get real-time price comparison for a product
 */
export async function getRealTimePriceComparison(productId: string): Promise<PriceComparison | null> {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return null;

    // Fetch real-time prices
    const prices = await getRealTimePrices(productId);
    const offers = mockCardOffers;
    const reviews = mockReviews[productId] || [];

    if (prices.length === 0) return null;

    // Find best deal (considering only platform discounts)
    let bestPrice = prices[0];
    for (const price of prices) {
        if (price.inStock && price.discountedPrice < bestPrice.discountedPrice) {
            bestPrice = price;
        }
    }

    // Calculate best deal with card offers
    const bestOfferResult = findBestCardOffer(bestPrice, offers);
    const finalBestPrice = bestOfferResult
        ? bestOfferResult.calculation.finalPrice
        : bestPrice.discountedPrice;

    const savings = bestPrice.originalPrice - finalBestPrice;
    const savingsPercentage = (savings / bestPrice.originalPrice) * 100;

    // Get applicable offers for all platforms
    const applicableOffers = offers.filter(offer => {
        const platformsInPrices = prices.map(p => p.platform);
        return offer.applicablePlatforms.some(p => platformsInPrices.includes(p));
    });

    const averageRating = calculateAverageRating(reviews);

    return {
        product,
        prices: prices.sort((a, b) => a.discountedPrice - b.discountedPrice),
        bestDeal: {
            platform: bestPrice.platform,
            price: finalBestPrice,
            savings,
            savingsPercentage,
        },
        applicableOffers,
        reviews,
        averageRating,
    };
}

/**
 * Get real-time best deals for homepage with their prices
 * Returns combined data to avoid N+1 request problem
 */
export async function getRealTimeBestDeals(limit: number = 6): Promise<{ product: Product; prices: Price[] }[]> {
    // Get all products
    const products = mockProducts;

    // Fetch prices for all products in parallel
    const productsWithData = await Promise.all(
        products.map(async product => {
            try {
                const prices = await getRealTimePrices(product.id);
                const maxDiscount = Math.max(...prices.map(p => p.discount), 0);
                return { product, prices, maxDiscount };
            } catch (e) {
                // Fallback to static prices if scraping fails completely
                const prices = mockPrices[product.id] || [];
                const maxDiscount = Math.max(...prices.map(p => p.discount), 0);
                return { product, prices, maxDiscount };
            }
        })
    );

    // Sort by discount and return top products with their prices
    return productsWithData
        .sort((a, b) => b.maxDiscount - a.maxDiscount)
        .slice(0, limit)
        .map(item => ({
            product: item.product,
            prices: item.prices
        }));
}

/**
 * Get real-time prices for a specific product (for homepage cards)
 */
export async function getRealTimeProductPrices(productId: string): Promise<Price[]> {
    return await getRealTimePrices(productId);
}
