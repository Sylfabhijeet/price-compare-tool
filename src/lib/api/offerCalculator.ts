// Offer calculator - calculates final prices with discounts and card offers

import { Price, CardOffer, OfferCalculation, Platform } from '../types';

/**
 * Calculate the final price after applying card offers
 */
export function calculateOfferPrice(
    price: Price,
    cardOffer?: CardOffer
): OfferCalculation {
    const originalPrice = price.originalPrice;
    const platformDiscount = originalPrice - price.discountedPrice;

    let cardDiscount = 0;
    let finalPrice = price.discountedPrice;

    if (cardOffer && cardOffer.applicablePlatforms.includes(price.platform)) {
        // Check if minimum purchase requirement is met
        if (price.discountedPrice >= cardOffer.minPurchase) {
            // Calculate card discount
            const calculatedDiscount = (price.discountedPrice * cardOffer.discountPercentage) / 100;
            cardDiscount = Math.min(calculatedDiscount, cardOffer.maxDiscount);
            finalPrice = price.discountedPrice - cardDiscount;
        }
    }

    const totalSavings = originalPrice - finalPrice;
    const savingsPercentage = (totalSavings / originalPrice) * 100;

    return {
        originalPrice,
        platformDiscount,
        cardDiscount,
        finalPrice,
        totalSavings,
        savingsPercentage,
    };
}

/**
 * Find the best card offer for a given price
 */
export function findBestCardOffer(
    price: Price,
    availableOffers: CardOffer[]
): { offer: CardOffer; calculation: OfferCalculation } | null {
    let bestOffer: CardOffer | null = null;
    let bestCalculation: OfferCalculation | null = null;
    let maxSavings = 0;

    for (const offer of availableOffers) {
        // Check if offer is applicable to this platform
        if (!offer.applicablePlatforms.includes(price.platform)) {
            continue;
        }

        // Check if offer is still valid
        if (new Date(offer.validUntil) < new Date()) {
            continue;
        }

        const calculation = calculateOfferPrice(price, offer);

        if (calculation.cardDiscount > maxSavings) {
            maxSavings = calculation.cardDiscount;
            bestOffer = offer;
            bestCalculation = calculation;
        }
    }

    if (bestOffer && bestCalculation) {
        return { offer: bestOffer, calculation: bestCalculation };
    }

    return null;
}

/**
 * Get all applicable offers for a price
 */
export function getApplicableOffers(
    price: Price,
    availableOffers: CardOffer[]
): Array<{ offer: CardOffer; calculation: OfferCalculation }> {
    const applicableOffers: Array<{ offer: CardOffer; calculation: OfferCalculation }> = [];

    for (const offer of availableOffers) {
        // Check if offer is applicable to this platform
        if (!offer.applicablePlatforms.includes(price.platform)) {
            continue;
        }

        // Check if offer is still valid
        if (new Date(offer.validUntil) < new Date()) {
            continue;
        }

        // Check if minimum purchase is met
        if (price.discountedPrice < offer.minPurchase) {
            continue;
        }

        const calculation = calculateOfferPrice(price, offer);
        applicableOffers.push({ offer, calculation });
    }

    // Sort by savings (highest first)
    return applicableOffers.sort((a, b) => b.calculation.cardDiscount - a.calculation.cardDiscount);
}

/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Format discount percentage
 */
export function formatDiscount(percentage: number): string {
    return `${percentage.toFixed(1)}% OFF`;
}
