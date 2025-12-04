'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PriceComparison as PriceComparisonType } from '@/lib/types';
import { getRealTimePriceComparison } from '../../actions';
import PriceComparison from '@/components/PriceComparison';
import OfferCard from '@/components/OfferCard';
import ReviewSection from '@/components/ReviewSection';
import { formatPrice } from '@/lib/api/offerCalculator';

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;

    const [comparison, setComparison] = useState<PriceComparisonType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadComparison() {
            try {
                setLoading(true);
                const data = await getRealTimePriceComparison(productId);
                if (data) {
                    setComparison(data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product comparison');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            loadComparison();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-400">Loading comparison...</p>
                </div>
            </div>
        );
    }

    if (error || !comparison) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
                    <Link href="/" className="btn-primary">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    const { product, prices, bestDeal, applicableOffers, reviews, averageRating } = comparison;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Product Overview */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Product Image */}
                    <div className="glass-card p-8">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {product.brand && (
                            <p className="text-lg text-gray-400">{product.brand}</p>
                        )}
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <p className="text-gray-300 text-lg">{product.description}</p>

                        {/* Best Deal Highlight */}
                        <div className="glass-card p-6 border-2 border-success">
                            <p className="text-sm text-gray-400 mb-2">Best Price Available</p>
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-5xl font-bold gradient-text">
                                    {formatPrice(bestDeal.price)}
                                </span>
                            </div>
                            <p className="text-success text-lg font-semibold mb-4">
                                Save {formatPrice(bestDeal.savings)} ({bestDeal.savingsPercentage.toFixed(1)}% OFF)
                            </p>
                            <p className="text-sm text-gray-400 mb-4">
                                Available on <span className="font-semibold text-white">{bestDeal.platform}</span>
                            </p>

                            {/* Quick Links */}
                            <div className="flex flex-wrap gap-3">
                                {prices.filter(p => p.inStock).map((price) => (
                                    <a
                                        key={price.platform}
                                        href={price.productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary flex items-center gap-2"
                                    >
                                        View on {price.platform}
                                        <ExternalLink size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        {averageRating > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="bg-success px-4 py-2 rounded-lg text-xl font-bold">
                                    ⭐ {averageRating.toFixed(1)}
                                </div>
                                <span className="text-gray-400">
                                    Based on {reviews.reduce((sum, r) => sum + r.totalReviews, 0).toLocaleString()} reviews
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Comparison */}
                <div className="mb-12">
                    <PriceComparison prices={prices} />
                </div>

                {/* Card Offers */}
                {applicableOffers.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Available Card Offers</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {applicableOffers.map((offer) => {
                                // Find the best price for this offer
                                const applicablePrices = prices.filter(p =>
                                    offer.applicablePlatforms.includes(p.platform) && p.inStock
                                );
                                const bestApplicablePrice = applicablePrices.length > 0
                                    ? applicablePrices.reduce((min, p) =>
                                        p.discountedPrice < min.discountedPrice ? p : min
                                    )
                                    : undefined;

                                return (
                                    <OfferCard
                                        key={offer.id}
                                        offer={offer}
                                        price={bestApplicablePrice}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Reviews */}
                {reviews.length > 0 && (
                    <div className="mb-12">
                        <ReviewSection reviews={reviews} />
                    </div>
                )}
            </section>
        </div>
    );
}
