# Configuration Guide

This guide explains how to configure the PriceCompare application for your specific needs.

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Application Settings
NEXT_PUBLIC_APP_NAME="PriceCompare"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cache Settings (in seconds)
CACHE_DURATION=3600

# Feature Flags
ENABLE_MOCK_DATA=true
ENABLE_CARD_OFFERS=true
ENABLE_REVIEWS=true
```

### Environment Variable Descriptions

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name displayed in UI | "PriceCompare" |
| `NEXT_PUBLIC_APP_URL` | Base URL of the application | http://localhost:3000 |
| `CACHE_DURATION` | Cache duration in seconds | 3600 (1 hour) |
| `ENABLE_MOCK_DATA` | Use mock data instead of real APIs | true |
| `ENABLE_CARD_OFFERS` | Enable card offers feature | true |
| `ENABLE_REVIEWS` | Enable reviews feature | true |

## Adding New E-commerce Platforms

To add a new e-commerce platform:

### 1. Update Types

Edit `src/lib/types.ts`:

```typescript
export enum Platform {
  AMAZON = 'Amazon',
  FLIPKART = 'Flipkart',
  MYNTRA = 'Myntra',
  SNAPDEAL = 'Snapdeal',
  AJIO = 'Ajio',
  YOUR_PLATFORM = 'Your Platform Name', // Add this
}
```

### 2. Update Configuration

Edit `src/lib/config.ts`:

```typescript
platforms: {
  // ... existing platforms
  [Platform.YOUR_PLATFORM]: {
    name: 'Your Platform Name',
    logo: '/logos/your-platform.svg',
    color: '#YOUR_COLOR',
    baseUrl: 'https://www.yourplatform.com',
  },
}
```

### 3. Add Mock Data (Development)

Edit `src/lib/api/mockData.ts` to add sample prices and reviews for the new platform.

### 4. Implement Real API Integration

Create a new file `src/lib/api/platforms/yourPlatform.ts`:

```typescript
import { Price, Product } from '@/lib/types';

export async function fetchPriceFromYourPlatform(
  productId: string
): Promise<Price | null> {
  // Implement API call or web scraping logic
  // Return price data in the standard format
}

export async function searchProductsOnYourPlatform(
  query: string
): Promise<Product[]> {
  // Implement search logic
  // Return products in standard format
}
```

## Configuring Card Offers

### Adding New Banks

Edit `src/lib/types.ts`:

```typescript
export enum BankName {
  HDFC = 'HDFC Bank',
  ICICI = 'ICICI Bank',
  SBI = 'State Bank of India',
  AXIS = 'Axis Bank',
  KOTAK = 'Kotak Mahindra Bank',
  YOUR_BANK = 'Your Bank Name', // Add this
}
```

Edit `src/lib/config.ts`:

```typescript
banks: {
  // ... existing banks
  [BankName.YOUR_BANK]: {
    name: 'Your Bank Name',
    logo: '/logos/your-bank.svg',
    color: '#YOUR_COLOR',
  },
}
```

### Adding New Offers

Edit `src/lib/api/mockData.ts`:

```typescript
export const mockCardOffers: CardOffer[] = [
  // ... existing offers
  {
    id: 'offer-new',
    bank: BankName.YOUR_BANK,
    cardType: CardType.CREDIT,
    discountPercentage: 10,
    maxDiscount: 5000,
    minPurchase: 10000,
    description: 'Your offer description',
    termsAndConditions: 'Your terms and conditions',
    validUntil: new Date('2024-12-31'),
    applicablePlatforms: [Platform.AMAZON, Platform.FLIPKART],
  },
];
```

## Cache Configuration

The application uses in-memory caching for API responses. Configure cache duration in `.env`:

```bash
CACHE_DURATION=3600  # 1 hour in seconds
```

For production, consider implementing:
- Redis cache
- CDN caching
- Database caching

## Search Configuration

Edit `src/lib/config.ts`:

```typescript
search: {
  minQueryLength: 2,        // Minimum characters to trigger search
  maxResults: 50,           // Maximum results to return
  suggestionsLimit: 10,     // Number of autocomplete suggestions
},
```

## Pagination Configuration

Edit `src/lib/config.ts`:

```typescript
pagination: {
  defaultPageSize: 12,      // Products per page
  maxPageSize: 50,          // Maximum allowed page size
},
```

## Customizing UI Theme

### Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: #6366f1;        /* Primary color */
  --secondary: #ec4899;      /* Secondary color */
  --accent: #8b5cf6;         /* Accent color */
  /* ... other colors */
}
```

### Animations

Edit `tailwind.config.ts` to add custom animations:

```typescript
theme: {
  extend: {
    animation: {
      'your-animation': 'yourKeyframes 2s ease-in-out infinite',
    },
    keyframes: {
      yourKeyframes: {
        '0%, 100%': { /* ... */ },
        '50%': { /* ... */ },
      },
    },
  },
}
```

## API Integration

### Using Real E-commerce APIs

1. Obtain API keys from e-commerce platforms
2. Add API keys to `.env`:
   ```bash
   AMAZON_API_KEY=your_amazon_api_key
   FLIPKART_API_KEY=your_flipkart_api_key
   ```
3. Update `ENABLE_MOCK_DATA=false` in `.env`
4. Implement API integration in `src/lib/api/priceAggregator.ts`

### Web Scraping (Alternative)

If official APIs are not available:

1. Install scraping dependencies:
   ```bash
   npm install cheerio puppeteer
   ```
2. Implement scraping logic in `src/lib/api/scrapers/`
3. Consider using proxy services to avoid IP blocking
4. Respect robots.txt and terms of service

## Performance Optimization

### Image Optimization

Add e-commerce image domains to `next.config.js`:

```javascript
images: {
  domains: [
    'images.unsplash.com',
    'images-na.ssl-images-amazon.com',
    'rukminim2.flixcart.com',
    // Add more domains as needed
  ],
}
```

### Caching Strategy

Implement ISR (Incremental Static Regeneration):

```typescript
// In page components
export const revalidate = 3600; // Revalidate every hour
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting for API routes
3. **CORS**: Configure CORS properly in production
4. **Input Validation**: Validate all user inputs
5. **XSS Protection**: Sanitize user-generated content

## Production Checklist

- [ ] Set `ENABLE_MOCK_DATA=false`
- [ ] Configure real API keys
- [ ] Set up proper caching (Redis/CDN)
- [ ] Enable rate limiting
- [ ] Configure analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up SSL/HTTPS
- [ ] Configure SEO metadata

## Troubleshooting

### Common Issues

**Issue**: Products not loading
- Check if `ENABLE_MOCK_DATA` is set correctly
- Verify API keys are valid
- Check network connectivity

**Issue**: Slow performance
- Increase `CACHE_DURATION`
- Implement database caching
- Use CDN for static assets

**Issue**: Styling not applied
- Run `npm run build` to regenerate CSS
- Clear browser cache
- Check Tailwind configuration

For more help, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) or open an issue on GitHub.
