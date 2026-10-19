# Aingen

A Next.js personal finance and life dashboard. It is a browser app for comparing the time cost and full cost of decisions, not a connection to a bank.

The signed-in shell and the sign-in screen are labeled **Aegis Engine** (`package.json` name `aegis-engine`). There is no bank, card, or brokerage link.

**All household data in this repo is sample data.** Balances, pay, debts, investments, life goals, and insight cards are invented figures for the UI. They are not a real ledger, and no account numbers are stored in the repo.

## Sample household data

Nothing in the household screens is a live account.

- **Financial health, net worth, and life context** seed sample series when the page loads: round monthly balances, sample assets and debts, sample investments (including an "S&P 500 ETF" and "Bitcoin" line), and sample goals such as an MBA or a first home. Those components skip the seed only if a blank-data flag is already in `localStorage`. The sign-in screen does not set that flag.
- **AI insight cards** and the spending-pattern list are fixed sample text in `components/AIPersonalization.tsx`. They are not computed from anything the user entered, and they are not a trained model.
- **Fuel prices** are a bundled snapshot in `components/GasPriceService.ts` (commented as AAA figures as of 6/19/25), not a live price feed.
- **Inflation, interest rates, stocks, and crypto** on the true-cost calculator and the data-sources panel are constants in the client. The data-sources panel waits briefly and then returns those constants. It does not call BLS, FRED, Yahoo, or CoinGecko.
- **Location housing, rent, unemployment, income, and cost of living** are random numbers generated in `components/LocationManager.tsx`. Gas prices on that screen come from the same bundled snapshot.
- **A fictional "John Doe" household** (Jane Doe, Emma Doe, employer "Tech Corp", round balances, institution names such as Chase and Fidelity) is source in `components/AccountManager.tsx`, along with "Start Fresh with Blank Data" and "Start Fresh with Sample Data". `app/page.tsx` does not import that component, so those names and buttons are not on the signed-in screen. The blank-data keys also disagree: financial health and life context read `aegis_started_with_blank_data`, while net worth and `AccountManager` use `aingen_started_with_blank_data`.

Census and tax tables are bundled reference data, not this household. See below.

## What it is

After a local sign-in, a tabbed screen covers:

- main dashboard
- fuel cost analyzer
- true cost calculator
- financial health
- net worth tracker
- time value calculator
- life context
- location manager
- AI insights
- system monitoring (reads `logs/health-report.json` through `/api/health`, or reports unknown if that file is missing; the sidebar CPU and memory percentages are hardcoded)
- account manager (local profiles, import/export, and a local-vs-cloud preference — this tab mounts `UserManager`, not the John Doe ledger)
- data sources
- FRED API key setting
- Census panel
- tax policy updater and tax data validator
- privacy panel

The Census panel states that no API key is required. State population, income, poverty, and housing figures come from the `publicCensusData` table in `components/CensusAPIService.ts`, not from a live Census call.

Tax rates used by the true-cost calculator come from the static table in `data/locations.ts` (or from rates the user saved in the browser). `components/TaxAPIService.ts` also carries a hardcoded state tax table and can request FRED series when a key is present.

## Problem

Everyday money choices hide maintenance, tax, and opportunity cost. Aingen is a single place to enter those inputs and see them together. Household figures you see before you type anything are samples.

## Approach

```text
Browser (Next.js / React)
  login form (labeled Aegis Engine)
  localStorage (user records, preferences, API keys, section data)
  calculators and trackers (sample seeds until you replace them)
        │
        ├─ optional  /api/redis/*     Upstash Redis
        ├─ optional  /api/fred/*      FRED series (key from the request)
        └─ Census and tax figures     bundled tables, no live Census call
```

Persistence is `window.localStorage` through `lib/storageManager.ts`. `localforage` is listed in `package.json` and is not imported.

Passwords are hashed in the browser with unsalted SHA-256 (`js-sha256`) and stored on the user record. Registration writes that record to `localStorage` and also posts the user list to `/api/redis/users`. New accounts default to a cloud storage preference; section data is still copied locally. This is not a server-side identity provider.

"AI insights" are the local sample cards described above.

The calculators show built-in rates (for example inflation 3.2% and a savings rate of 4.5%) without a FRED key. `FRED_API_KEY`, or a key saved in the FRED settings tab (`aegis_fred_api_key`), is what `TaxAPIService` sends to `/api/fred`. If neither is set, that service uses the literal key `demo`. Redis is optional: `lib/cloudStorage.ts` leaves the client unset when Upstash env vars are missing, and user-data reads fall back to `localStorage`.

## Run

Node.js 18+.

```bash
npm install
cp env.example .env.local   # optional; file contains placeholders only
npm run dev
# http://localhost:3000
```

`FRED_API_KEY` is for live Federal Reserve series through the tax service. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` turn on the cloud-storage routes. The app still runs, on local storage, when those values are missing or not real credentials. `env.example` ships placeholders such as `your_fred_api_key_here`, not blanks.

```bash
npm run lint
npm run build
npm start          # production server after build
npm run monitor    # node scripts/monitor.js
```

Playwright tests live in `tests/e2e.spec.ts` (`@playwright/test` is a dev dependency; there is no `npm test` script). They register users at `@example.com` and do not enter household figures. The spec still looks for older sign-in copy ("Aingen", "Sign in to your account", "Your Agency Dashboard"). The current screen says "Aegis Engine" and "Authenticate".

## Tech

Used by the running app: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide, `js-sha256`, `uuid`, and the Upstash Redis client when configured.

Declared in `package.json` and not imported by the mounted screens: localForage, Zustand, Recharts, and `date-fns`. Papa Parse is imported only by the unmounted `components/AccountManager.tsx` CSV export. Playwright is a dev dependency.
