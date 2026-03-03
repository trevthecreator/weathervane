# Weathervane — All-Weather Portfolio Watchlist

Real-time portfolio dashboard with macro regime analysis, inspired by Ray Dalio's All-Weather framework.

## Architecture

**Yahoo Finance** — Historical price data (1D, YTD, 6M, 1Y, 5Y returns + sparklines). Loaded on page open in batches of 20.

**Finnhub WebSocket** — Real-time streaming prices during market hours. Single persistent connection for all tickers. Crypto (BTC/ETH) streams 24/7.

**FRED API** — Federal Reserve macro data: yield curve, credit spreads, Fed Funds rate, CPI, M2, industrial production, LEI.

**Cloudflare Pages Function** — `/api/proxy` routes Yahoo and FRED calls through your own domain to avoid CORS issues.

## Data Sources

| Data | Source | Update Frequency |
|------|--------|-----------------|
| Current price | Finnhub WebSocket | Real-time |
| Historical returns | Yahoo Finance | On page load + 5min refresh |
| Yield curve | FRED (DGS3MO, DGS2, DGS5, DGS7, DGS10, DGS30) | Daily |
| Credit spreads | FRED (BAMLC0A0CM, BAMLH0A0HYM2) | Daily |
| Fed Funds / CPI / M2 | FRED | Monthly |
| LEI | FRED (USSLIND) | Monthly |

## Macro Dashboard

- **Dalio Economic Machine** — Classifies current regime as Goldilocks, Reflation, Stagflation, or Deflation based on 30-day inflation trend (10Y breakeven) and 3-month growth trend (industrial production).
- **★ In Season** — Tags each ticker as "in season" based on current regime. Filterable.
- **Yield Curve** — Plots 3M through 30Y with curve shape analysis (Normal/Flat/Inverted).
- **Equity Risk Premium** — S&P earnings yield minus 10Y Treasury.

## Features

- 74 instruments across 7 buckets (Commodities, REITs, Growth, etc.)
- Tag-based filtering with bucket accordions
- Column visibility toggle (Columns ▾ button)
- All numeric columns sortable
- Expandable rows with thesis, entry range, and account assignment
- CSV export
- 24-hour localStorage cache for instant reload
- Green dot (●) on prices streaming live

## Deployment

Hosted on Cloudflare Pages. Repo structure:

```
├── index.html              # Single-page app (React + Babel standalone)
├── functions/
│   └── api/
│       └── proxy.js        # Cloudflare Pages Function (CORS proxy)
└── README.md
```

### Setup

1. Push to GitHub
2. Cloudflare Pages → Connect to Git
3. Build command: *(leave blank)*
4. Build output directory: `/`
5. Auto-deploys on every push

### API Keys

Configured in `index.html`:
- `FINNHUB_KEY` — Free tier from [finnhub.io](https://finnhub.io) (WebSocket is real-time on free tier)
- `FRED_KEY` — Free from [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html)

## Customization

### Adding/removing tickers

Edit the `STOCKS` array in `index.html`. Each entry:

```js
{ ticker: "AAPL", name: "Apple Inc", tags: ["Tech"] }
```

### Adding tags

Add to `TAG_COLORS` for color mapping and to the appropriate `BUCKETS` entry.

### Thesis & entry zones

Edit the `META` object. Each entry:

```js
"AAPL": { t: "Your thesis here", e: [150, 175], a: "T" }
// a: "T" = Taxable, "R" = Roth, "P" = Pre-Tax (401k), "B" = Both
```
