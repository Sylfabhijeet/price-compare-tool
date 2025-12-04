// Flipkart product scraper

import { BaseScraper, ScrapedProduct } from './base';
import { parsePrice, parseRating, cleanText } from './utils';

export class FlipkartScraper extends BaseScraper {
    async scrapeProduct(url: string): Promise<ScrapedProduct> {
        try {
            const html = await this.fetchHtml(url);
            const $ = this.parseHtml(html);

            // Extract product title
            const title = cleanText(
                $('span.VU-ZEz').text() ||
                $('span.B_NuCI').text() ||
                $('h1.yhB1nd').text() ||
                $('.B_NuCI').text() ||
                ''
            );

            // Extract current price
            const priceText =
                $('.Nx9bqj.CxhGGd').text() ||
                $('._30jeq3._16Jk6d').text() ||
                $('._30jeq3').text() ||
                '';
            const price = parsePrice(priceText);

            // Extract original price (if on sale)
            const originalPriceText =
                $('.yRaY8j.A6+E6v').text() ||
                $('._3I9_wc._27UcVY').text() ||
                $('._3I9_wc').text() ||
                '';
            const originalPrice = parsePrice(originalPriceText) || price;

            // Extract image URL
            const imageUrl =
                $('._396cs4._2amPTt._3qGmMb').attr('src') ||
                $('img._2r_T1I').attr('src') ||
                $('img._396cs4').attr('src') ||
                null;

            // Extract rating
            const ratingText =
                $('.XQDdHH').text() ||
                $('div._3LWZlK').text() ||
                '';
            const rating = parseRating(ratingText);

            // Extract review count
            const reviewText =
                $('span._2_R_DZ').text() ||
                $('span.Wphh3N').text() ||
                '';
            const reviewCount = parseInt(reviewText.replace(/[^\d]/g, '')) || null;

            // Check stock status
            const stockText = $('._16FRp0').text().toLowerCase();
            const inStock = !stockText.includes('out of stock') &&
                !stockText.includes('sold out') &&
                !stockText.includes('currently unavailable');

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
            console.error('Flipkart scraping error:', error);
            throw new Error(`Failed to scrape Flipkart product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export const flipkartScraper = new FlipkartScraper();
