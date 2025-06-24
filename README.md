# Aingen - Engine for the People

> "We hold these truths to be self-evident, that all people are endowed with certain unalienable rights, that among these are Life, Liberty and the pursuit of Happiness."

## Vision

Aingen is a **comprehensive personal finance and life management application** designed to help people understand, visualize, and optimize their financial decisions through the lens of time value and true cost analysis. In a world where financial decisions have complex, long-term implications, Aingen provides the tools to make informed choices that compound in your favor over time.

## What Aingen Actually Does

Aingen is a **Next.js-based web application** that provides:

- **Financial Dashboard**: Overview of your financial health and key metrics
- **Fuel Cost Management**: Track and analyze fuel expenses with real-time price data
- **True Cost Calculator**: Calculate the full cost of purchases including maintenance, insurance, and opportunity costs
- **Net Worth Tracker**: Monitor your assets, liabilities, and overall financial position
- **Time Value Calculator**: Convert purchases to hours worked and visualize opportunity costs
- **Life Context Manager**: Track life stages, goals, and how they impact financial decisions
- **Location-Based Analysis**: Factor in location-specific costs like taxes and insurance
- **AI-Powered Insights**: Local pattern recognition and spending behavior analysis
- **Privacy-First Design**: Your data stays on your device with optional cloud backup

## Core Features (Currently Implemented)

### 🔥 **Most Used Features**
- **Dashboard**: Central overview of your financial health
- **Fuel Cost Manager**: Track gas prices and fuel expenses
- **True Cost Calculator**: Calculate total cost of ownership for purchases
- **Financial Health**: Monitor key financial metrics and ratios
- **Net Worth Tracker**: Track assets, liabilities, and net worth over time

### 📊 **Regular Use Features**
- **Time Value Calculator**: Convert money to time and visualize opportunity costs
- **Life Context Manager**: Track life stages, education, family, and career goals
- **Location Manager**: Set your location for accurate cost calculations
- **AI Insights**: Local pattern recognition and spending analysis
- **System Monitoring**: Monitor application health and data sources

### ⚙️ **Setup & Configuration**
- **Account Manager**: User authentication and profile management
- **Data Sources**: Configure and manage external data connections
- **FRED API**: Economic data integration for market insights
- **Census API**: Demographic and location data integration
- **Tax Policy**: Configure tax rates and policies for calculations
- **Tax Validator**: Validate tax data and calculations
- **Privacy Guard**: Control data privacy and storage settings

## Technical Architecture

- **Frontend**: Next.js 14 with TypeScript and React 18
- **Styling**: Tailwind CSS with dark/light theme support
- **State Management**: React hooks and local state
- **Data Storage**: LocalForage for client-side persistence with optional Redis cloud storage
- **Authentication**: Secure password system with SHA-256 hashing
- **Data Visualization**: Recharts for charts and graphs
- **External APIs**: FRED (Federal Reserve Economic Data), Census Bureau
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aegis-engine

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

### Environment Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# FRED API Configuration (Required for economic data)
# Get your free API key from: https://fred.stlouisfed.org/docs/api/api_key.html
FRED_API_KEY=your_fred_api_key_here

# Upstash Redis Configuration (Optional - for cloud storage features)
# Get your Redis credentials from: https://upstash.com/
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Visit `http://localhost:3000` to access the application.

## Key Features Explained

### Privacy-First Design
- **Local Processing**: All calculations and analysis happen on your device
- **Optional Cloud Storage**: Redis integration for cross-device data sync (optional)
- **No Data Mining**: Your financial data never leaves your control
- **Transparent Storage**: Clear visibility into where and how your data is stored

### True Cost Analysis
- **Insurance Costs**: Location-specific insurance rate calculations
- **Maintenance Estimates**: Realistic maintenance cost projections
- **Tax Implications**: Tax calculations for major purchases
- **Opportunity Costs**: What you could earn if you invested instead
- **Life Context**: How your life stage affects financial decisions

### Time Value Perspective
- **Hours Worked**: Convert purchases to hours of your time
- **Future Value**: Show what money could be worth if invested
- **Compound Effects**: Visualize how small decisions compound over time
- **Life Stage Context**: Different time value at different life stages

## Current Limitations

- **Web Application**: Currently a web app, not a mobile app
- **Manual Data Entry**: Most data needs to be entered manually
- **Limited Integrations**: Basic API integrations with FRED and Census data
- **Local AI**: AI features are basic pattern recognition, not advanced ML
- **Single User**: Designed for individual use, not family sharing

## Roadmap

### Phase 1: Foundation ✅
- Basic financial dashboard
- User authentication system
- Privacy-first architecture
- Core calculation engines

### Phase 2: Core Features ✅
- True cost calculator
- Net worth tracking
- Time value analysis
- Life context management
- Location-based calculations

### Phase 3: Enhanced Features (In Progress)
- Advanced data integrations
- Improved AI insights
- Better data visualization
- Performance optimizations

### Phase 4: Future Enhancements
- Mobile application
- Family/team features
- Advanced investment analysis
- Community insights (privacy-preserving)
- API for third-party integrations

## Contributing

This is a personal project focused on individual financial empowerment. The codebase is designed to be transparent and educational, showing how to build privacy-first financial applications.

## License

MIT License - See LICENSE file for details.

---

*"The best time to plant a tree was 20 years ago. The second best time is now."*

**Aingen** - Your engine for informed financial decisions and personal agency. 