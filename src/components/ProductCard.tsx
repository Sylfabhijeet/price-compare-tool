'use client';

import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/api/offerCalculator';
import Link from 'next/link';
import { TrendingDown, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    minPrice?: number;
    maxPrice?: number;
    discount?: number;
    rating?: number;
}

export default function ProductCard({
    product,
    minPrice,
    maxPrice,
    discount,
    rating
}: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`}>
            <div className="glass-card p-4 hover-lift cursor-pointer group h-full flex flex-col">
                {/* Product Image */}
                <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-white/5">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {discount && discount > 0 && (
                        <div className="absolute top-2 right-2 bg-error text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <TrendingDown size={16} />
                            {discount.toFixed(0)}% OFF
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                    {product.brand && (
                        <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
                    )}
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {rating && (
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 bg-success px-2 py-1 rounded text-sm font-semibold">
                                <Star size={14} fill="currentColor" />
                                {rating.toFixed(1)}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    {minPrice && (
                        <div className="mt-auto">
                            <p className="text-sm text-gray-400 mb-1">Starting from</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold gradient-text">
                                    {formatPrice(minPrice)}
                                </span>
                                {maxPrice && maxPrice > minPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(maxPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-primary mt-1">Compare prices →</p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
