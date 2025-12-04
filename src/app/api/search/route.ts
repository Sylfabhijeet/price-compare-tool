// API Route: Search products
// GET /api/search?q=query

import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAllProducts } from '@/lib/api/priceAggregator';
import { ApiResponse, SearchResult } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        let products;
        if (query && query.length >= 2) {
            products = await searchProducts(query);
        } else {
            products = await getAllProducts();
        }

        const response: ApiResponse<SearchResult> = {
            success: true,
            data: {
                products,
                total: products.length,
                page: 1,
                pageSize: products.length,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: ApiResponse<SearchResult> = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to search products',
        };
        return NextResponse.json(response, { status: 500 });
    }
}
