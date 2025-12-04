'use client';

import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { Sparkles, TrendingUp, Shield, Zap, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Price } from '@/lib/types';
import { getRealTimeBestDeals, getRealTimeProductPrices } from './actions';
import { calculateAverageRating } from '@/lib/api/reviewAggregator';
import { mockReviews } from '@/lib/api/mockData';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [productPrices, setProductPrices] = useState<Record<string, Price[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeaturedProducts() {
            try {
                const deals = await getRealTimeBestDeals(6);

                // Extract products and prices from the combined response
                setFeaturedProducts(deals.map(d => d.product));

                // Create prices map
                const pricesMap: Record<string, Price[]> = {};
                deals.forEach(deal => {
                    pricesMap[deal.product.id] = deal.prices;
                });

                setProductPrices(pricesMap);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        }

        loadFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="text-primary" size={32} />
                            <h1 className="text-6xl font-bold gradient-text">PriceCompare</h1>
                        </div>
                        <p className="text-2xl text-gray-300 mb-2">
                            Find the Best Deals Across All Major E-commerce Platforms
                        </p>
                        <p className="text-lg text-gray-400">
                            Compare prices, discover offers, and save money on every purchase
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-16 animate-slide-up">
                        <SearchBar autoFocus />

                        {/* URL Comparison Option */}
                        <div className="text-center mt-6">
                            <p className="text-gray-400 mb-3">Or compare specific product URLs</p>
                            <Link
                                href="/compare-urls"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 hover:scale-105"
                            >
                                <LinkIcon size={20} />
                                Compare Product URLs
                            </Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: <TrendingUp size={32} />,
                                title: 'Best Price Guaranteed',
                                description: 'Compare prices from Amazon, Flipkart, Myntra & more',
                                color: 'text-success',
                            },
                            {
                                icon: <Shield size={32} />,
                                title: 'Card Offers Included',
                                description: 'See final prices with credit & debit card discounts',
                                color: 'text-primary',
                            },
                            {
                                icon: <Zap size={32} />,
                                title: 'Real-time Reviews',
                                description: 'Aggregated ratings and reviews from all platforms',
                                color: 'text-warning',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-6 hover-lift animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 px-4 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-primary" size={32} />
                        <h2 className="text-4xl font-bold">Best Deals Right Now</h2>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card p-4 h-96">
                                    <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
                                    <div className="skeleton w-3/4 h-6 rounded mb-2"></div>
                                    <div className="skeleton w-1/2 h-6 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product) => {
                                const prices = productPrices[product.id] || [];
                                const minPrice = prices.length > 0
                                    ? Math.min(...prices.map(p => p.discountedPrice))
                                    : undefined;
                                const maxPrice = prices.length > 0
                                    ? Math.max(...prices.map(p => p.originalPrice))
                                    : undefined;
                                const maxDiscount = prices.length > 0
                                    ? Math.max(...prices.map(p => p.discount))
                                    : undefined;
                                const reviews = mockReviews[product.id] || [];
                                const rating = reviews.length > 0 ? calculateAverageRating(reviews) : undefined;

                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        minPrice={minPrice}
                                        maxPrice={maxPrice}
                                        discount={maxDiscount}
                                        rating={rating}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Search for Products',
                                description: 'Enter the product name or browse our featured deals',
                            },
                            {
                                step: '2',
                                title: 'Compare Prices & Offers',
                                description: 'See prices from all major platforms with card offers applied',
                            },
                            {
                                step: '3',
                                title: 'Make Informed Decisions',
                                description: 'Read aggregated reviews and choose the best deal for you',
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 animate-glow">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} PriceCompare. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <p>Compare prices from Amazon, Flipkart, Myntra, Snapdeal, Ajio & more</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
