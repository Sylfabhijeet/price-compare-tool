'use client';

import { Review } from '@/lib/types';
import { Star, TrendingUp } from 'lucide-react';
import { formatRating, getStarRating, getReviewStats } from '@/lib/api/reviewAggregator';
import config from '@/lib/config';

interface ReviewSectionProps {
    reviews: Review[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
    if (reviews.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-gray-400">No reviews available</p>
            </div>
        );
    }

    const stats = getReviewStats(reviews);
    const starRating = getStarRating(stats.averageRating);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>

            {/* Overall Rating */}
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Rating Score */}
                    <div className="flex flex-col items-center justify-center md:border-r border-white/10 md:pr-8">
                        <div className="text-6xl font-bold gradient-text mb-2">
                            {formatRating(stats.averageRating)}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(starRating.full)].map((_, i) => (
                                <Star key={`full-${i}`} size={24} fill="currentColor" className="text-warning" />
                            ))}
                            {starRating.half && (
                                <Star size={24} fill="currentColor" className="text-warning opacity-50" />
                            )}
                            {[...Array(starRating.empty)].map((_, i) => (
                                <Star key={`empty-${i}`} size={24} className="text-gray-600" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">
                            Based on {stats.totalReviews.toLocaleString()} reviews
                        </p>
                        <p className="text-sm text-gray-400">
                            across {stats.platformCount} platforms
                        </p>
                    </div>

                    {/* Top Highlights */}
                    <div className="flex-1">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-success" size={20} />
                            Top Highlights
                        </h3>
                        <div className="grid gap-2">
                            {stats.topHighlights.map((highlight, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="text-gray-300">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform-wise Reviews */}
            <div>
                <h3 className="font-semibold mb-4">Reviews by Platform</h3>
                <div className="grid gap-4">
                    {reviews.map((review) => {
                        const platformConfig = config.platforms[review.platform];
                        const platformStars = getStarRating(review.rating);

                        return (
                            <div key={review.platform} className="glass-card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                                            style={{ backgroundColor: `${platformConfig.color}20`, color: platformConfig.color }}
                                        >
                                            {review.platform.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{review.platform}</h4>
                                            <p className="text-xs text-gray-400">
                                                {review.totalReviews.toLocaleString()} reviews
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl font-bold">{formatRating(review.rating)}</span>
                                            <Star size={20} fill="currentColor" className="text-warning" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(platformStars.full)].map((_, i) => (
                                                <Star key={`full-${i}`} size={14} fill="currentColor" className="text-warning" />
                                            ))}
                                            {platformStars.half && (
                                                <Star size={14} fill="currentColor" className="text-warning opacity-50" />
                                            )}
                                            {[...Array(platformStars.empty)].map((_, i) => (
                                                <Star key={`empty-${i}`} size={14} className="text-gray-600" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Highlights */}
                                {review.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {review.highlights.map((highlight, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                                            >
                                                • {highlight}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
