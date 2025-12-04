'use client';

import { CardOffer, Price } from '@/lib/types';
import { formatPrice, calculateOfferPrice } from '@/lib/api/offerCalculator';
import { CreditCard, Calendar, Info } from 'lucide-react';
import config from '@/lib/config';
import { useState } from 'react';

interface OfferCardProps {
    offer: CardOffer;
    price?: Price;
}

export default function OfferCard({ offer, price }: OfferCardProps) {
    const [showTerms, setShowTerms] = useState(false);
    const bankConfig = config.banks[offer.bank];

    // Calculate savings if price is provided
    let calculation;
    if (price) {
        calculation = calculateOfferPrice(price, offer);
    }

    const isExpiringSoon = () => {
        const daysUntilExpiry = Math.ceil(
            (new Date(offer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7;
    };

    return (
        <div className="glass-card p-6 hover-lift">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: `${bankConfig.color}20`, color: bankConfig.color }}
                    >
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{offer.bank}</h3>
                        <p className="text-sm text-gray-400">{offer.cardType}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold gradient-text">
                        {offer.discountPercentage}% OFF
                    </div>
                    <p className="text-xs text-gray-400">
                        Up to {formatPrice(offer.maxDiscount)}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4">{offer.description}</p>

            {/* Calculation */}
            {calculation && calculation.cardDiscount > 0 && (
                <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Original Price:</span>
                        <span className="font-semibold line-through">{formatPrice(calculation.originalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">After Platform Discount:</span>
                        <span className="font-semibold">{formatPrice(calculation.originalPrice - calculation.platformDiscount)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-success">Card Discount:</span>
                        <span className="font-semibold text-success">- {formatPrice(calculation.cardDiscount)}</span>
                    </div>
                    <div className="border-t border-success/30 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Final Price:</span>
                            <span className="text-2xl font-bold gradient-text">{formatPrice(calculation.finalPrice)}</span>
                        </div>
                        <p className="text-sm text-success text-right mt-1">
                            Total Savings: {formatPrice(calculation.totalSavings)} ({calculation.savingsPercentage.toFixed(1)}%)
                        </p>
                    </div>
                </div>
            )}

            {/* Minimum Purchase */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Info size={16} />
                <span>Minimum purchase: {formatPrice(offer.minPurchase)}</span>
            </div>

            {/* Validity */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Calendar size={16} className={isExpiringSoon() ? 'text-warning' : 'text-gray-400'} />
                <span className={isExpiringSoon() ? 'text-warning font-semibold' : 'text-gray-400'}>
                    Valid until {new Date(offer.validUntil).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                    {isExpiringSoon() && ' (Expiring Soon!)'}
                </span>
            </div>

            {/* Applicable Platforms */}
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Applicable on:</p>
                <div className="flex flex-wrap gap-2">
                    {offer.applicablePlatforms.map((platform) => (
                        <span
                            key={platform}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary"
                        >
                            {platform}
                        </span>
                    ))}
                </div>
            </div>

            {/* Terms & Conditions */}
            <button
                onClick={() => setShowTerms(!showTerms)}
                className="text-sm text-primary hover:underline"
            >
                {showTerms ? 'Hide' : 'Show'} Terms & Conditions
            </button>

            {showTerms && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg text-sm text-gray-400">
                    {offer.termsAndConditions}
                </div>
            )}
        </div>
    );
}
