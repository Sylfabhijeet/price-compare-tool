// API Route: Scrape products from URLs
// POST /api/scrape

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { scrapeMultipleProducts } from '@/lib/scrapers';
import { ApiResponse } from '@/lib/types';

export interface ScrapeRequest {
    urls: string[];
}

export interface ScrapeResponse {
    products: any[];
    errors: { url: string; error: string }[];
}

export async function POST(request: NextRequest) {
    try {
        const body: ScrapeRequest = await request.json();
        const { urls } = body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            const response: ApiResponse<ScrapeResponse> = {
                success: false,
                error: 'Please provide an array of product URLs',
            };
            return NextResponse.json(response, { status: 400 });
        }

        if (urls.length > 10) {
            const response: ApiResponse<ScrapeResponse> = {
                success: false,
                error: 'Maximum 10 URLs allowed per request',
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Scrape all products
        const { success, errors } = await scrapeMultipleProducts(urls);

        const response: ApiResponse<ScrapeResponse> = {
            success: true,
            data: {
                products: success,
                errors,
            },
            message: `Successfully scraped ${success.length} out of ${urls.length} products`,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Scraping API error:', error);
        const response: ApiResponse<ScrapeResponse> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to scrape products',
        };
        return NextResponse.json(response, { status: 500 });
    }
}
