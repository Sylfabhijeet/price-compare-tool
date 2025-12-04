'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, TrendingDown, Star, AlertTriangle } from 'lucide-react';
import UrlInput from '@/components/UrlInput';
import { formatPrice } from '@/lib/api/offerCalculator';
import { detectPlatform } from '@/lib/scrapers';
import config from '@/lib/config';

interface ScrapedProduct {
    title: string;
    price: number | null;
    originalPrice: number | null;
    imageUrl: string | null;
    rating: number | null;
    reviewCount: number | null;
    inStock: boolean;
    url: string;
}

export default function CompareUrlsPage() {
    const [products, setProducts] = useState<ScrapedProduct[]>([]);
    const [errors, setErrors] = useState<{ url: string; error: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasCompared, setHasCompared] = useState(false);

    const handleCompare = async (urls: string[]) => {
        setLoading(true);
        setHasCompared(false);
        setProducts([]);
        setErrors([]);

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls }),
            });

            const data = await response.json();

            if (data.success) {
                setProducts(data.data.products);
                setErrors(data.data.errors);
                setHasCompared(true);
            } else {
                alert(data.error || 'Failed to fetch product data');
            }
        } catch (error) {
            console.error('Comparison error:', error);
            alert('Failed to compare products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const bestDeal = products.length > 0
        ? products.reduce((best, product) =>
            product.price && product.inStock && (!best.price || product.price < best.price)
                ? product
                : best
        )
        : null;

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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Real-time Price Comparison</h1>
                    <p className="text-gray-400">
                        Paste product URLs from different e-commerce platforms to compare prices instantly
                    </p>
                </div>

                {/* URL Input */}
                <div className="mb-12">
                    <UrlInput onCompare={handleCompare} loading={loading} />
                </div>

                {/* Results */}
                {hasCompared && (
                    <div>
                        {/* Errors */}
                        {errors.length > 0 && (
                            <div className="mb-8 space-y-3">
                                <h3 className="text-xl font-bold text-error flex items-center gap-2">
                                    <AlertTriangle size={24} />
                                    Failed to Fetch ({errors.length})
                                </h3>
                                {errors.map((error, index) => (
                                    <div key={index} className="glass-card p-4 border-l-4 border-error">
                                        <p className="font-semibold mb-1">URL: {error.url}</p>
                                        <p className="text-sm text-gray-400">{error.error}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Success */}
                        {products.length > 0 ? (
                            <>
                                {/* Best Deal Highlight */}
                                {bestDeal && (
                                    <div className="mb-8 glass-card p-6 border-2 border-success">
                                        <h3 className="text-2xl font-bold text-success mb-4 flex items-center gap-2">
                                            <TrendingDown size={28} />
                                            Best Deal Found!
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                {bestDeal.imageUrl && (
                                                    <img
                                                        src={bestDeal.imageUrl}
                                                        alt={bestDeal.title}
                                                        className="w-full h-64 object-contain rounded-lg bg-white/5"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{bestDeal.title}</h4>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span
                                                        className="px-3 py-1 rounded-lg font-bold text-lg"
                                                        style={{
                                                            backgroundColor: `${config.platforms[detectPlatform(bestDeal.url)!]?.color}20`,
                                                            color: config.platforms[detectPlatform(bestDeal.url)!]?.color,
                                                        }}
                                                    >
                                                        {detectPlatform(bestDeal.url)}
                                                    </span>
                                                    {bestDeal.rating && (
                                                        <div className="flex items-center gap-1 bg-success px-2 py-1 rounded text-sm font-semibold">
                                                            <Star size={14} fill="currentColor" />
                                                            {bestDeal.rating.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex items-baseline gap-3 mb-2">
                                                        <span className="text-4xl font-bold gradient-text">
                                                            {formatPrice(bestDeal.price!)}
                                                        </span>
                                                        {bestDeal.originalPrice && bestDeal.originalPrice > bestDeal.price! && (
                                                            <span className="text-xl text-gray-500 line-through">
                                                                {formatPrice(bestDeal.originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {bestDeal.originalPrice && bestDeal.originalPrice > bestDeal.price! && (
                                                        <p className="text-success font-semibold">
                                                            Save {formatPrice(bestDeal.originalPrice - bestDeal.price!)} (
                                                            {(((bestDeal.originalPrice - bestDeal.price!) / bestDeal.originalPrice) * 100).toFixed(1)}% OFF)
                                                        </p>
                                                    )}
                                                </div>
                                                <a
                                                    href={bestDeal.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary inline-flex items-center gap-2"
                                                >
                                                    View on {detectPlatform(bestDeal.url)}
                                                    <ExternalLink size={18} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* All Products Comparison */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-6">All Products</h3>
                                    <div className="grid gap-6">
                                        {products.map((product, index) => {
                                            const platform = detectPlatform(product.url);
                                            const platformConfig = platform ? config.platforms[platform] : null;
                                            const isBest = bestDeal && product.url === bestDeal.url;
                                            const savings = product.originalPrice && product.price
                                                ? product.originalPrice - product.price
                                                : 0;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`glass-card p-6 ${isBest ? 'ring-2 ring-success' : ''}`}
                                                >
                                                    <div className="grid md:grid-cols-3 gap-6">
                                                        {/* Image */}
                                                        <div>
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={product.title}
                                                                    className="w-full h-48 object-contain rounded-lg bg-white/5"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-48 bg-white/5 rounded-lg flex items-center justify-center text-gray-500">
                                                                    No Image
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="md:col-span-2">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h4 className="text-lg font-bold flex-1">{product.title}</h4>
                                                                {isBest && (
                                                                    <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">
                                                                        Best Deal
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-3 mb-4">
                                                                {platformConfig && (
                                                                    <span
                                                                        className="px-3 py-1 rounded-lg font-semibold"
                                                                        style={{
                                                                            backgroundColor: `${platformConfig.color}20`,
                                                                            color: platformConfig.color,
                                                                        }}
                                                                    >
                                                                        {platform}
                                                                    </span>
                                                                )}
                                                                {product.rating && (
                                                                    <div className="flex items-center gap-1 bg-success px-2 py-1 rounded text-sm font-semibold">
                                                                        <Star size={14} fill="currentColor" />
                                                                        {product.rating.toFixed(1)}
                                                                        {product.reviewCount && (
                                                                            <span className="text-xs opacity-80">
                                                                                ({product.reviewCount.toLocaleString()})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <span className={`text-sm font-semibold ${product.inStock ? 'text-success' : 'text-error'}`}>
                                                                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-baseline gap-3 mb-4">
                                                                <span className="text-3xl font-bold gradient-text">
                                                                    {product.price ? formatPrice(product.price) : 'N/A'}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                                                                    <>
                                                                        <span className="text-lg text-gray-500 line-through">
                                                                            {formatPrice(product.originalPrice)}
                                                                        </span>
                                                                        <span className="bg-error/20 text-error px-3 py-1 rounded-full text-sm font-bold">
                                                                            {((savings / product.originalPrice) * 100).toFixed(0)}% OFF
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <a
                                                                href={product.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn-secondary inline-flex items-center gap-2"
                                                            >
                                                                View Product
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : errors.length === 0 ? (
                            <div className="text-center py-16 glass-card">
                                <p className="text-xl text-gray-400">No products found</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </main>
        </div>
    );
}
