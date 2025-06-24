# FRED API Integration for Aingen

Aingen uses the Federal Reserve Economic Data (FRED) API to provide real-time economic and financial data for accurate tax calculations and financial analysis.

## Getting Your FRED API Key

1. Visit the FRED API key registration page: https://fred.stlouisfed.org/docs/api/api_key.html
2. Fill out the registration form with your application details
3. You will receive an API key via email

## Application Information

**Application Name:** Aingen - Privacy-First Financial Decision Engine

**Application Description:**  
Aingen is a local-first, privacy-focused financial and life decision-making application that helps users understand the true cost of decisions in terms of time, money, and compound interest. The application serves individual users making personal financial decisions and requires access to current, authoritative economic data to provide accurate financial calculations and insights.

## Application Description for FRED Registration

Use this description when registering for your FRED API key:

```
Project Aegis - Privacy-First Financial Decision Engine

Project Aegis is a local-first, privacy-focused financial and life decision-making application that helps users understand the true cost of decisions in terms of time, money, and compound interest. The application is grounded in ethical values and aims to empower users with personal agency while protecting their data from exploitation.

Intended Use of FRED Data:
- Real-time tax rate validation and comparison
- State and local government finance data for accurate cost calculations
- Economic indicators for inflation and interest rate analysis
- Historical tax data for trend analysis and forecasting

Technical Implementation:
- Client-side application built with Next.js and TypeScript
- All data processing occurs locally on user devices
- No user data is transmitted to external servers
- FRED API calls are made directly from user browsers for real-time data validation
- Data is cached locally for 24 hours to minimize API calls

Data Usage:
- Tax rate validation against official government sources
- True cost calculations including taxes, inflation, and opportunity costs
- Financial dashboard with current economic indicators
- Location-specific financial planning based on state tax policies

Privacy & Security:
- No user financial data is stored or transmitted
- All calculations performed locally
- API keys are stored securely in user's local environment
- No data mining or commercial use of user information

The application serves individual users making personal financial decisions and requires access to current, authoritative economic data to provide accurate financial calculations and insights.
```

## Configuration

1. Create a `.env.local` file in your project root
2. Add your FRED API key:

```bash
# FRED API Configuration
FRED_API_KEY=your_actual_api_key_here
```

## Important Terms of Use Compliance

By using the FRED API, you agree to comply with the [FRED API Terms of Use](https://fred.stlouisfed.org/docs/api/terms_of_use.html). Key requirements include:

### Rate Limiting
- **Limit**: 120 requests per minute
- **Implementation**: The application includes built-in rate limiting
- **Caching**: 24-hour cache to minimize API calls

### Attribution Requirements
- **Required**: "Economic data provided by Federal Reserve Bank of St. Louis via FRED API"
- **Implementation**: Displayed in the application interface

### Prohibited Uses
- No replication of FRED's essential user experience
- No malicious or harmful applications
- No unauthorized commercial use
- No violation of third-party data copyrights

### Data Usage
- Personal use and financial decision-making only
- No redistribution of raw FRED data
- Proper handling of copyrighted series

## API Series Used

The application uses these FRED series for government finance data:

- `SLGSI` - State and Local Government: State and Local Income and Other Taxes
- `SLGSST` - State and Local Government: State and Local Sales and Gross Receipts Taxes
- `SLGSPT` - State and Local Government: State and Local Property Taxes
- `SLGSGT` - State and Local Government: State and Local Excise Taxes

### FRED API Endpoints Used

Based on the [official FRED API documentation](https://fred.stlouisfed.org/docs/api/fred/), the application uses these endpoints:

1. **fred/series/observations** - Get the observations or data values for an economic data series
   - Used to fetch the most recent tax and government finance data
   - Parameters: `series_id`, `api_key`, `file_type=json`, `sort_order=desc`, `limit=1`

2. **fred/series/search** - Get economic data series that match keywords
   - Used to search for relevant tax and government finance series
   - Parameters: `search_text`, `api_key`, `file_type=json`, `limit=10`

3. **fred/series** - Get an economic data series
   - Used to get detailed information about specific series
   - Parameters: `series_id`, `api_key`, `file_type=json`

### Data Structure

The FRED API returns data in the following structure:

```json
{
  "observations": [
    {
      "realtime_start": "2024-01-01",
      "realtime_end": "2024-01-01",
      "date": "2023-12-31",
      "value": "1234.56"
    }
  ]
}
```

### Rate Limiting

- **Limit**: 120 requests per minute (as per FRED API terms)
- **Implementation**: Built-in rate limiting with request counting
- **Caching**: 24-hour cache to minimize API calls

## Support

For FRED API support:
- Documentation: https://fred.stlouisfed.org/docs/api/
- Terms of Use: https://fred.stlouisfed.org/docs/api/terms_of_use.html
- Contact: https://fred.stlouisfed.org/support/

## Security Notes

- Never commit your API key to version control
- Use environment variables for API key storage
- The application stores API keys locally only
- No server-side storage of API keys 