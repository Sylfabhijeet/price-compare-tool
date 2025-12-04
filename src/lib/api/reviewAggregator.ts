// Review aggregator - aggregates and analyzes reviews from multiple platforms

import { Review } from '../types';

/**
 * Calculate weighted average rating across all platforms
 */
export function calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;

    let totalWeightedRating = 0;
    let totalReviews = 0;

    for (const review of reviews) {
        totalWeightedRating += review.rating * review.totalReviews;
        totalReviews += review.totalReviews;
    }

    return totalReviews > 0 ? totalWeightedRating / totalReviews : 0;
}

/**
 * Get overall sentiment based on reviews
 */
export function getOverallSentiment(reviews: Review[]): 'positive' | 'neutral' | 'negative' {
    if (reviews.length === 0) return 'neutral';

    const avgRating = calculateAverageRating(reviews);

    if (avgRating >= 4.0) return 'positive';
    if (avgRating >= 3.0) return 'neutral';
    return 'negative';
}

/**
 * Extract top highlights from all reviews
 */
export function extractTopHighlights(reviews: Review[], limit: number = 5): string[] {
    const allHighlights: string[] = [];

    for (const review of reviews) {
        allHighlights.push(...review.highlights);
    }

    // Remove duplicates and return top highlights
    const uniqueHighlights = Array.from(new Set(allHighlights));
    return uniqueHighlights.slice(0, limit);
}

/**
 * Get review summary statistics
 */
export function getReviewStats(reviews: Review[]) {
    const totalReviews = reviews.reduce((sum, review) => sum + review.totalReviews, 0);
    const averageRating = calculateAverageRating(reviews);
    const sentiment = getOverallSentiment(reviews);
    const topHighlights = extractTopHighlights(reviews);

    return {
        totalReviews,
        averageRating,
        sentiment,
        topHighlights,
        platformCount: reviews.length,
    };
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
    return rating.toFixed(1);
}

/**
 * Get star rating display
 */
export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return { full, half, empty };
}
