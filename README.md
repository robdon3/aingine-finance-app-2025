# Aingen - Engine for the People

> "We hold these truths to be self-evident, that all people are endowed with certain unalienable rights, that among these are Life, Liberty and the pursuit of Happiness."

## Vision

Aingen is the **"Everything App"** for personal agency and wealth generation. In a world where time is traded for money but true value is obscured by inflation and complexity, Aingen provides the comprehensive tools for people to understand, visualize, and optimize their most precious resource: their time and its compound effects.

## The "Everything App" Philosophy

Aingen is not just a financial tool—it's a **life management engine** that understands the full context of human existence:

- **High school students** preparing for college decisions
- **Young professionals** navigating career choices and major purchases
- **Families** planning for children and education
- **Graduate students** balancing education costs with future earnings
- **Everyone** making decisions that compound over time

## Core Principles

### 1. **Privacy First**
- All data remains on the user's device
- No data mining or selling
- Local AI processing for personalization
- User owns their data completely

### 2. **Life Context Integration**
- Understands your age, education, family situation
- Factors in location-specific costs (insurance, taxes, housing)
- Tracks life milestones and their financial impact
- Adapts recommendations to your life stage

### 3. **True Cost Calculation**
- **Insurance rates** by state and item type
- **Maintenance costs** for vehicles, homes, education
- **Tax implications** of major purchases
- **Opportunity costs** of every dollar spent
- **Life context costs** (bigger house for growing family, etc.)

### 4. **Comprehensive Wealth Tracking**
- Net worth visualization with asset/liability breakdown
- Investment portfolio performance tracking
- Life milestone impact analysis
- Real-time commodity price monitoring
- Market condition awareness

### 5. **Ethical Foundation**
- Built on Catholic moral principles
- Serves people, not extracts from them
- Transparent and honest about limitations
- Community-driven development

## Key Features

### 🎯 **Life Context Manager**
- **Life Stage Tracking**: Early Career → Career Growth → Peak Earning → Pre-Retirement
- **Goal Management**: Education, family, career, financial, personal goals
- **Education Journey**: Track degrees, costs, and career impact
- **Family Context**: Marital status, children, dependents, family goals

### ⏰ **Time Value Calculator**
- Convert purchases to hours worked
- Show future value lost to spending
- Visual time-cost indicators
- Compound interest visualization

### 💰 **True Cost Calculator**
- **Insurance costs** by location and item type
- **Maintenance estimates** for different purchases
- **Tax calculations** for major expenses
- **Life context adjustments** (family planning, education level)
- **Market condition awareness** (gas prices, housing costs)

### 📊 **Net Worth Tracker**
- Comprehensive asset/liability breakdown
- Investment portfolio performance
- Life milestone tracking
- Wealth building insights
- Debt-to-asset ratio monitoring

### 🧠 **AI Personalization**
- Local pattern recognition
- Spending behavior analysis
- Opportunity detection
- Privacy-first recommendations
- Trend analysis

### 🔒 **Privacy Guard**
- Complete data sovereignty
- Local processing only
- No surveillance or tracking
- Transparent data handling

## The "Shelling Shovels" of the Digital Gold Rush

Just as the real wealth in any gold rush went to those providing the tools, Aingen provides the essential tools for navigating today's complex financial landscape:

- **For the high school student**: Understanding the true cost of college vs. career paths
- **For the young professional**: Making informed decisions about cars, homes, and investments
- **For the growing family**: Planning for children, education, and housing needs
- **For the graduate student**: Balancing education costs with future earning potential
- **For everyone**: Making decisions that compound in their favor over time

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **State Management**: Zustand for local state
- **Data Storage**: LocalForage for client-side persistence
- **AI**: Local processing with privacy-preserving algorithms
- **UI**: Tailwind CSS with modern, accessible design
- **Charts**: Recharts for data visualization

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the engine.

## Environment Setup

### Required Environment Variables

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

### Setup Steps

1. **Copy the example file**: `cp env.example .env.local`
2. **Get a FRED API key**: Visit [FRED API](https://fred.stlouisfed.org/docs/api/api_key.html) for free access
3. **Optional Redis setup**: Visit [Upstash](https://upstash.com/) for free Redis hosting
4. **Fill in your values**: Replace the placeholder values in `.env.local`

### Note on Redis

Redis is optional and only used for cloud storage features. The application will work without Redis, but some features like user data persistence across devices will be limited to local storage.

## The Aingen Manifesto

We believe in the power of individual agency. We believe that when people have the right tools and understanding, they can make decisions that compound in their favor over time. We believe that technology should serve human flourishing, not extract value from human attention.

This is not just an app. This is an **engine for the people**—a digital constitution for personal agency and wealth generation.

## Roadmap

### Phase 1: Foundation ✅
- Basic time value calculations
- Financial dashboard
- Privacy-first architecture

### Phase 2: Life Integration ✅
- Life context management
- True cost calculations
- Net worth tracking
- AI personalization

### Phase 3: Advanced Features (Coming Soon)
- Real-time market data integration
- Advanced investment analysis
- Community insights (privacy-preserving)
- Mobile application
- API for third-party integrations

### Phase 4: Ecosystem (Future)
- Educational content platform
- Community-driven insights
- Professional advisor network
- Open-source contributions

---

*"The best time to plant a tree was 20 years ago. The second best time is now."*

**Aingen** - Your engine for personal agency and wealth generation. 