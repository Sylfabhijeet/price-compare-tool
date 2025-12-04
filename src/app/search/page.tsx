'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { Product, Price } from '@/lib/types';
import { searchProducts, getPricesForProduct } from '@/lib/api/priceAggregator';
import { calculateAverageRating } from '@/lib/api/reviewAggregator';
import { mockReviews } from '@/lib/api/mockData';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [productPrices, setProductPrices] = useState<Record<string, Price[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function performSearch() {
            setLoading(true);
            try {
                const results = await searchProducts(query);
                setProducts(results);

                // Load prices for each product
                const pricesMap: Record<string, Price[]> = {};
                for (const product of results) {
                    const prices = await getPricesForProduct(product.id);
                    pricesMap[product.id] = prices;
                }
                setProductPrices(pricesMap);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        }

        if (query) {
            performSearch();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
                            PriceCompare
                        </Link>
                        <div className="flex-1">
                            <SearchBar placeholder="Search for products..." />
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Results */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {query && (
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Search Results for &ldquo;{query}&rdquo;
                        </h1>
                        <p className="text-gray-400">
                            {loading ? 'Searching...' : `Found ${products.length} products`}
                        </p>
                    </div>
                )}

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
                ) : products.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
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
                ) : query ? (
                    <div className="text-center py-16">
                        <SearchIcon size={64} className="mx-auto mb-4 text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">No products found</h2>
                        <p className="text-gray-400">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <SearchIcon size={64} className="mx-auto mb-4 text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">Start searching</h2>
                        <p className="text-gray-400">
                            Enter a product name to find the best deals
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold gradient-text">Loading...</div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
