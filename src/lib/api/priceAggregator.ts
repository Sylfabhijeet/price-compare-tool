// Price aggregator - fetches and compares prices from multiple platforms

import {
    Product,
    Price,
    PriceComparison,
    Platform,
    CardOffer,
    Review,
} from '../types';
import { mockProducts, mockPrices, mockCardOffers, mockReviews } from './mockData';
import { calculateOfferPrice, findBestCardOffer } from './offerCalculator';
import { calculateAverageRating } from './reviewAggregator';

/**
 * Get all products (mock implementation)
 */
export async function getAllProducts(): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(
        product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.brand?.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.find(p => p.id === id) || null;
}

/**
 * Get prices for a product across all platforms
 */
export async function getPricesForProduct(productId: string): Promise<Price[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPrices[productId] || [];
}

/**
 * Get available card offers
 */
export async function getCardOffers(): Promise<CardOffer[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCardOffers;
}

/**
 * Get reviews for a product
 */
export async function getReviewsForProduct(productId: string): Promise<Review[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockReviews[productId] || [];
}

/**
 * Get complete price comparison for a product
 */
export async function getPriceComparison(productId: string): Promise<PriceComparison | null> {
    const product = await getProductById(productId);
    if (!product) return null;

    const [prices, offers, reviews] = await Promise.all([
        getPricesForProduct(productId),
        getCardOffers(),
        getReviewsForProduct(productId),
    ]);

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
 * Get best deals (products with highest discounts)
 */
export async function getBestDeals(limit: number = 6): Promise<Product[]> {
    const products = await getAllProducts();

    // Calculate discount for each product
    const productsWithDiscounts = await Promise.all(
        products.map(async product => {
            const prices = await getPricesForProduct(product.id);
            const maxDiscount = Math.max(...prices.map(p => p.discount), 0);
            return { product, maxDiscount };
        })
    );

    // Sort by discount and return top products
    return productsWithDiscounts
        .sort((a, b) => b.maxDiscount - a.maxDiscount)
        .slice(0, limit)
        .map(item => item.product);
}
