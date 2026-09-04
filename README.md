# Rootx Shortner

Production-ready TanStack Start URL shortener using MongoDB. Features include accounts, admin panel, short links, custom aliases, click/country/device analytics, CPM earnings, referrals, withdrawals, announcements, payout-rate management, advertisement-code management, and a public API.

## Local

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, `MONGODB_DB`, and a strong `JWT_SECRET`.
3. Run `npm install` then `npm run dev`.

## Vercel

Import this repository into Vercel. The included `vercel.json` selects TanStack Start. Add the same environment variables in Vercel Project Settings > Environment Variables. Do not prefix server secrets with `VITE_`.

## Admin

The first account created in an empty database becomes admin. After deployment, create that account first.

## Public API

`POST /api/public/shorten`

JSON body:
`{"token":"YOUR_API_KEY","url":"https://example.com/page","alias":"optional"}`

The user's API key is shown in Dashboard > Developer API and can be regenerated.

## Ads

Admin > Ads lets you store trusted ad-network HTML/JavaScript snippets for banner and interstitial placements. The redirect page renders the configured snippets. Only paste code supplied by a trusted ad network.
