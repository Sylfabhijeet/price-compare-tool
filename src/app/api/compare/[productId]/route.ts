// API Route: Get price comparison for a product
// GET /api/compare/[productId]

import { NextRequest, NextResponse } from 'next/server';
import { getPriceComparison } from '@/lib/api/priceAggregator';
import { ApiResponse, PriceComparison } from '@/lib/types';

export async function GET(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const productId = params.productId;

        const comparison = await getPriceComparison(productId);

        if (!comparison) {
            const response: ApiResponse<PriceComparison> = {
                success: false,
                error: 'Product not found',
            };
            return NextResponse.json(response, { status: 404 });
        }

        const response: ApiResponse<PriceComparison> = {
            success: true,
            data: comparison,
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<PriceComparison> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get price comparison',
        };
        return NextResponse.json(response, { status: 500 });
    }
}
