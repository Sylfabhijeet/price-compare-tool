// Amazon product scraper

import { BaseScraper, ScrapedProduct } from './base';
import { parsePrice, parseRating, cleanText } from './utils';

export class AmazonScraper extends BaseScraper {
    async scrapeProduct(url: string): Promise<ScrapedProduct> {
        try {
            const html = await this.fetchHtml(url);
            const $ = this.parseHtml(html);

            // Extract product title
            const title = cleanText(
                $('#productTitle').text() ||
                $('h1.a-size-large').text() ||
                $('span#productTitle').text() ||
                ''
            );

            // Extract current price
            const priceText =
                $('.a-price-whole').first().text() ||
                $('#priceblock_ourprice').text() ||
                $('#priceblock_dealprice').text() ||
                $('.a-price .a-offscreen').first().text() ||
                '';
            const price = parsePrice(priceText);

            // Extract original price (if on sale)
            const originalPriceText =
                $('.a-text-price .a-offscreen').first().text() ||
                $('#priceblock_saleprice').text() ||
                '';
            const originalPrice = parsePrice(originalPriceText) || price;

            // Extract image URL
            const imageUrl =
                $('#landingImage').attr('src') ||
                $('#imgBlkFront').attr('src') ||
                $('.a-dynamic-image').first().attr('src') ||
                null;

            // Extract rating
            const ratingText =
                $('span.a-icon-alt').first().text() ||
                $('.a-star-4-5 .a-icon-alt').text() ||
                '';
            const rating = parseRating(ratingText);

            // Extract review count
            const reviewText =
                $('#acrCustomerReviewText').text() ||
                $('span[data-hook="total-review-count"]').text() ||
                '';
            const reviewCount = parseInt(reviewText.replace(/[^\d]/g, '')) || null;

            // Check stock status
            const availability = $('#availability').text().toLowerCase();
            const inStock = !availability.includes('out of stock') &&
                !availability.includes('unavailable') &&
                !availability.includes('currently unavailable');

            const scrapedData: ScrapedProduct = {
                title,
                price,
                originalPrice,
                imageUrl,
                rating,
                reviewCount,
                inStock,
                url,
            };

            this.validateScrapedData(scrapedData);
            return scrapedData;
        } catch (error) {
            console.error('Amazon scraping error:', error);
            throw new Error(`Failed to scrape Amazon product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const amazonScraper = new AmazonScraper();
