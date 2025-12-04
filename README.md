# PriceCompare - E-commerce Price Comparison Platform

A comprehensive price comparison website that helps users find the best deals across major e-commerce platforms including Amazon, Flipkart, Myntra, Snapdeal, and Ajio. Compare prices, discover offers, apply credit/debit card discounts, and read aggregated reviews - all in one place.

![PriceCompare](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80)

## ✨ Features

### 🔍 Smart Search
- Fast product search across all platforms
- Real-time search suggestions
- Category-based filtering

### 💰 Price Comparison
- Compare prices from multiple e-commerce platforms
- See both original and discounted prices
- Identify the best deal instantly
- Track price history (coming soon)

### 🎁 Card Offers Integration
- View applicable credit/debit card offers
- Calculate final price with card discounts
- Filter offers by bank and card type
- See combined savings (platform + card discounts)

### ⭐ Aggregated Reviews
- Consolidated ratings from all platforms
- Weighted average ratings
- Review highlights and sentiment analysis
- Platform-wise rating breakdown

### 🎨 Premium UI/UX
- Modern glassmorphism design
- Dark theme with vibrant gradients
- Smooth animations and transitions
- Fully responsive layout
- Optimized for mobile and desktop

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS with glassmorphism effects
- **Icons**: Lucide React
- **Data Fetching**: SWR, Axios
- **Build Tool**: Next.js built-in bundler

## 📦 Installation

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd Price-Compare-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings (see [Configuration Guide](./CONFIGURATION.md))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📁 Project Structure

```
Price-Compare-Website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── search/        # Product search endpoint
│   │   │   ├── compare/       # Price comparison endpoint
│   │   │   └── offers/        # Card offers endpoint
│   │   ├── product/[id]/      # Product detail page
│   │   ├── search/            # Search results page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── SearchBar.tsx      # Search input component
│   │   ├── ProductCard.tsx    # Product card component
│   │   ├── PriceComparison.tsx # Price comparison table
│   │   ├── OfferCard.tsx      # Card offer display
│   │   └── ReviewSection.tsx  # Review aggregation
│   └── lib/                   # Utilities and logic
│       ├── api/               # API logic
│       │   ├── priceAggregator.ts    # Price fetching
│       │   ├── offerCalculator.ts    # Discount calculations
│       │   ├── reviewAggregator.ts   # Review aggregation
│       │   └── mockData.ts           # Mock data for development
│       ├── types.ts           # TypeScript type definitions
│       └── config.ts          # Configuration settings
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Configuration

See [CONFIGURATION.md](./CONFIGURATION.md) for detailed configuration options including:
- Adding new e-commerce platforms
- Configuring card offers
- Setting up API integrations
- Customizing cache settings

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for:
- API endpoint specifications
- Request/response formats
- Integration examples
- Error handling

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Accent**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- System fonts with fallbacks
- Responsive font sizes
- Gradient text effects

### Components
- Glassmorphism cards
- Gradient buttons
- Smooth hover effects
- Loading skeletons

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Self-hosted with Docker

## 🔮 Future Enhancements

- [ ] Real-time price tracking
- [ ] Price drop alerts
- [ ] User accounts and wishlists
- [ ] Price history charts
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Integration with real e-commerce APIs
- [ ] Advanced filtering and sorting
- [ ] Product recommendations
- [ ] Comparison lists

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- Unsplash for product images

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js and TypeScript**
