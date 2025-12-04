'use client';

import { Price, Platform } from '@/lib/types';
import { formatPrice, formatDiscount } from '@/lib/api/offerCalculator';
import { ExternalLink, Check, X } from 'lucide-react';
import config from '@/lib/config';

interface PriceComparisonProps {
    prices: Price[];
}

export default function PriceComparison({ prices }: PriceComparisonProps) {
    if (prices.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-gray-400">No prices available</p>
            </div>
        );
    }

    // Sort by discounted price (lowest first)
    const sortedPrices = [...prices].sort((a, b) => a.discountedPrice - b.discountedPrice);
    const bestPrice = sortedPrices[0];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Price Comparison</h2>

            <div className="grid gap-4">
                {sortedPrices.map((price, index) => {
                    const platformConfig = config.platforms[price.platform];
                    const isBestDeal = price.platform === bestPrice.platform;
                    const savings = price.originalPrice - price.discountedPrice;

                    return (
                        <div
                            key={price.platform}
                            className={`
                glass-card p-6 relative overflow-hidden
                ${isBestDeal ? 'ring-2 ring-success' : ''}
              `}
                        >
                            {isBestDeal && (
                                <div className="absolute top-0 right-0 bg-success text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                                    Best Deal
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Platform Info */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
                                        style={{ backgroundColor: `${platformConfig.color}20`, color: platformConfig.color }}
                                    >
                                        {price.platform.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{price.platform}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {price.inStock ? (
                                                <span className="flex items-center gap-1 text-success text-sm">
                                                    <Check size={16} />
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-error text-sm">
                                                    <X size={16} />
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="flex flex-col md:items-end gap-2">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold gradient-text">
                                            {formatPrice(price.discountedPrice)}
                                        </span>
                                        {savings > 0 && (
                                            <span className="text-lg text-gray-500 line-through">
                                                {formatPrice(price.originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {savings > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-semibold">
                                                Save {formatPrice(savings)} ({formatDiscount(price.discount)})
                                            </span>
                                        </div>
                                    )}

                                    {/* View Product Button */}
                                    <a
                                        href={price.productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary mt-2 flex items-center gap-2 justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View on {price.platform}
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
