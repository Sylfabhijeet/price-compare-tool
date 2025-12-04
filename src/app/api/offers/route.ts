// API Route: Get available card offers
// GET /api/offers

import { NextResponse } from 'next/server';
import { getCardOffers } from '@/lib/api/priceAggregator';
import { ApiResponse, CardOffer } from '@/lib/types';

export async function GET() {
    try {
        const offers = await getCardOffers();

        const response: ApiResponse<CardOffer[]> = {
            success: true,
            data: offers,
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<CardOffer[]> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get card offers',
        };
        return NextResponse.json(response, { status: 500 });
    }
}
