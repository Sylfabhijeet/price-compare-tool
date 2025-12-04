// TypeScript type definitions for the price comparison platform

export enum Platform {
    AMAZON = 'Amazon',
    FLIPKART = 'Flipkart',
    MYNTRA = 'Myntra',
    SNAPDEAL = 'Snapdeal',
    AJIO = 'Ajio',
}

export enum CardType {
    CREDIT = 'Credit Card',
    DEBIT = 'Debit Card',
}

export enum BankName {
    HDFC = 'HDFC Bank',
    ICICI = 'ICICI Bank',
    SBI = 'State Bank of India',
    AXIS = 'Axis Bank',
    KOTAK = 'Kotak Mahindra Bank',
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
    brand?: string;
}

export interface Price {
    platform: Platform;
    productUrl: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number; // percentage
    inStock: boolean;
    lastUpdated: Date;
}

export interface CardOffer {
    id: string;
    bank: BankName;
    cardType: CardType;
    discountPercentage: number;
    maxDiscount: number;
    minPurchase: number;
    description: string;
    termsAndConditions: string;
    validUntil: Date;
    applicablePlatforms: Platform[];
}

export interface Review {
    platform: Platform;
    rating: number; // out of 5
    totalReviews: number;
    highlights: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
}

export interface PriceComparison {
    product: Product;
    prices: Price[];
    bestDeal: {
        platform: Platform;
        price: number;
        savings: number;
        savingsPercentage: number;
    };
    applicableOffers: CardOffer[];
    reviews: Review[];
    averageRating: number;
}

export interface SearchResult {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
}

export interface OfferCalculation {
    originalPrice: number;
    platformDiscount: number;
    cardDiscount: number;
    finalPrice: number;
    totalSavings: number;
    savingsPercentage: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
