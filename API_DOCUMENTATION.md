# API Documentation

Complete API reference for the PriceCompare platform.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Endpoints

### 1. Search Products

Search for products across all platforms.

**Endpoint**: `GET /api/search`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query (min 2 characters) |

**Example Request**:
```bash
GET /api/search?q=iphone
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "1",
        "name": "Apple iPhone 15 Pro (256GB) - Natural Titanium",
        "description": "FORGED IN TITANIUM — iPhone 15 Pro has a strong and light aerospace-grade titanium design...",
        "category": "Electronics",
        "brand": "Apple",
        "imageUrl": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 1
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to search products"
}
```

---

### 2. Get Price Comparison

Get detailed price comparison for a specific product.

**Endpoint**: `GET /api/compare/:productId`

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productId` | string | Yes | Product ID |

**Example Request**:
```bash
GET /api/compare/1
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "1",
      "name": "Apple iPhone 15 Pro (256GB) - Natural Titanium",
      "description": "...",
      "category": "Electronics",
      "brand": "Apple",
      "imageUrl": "..."
    },
    "prices": [
      {
        "platform": "Amazon",
        "productUrl": "https://amazon.in/product/1",
        "originalPrice": 134900,
        "discountedPrice": 129900,
        "discount": 3.7,
        "inStock": true,
        "lastUpdated": "2024-12-03T17:04:37.000Z"
      },
      {
        "platform": "Flipkart",
        "productUrl": "https://flipkart.com/product/1",
        "originalPrice": 134900,
        "discountedPrice": 127900,
        "discount": 5.2,
        "inStock": true,
        "lastUpdated": "2024-12-03T17:04:37.000Z"
      }
    ],
    "bestDeal": {
      "platform": "Flipkart",
      "price": 127900,
      "savings": 7000,
      "savingsPercentage": 5.2
    },
    "applicableOffers": [
      {
        "id": "offer-1",
        "bank": "HDFC Bank",
        "cardType": "Credit Card",
        "discountPercentage": 10,
        "maxDiscount": 5000,
        "minPurchase": 10000,
        "description": "10% Instant Discount on HDFC Bank Credit Cards",
        "termsAndConditions": "Valid on purchases above ₹10,000...",
        "validUntil": "2024-12-31T00:00:00.000Z",
        "applicablePlatforms": ["Amazon", "Flipkart"]
      }
    ],
    "reviews": [
      {
        "platform": "Amazon",
        "rating": 4.6,
        "totalReviews": 12453,
        "highlights": ["Excellent camera quality", "Premium titanium build", "Great battery life"],
        "sentiment": "positive"
      }
    ],
    "averageRating": 4.55
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### 3. Get Card Offers

Get all available card offers.

**Endpoint**: `GET /api/offers`

**Example Request**:
```bash
GET /api/offers
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "offer-1",
      "bank": "HDFC Bank",
      "cardType": "Credit Card",
      "discountPercentage": 10,
      "maxDiscount": 5000,
      "minPurchase": 10000,
      "description": "10% Instant Discount on HDFC Bank Credit Cards",
      "termsAndConditions": "Valid on purchases above ₹10,000. Maximum discount ₹5,000. Valid till 31st Dec 2024.",
      "validUntil": "2024-12-31T00:00:00.000Z",
      "applicablePlatforms": ["Amazon", "Flipkart"]
    }
  ]
}
```

---

## Data Models

### Product

```typescript
{
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  brand?: string;
}
```

### Price

```typescript
{
  platform: 'Amazon' | 'Flipkart' | 'Myntra' | 'Snapdeal' | 'Ajio';
  productUrl: string;
  originalPrice: number;        // Price in INR (paise)
  discountedPrice: number;      // Price in INR (paise)
  discount: number;             // Percentage
  inStock: boolean;
  lastUpdated: Date;
}
```

### CardOffer

```typescript
{
  id: string;
  bank: 'HDFC Bank' | 'ICICI Bank' | 'State Bank of India' | 'Axis Bank' | 'Kotak Mahindra Bank';
  cardType: 'Credit Card' | 'Debit Card';
  discountPercentage: number;
  maxDiscount: number;          // In INR (paise)
  minPurchase: number;          // In INR (paise)
  description: string;
  termsAndConditions: string;
  validUntil: Date;
  applicablePlatforms: Platform[];
}
```

### Review

```typescript
{
  platform: Platform;
  rating: number;               // Out of 5
  totalReviews: number;
  highlights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there are no rate limits in development mode. In production:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Search products
const searchProducts = async (query: string) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.data.products;
};

// Get price comparison
const getPriceComparison = async (productId: string) => {
  const response = await fetch(`/api/compare/${productId}`);
  const data = await response.json();
  return data.data;
};

// Get card offers
const getCardOffers = async () => {
  const response = await fetch('/api/offers');
  const data = await response.json();
  return data.data;
};
```

### Using SWR (Recommended)

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// In your component
const { data, error, isLoading } = useSWR('/api/search?q=iphone', fetcher);
```

### Using Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Search products
const products = await api.get('/search', { params: { q: 'iphone' } });

// Get comparison
const comparison = await api.get('/compare/1');

// Get offers
const offers = await api.get('/offers');
```

---

## Webhooks (Future)

Webhook support for price drop alerts and offer updates is planned for future releases.

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Search products endpoint
- Price comparison endpoint
- Card offers endpoint
- Mock data implementation

### Future Versions
- Real-time price tracking
- Price history endpoint
- User authentication
- Wishlist management
- Price drop alerts

---

For more information, see [README.md](./README.md) or [CONFIGURATION.md](./CONFIGURATION.md).
