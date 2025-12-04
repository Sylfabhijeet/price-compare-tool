// Configuration settings for the price comparison platform

import { Platform, BankName, CardType } from './types';

export const config = {
    // Application settings
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'PriceCompare',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },

    // E-commerce platform configurations
    platforms: {
        [Platform.AMAZON]: {
            name: 'Amazon',
            logo: '/logos/amazon.svg',
            color: '#FF9900',
            baseUrl: 'https://www.amazon.in',
        },
        [Platform.FLIPKART]: {
            name: 'Flipkart',
            logo: '/logos/flipkart.svg',
            color: '#2874F0',
            baseUrl: 'https://www.flipkart.com',
        },
        [Platform.MYNTRA]: {
            name: 'Myntra',
            logo: '/logos/myntra.svg',
            color: '#FF3F6C',
            baseUrl: 'https://www.myntra.com',
        },
        [Platform.SNAPDEAL]: {
            name: 'Snapdeal',
            logo: '/logos/snapdeal.svg',
            color: '#E40046',
            baseUrl: 'https://www.snapdeal.com',
        },
        [Platform.AJIO]: {
            name: 'Ajio',
            logo: '/logos/ajio.svg',
            color: '#B91C1C',
            baseUrl: 'https://www.ajio.com',
        },
    },

    // Bank configurations for card offers
    banks: {
        [BankName.HDFC]: {
            name: 'HDFC Bank',
            logo: '/logos/hdfc.svg',
            color: '#004C8F',
        },
        [BankName.ICICI]: {
            name: 'ICICI Bank',
            logo: '/logos/icici.svg',
            color: '#B02A30',
        },
        [BankName.SBI]: {
            name: 'State Bank of India',
            logo: '/logos/sbi.svg',
            color: '#1C4587',
        },
        [BankName.AXIS]: {
            name: 'Axis Bank',
            logo: '/logos/axis.svg',
            color: '#800000',
        },
        [BankName.KOTAK]: {
            name: 'Kotak Mahindra Bank',
            logo: '/logos/kotak.svg',
            color: '#ED232A',
        },
    },

    // Cache settings
    cache: {
        duration: parseInt(process.env.CACHE_DURATION || '3600', 10), // in seconds
    },

    // Feature flags
    features: {
        mockData: process.env.ENABLE_MOCK_DATA === 'true',
        cardOffers: process.env.ENABLE_CARD_OFFERS === 'true',
        reviews: process.env.ENABLE_REVIEWS === 'true',
    },

    // Search settings
    search: {
        minQueryLength: 2,
        maxResults: 50,
        suggestionsLimit: 10,
    },

    // Pagination
    pagination: {
        defaultPageSize: 12,
        maxPageSize: 50,
    },
};

export default config;
