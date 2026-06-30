# URL Fortify

URL Fortify is a web application for checking whether a URL may be unsafe before a user visits it. It combines URL reputation data, live webpage screenshots, OCR-based URL extraction from images, user accounts, scan limits, and subscription billing into one Next.js app.

The app is built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB, Firebase authentication, VirusTotal, APIFlash, OCR.space, PayMongo, AWS S3, and Sentry.

## Table Of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Subscriptions And Scan Limits](#subscriptions-and-scan-limits)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)

## Features

- URL safety analysis using VirusTotal URL reports.
- Website screenshot capture using APIFlash.
- OCR-powered URL extraction from uploaded images using OCR.space.
- Google sign-in flow backed by Firebase and app-managed sessions.
- Guest sessions for unauthenticated users.
- Monthly scan limits for guest and authenticated users.
- Subscription plans with free, standard, and professional tiers.
- PayMongo checkout sessions for paid plans.
- PayMongo refund flow and webhook handling.
- User account area with profile, usage, order history, refund, and plan management pages.
- Profile image upload to AWS S3.
- MongoDB persistence with Mongoose models.
- Responsive UI built with Tailwind CSS, Radix UI, MUI, Framer Motion, and custom components.
- Sentry configuration for client, server, and edge monitoring.

## Tech Stack

### Core

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- App Router

### UI And Animation

- Radix UI
- Material UI
- Framer Motion
- Three.js
- React Three Fiber
- Recharts
- Lucide React
- Tabler Icons

### Data And Auth

- MongoDB
- Mongoose
- Firebase
- jose JWT sessions
- server-only data access helpers

### External Services

- VirusTotal for URL reputation and analysis results.
- APIFlash for webpage screenshots.
- OCR.space for extracting URLs from uploaded images.
- PayMongo for checkout, payment, refund, and webhook flows.
- AWS S3 for user profile image uploads.
- Sentry for application monitoring.

## How It Works

1. A user enters a URL manually or uploads an image that contains a URL.
2. If an image is uploaded, the OCR proxy sends it to OCR.space and returns extracted text.
3. The client validates that the URL starts with `http` or `https`.
4. The app requests a screenshot from `/api/proxy/capture`.
5. The app requests a VirusTotal report from `/api/proxy/virustotal`.
6. If both services respond successfully, `/api/scan-limit` updates the user's usage.
7. The UI displays the screenshot, category data, analysis statistics, and per-engine results.

## Project Structure

```text
app/
  actions/                  Server actions for auth, checkout, refunds, subscriptions, and scan limits
  api/                      Route handlers for auth, user data, proxy APIs, checkout, refunds, and webhooks
  (subscription)/           Subscription and refund result pages
  (user)/account/           Authenticated account pages
components/                 Shared app and UI components
components/ui/              Reusable primitive UI components
data/                       Navigation and static data
helpers/                    Formatting, file, URL, payment, and pricing helpers
hooks/                      Client hooks for URL analysis, geolocation, and toast state
lib/                        Database, sessions, data access, utilities, and subscription plan config
lib/models/                 Mongoose models
public/                     Images, icons, and static assets
```

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm
- MongoDB database
- API keys for the external services used by the app

### Installation

```bash
git clone https://github.com/meraeugene/url-fortify.git
cd url-fortify
npm install
```

### Local Environment

Create a `.env.local` file in the project root and add the required variables listed in [Environment Variables](#environment-variables).

```bash
cp .env.example .env.local
```

This repository does not currently include an `.env.example`, so create `.env.local` manually if the command above fails.

### Run The Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build For Production

```bash
npm run build
npm run start
```

## Environment Variables

The app expects these variables in `.env.local` for local development and in your deployment provider for production.

```env
VIRUS_TOTAL_API_KEY=
MONGODB_URI=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_REGION=
AWS_S3_BUCKET_NAME=
API_FLASH_ACCESS_KEY=
OCR_API_KEY=
SESSION_SECRET=
NEXT_PUBLIC_FIREBASE_API_KEY=
PAYMONGO_SECRET_ACCESS_KEY=
```

### Variable Notes

- `VIRUS_TOTAL_API_KEY`: Used by `/api/proxy/virustotal`.
- `MONGODB_URI`: MongoDB connection string used by `lib/db.ts`.
- `SESSION_SECRET`: Secret used to sign and verify app session cookies.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Public Firebase key used by the client Firebase config.
- `API_FLASH_ACCESS_KEY`: APIFlash key used for webpage screenshot capture.
- `OCR_API_KEY`: OCR.space key used for image-to-text processing.
- `PAYMONGO_SECRET_ACCESS_KEY`: PayMongo secret key used for checkout and refund requests.
- `AWS_S3_*`: S3 credentials and bucket configuration used for profile image uploads.
- `AUTH_*`: Auth-related variables reserved for Google/auth configuration.

Never commit real values for these variables.

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs Next.js linting.

```bash
npm run deploy
```

Deploys the project to Vercel production using the Vercel CLI.

## API Routes

### Auth

- `POST /api/auth/google`: Creates or finds a user from Google profile data and creates a session.
- `GET /api/auth/logout`: Logs the user out.

### URL Analysis

- `GET /api/proxy/virustotal?url=...`: Fetches VirusTotal URL analysis data.
- `GET /api/proxy/capture?url=...`: Captures a webpage screenshot through APIFlash.
- `POST /api/proxy/ocr`: Accepts an uploaded image and returns parsed OCR text.
- `POST /api/scan-limit`: Updates guest or authenticated user scan usage after a successful analysis.

### User Account

- `GET /api/user`: Returns the authenticated user's profile.
- `PATCH /api/user`: Updates profile details and optionally uploads a new profile image to S3.
- `GET /api/user/order-history`: Returns user payment/order history.
- `GET /api/user/payment`: Returns payment data for the current user.

### Billing

- `POST /api/checkout`: Creates a PayMongo checkout session.
- `POST /api/create-refund`: Creates a PayMongo refund request.
- `POST /api/webhooks/paymongo`: Handles PayMongo payment and refund webhook events.
- `GET /api/subscription-plans`: Returns available subscription plans.

## Subscriptions And Scan Limits

Plan configuration lives in `lib/subscriptionPlans.ts`.

| Plan | Price | Monthly Lookups | Intended Users |
| --- | ---: | ---: | --- |
| Fortify Free | PHP 0 | 10 | Individuals or small-scale users |
| Standard Plan | PHP 149 | 115 | Regular users or small businesses |
| Professional Plan | PHP 249 | 100 | Cybersecurity teams or large businesses |

Scan usage is tracked through user usage stats and guest URL scan records. The scan-limit route only increments usage after both screenshot capture and VirusTotal analysis return successful status codes.

## Data Models

The app uses Mongoose models in `lib/models/`:

- `userModel.ts`: User profile, role, subscription, payment references, and usage stats.
- `subscriptionPlanModel.ts`: Subscription plan title, intended users, max lookups, features, and price.
- `paymentModel.ts`: Payment records, invoice numbers, payment method, amount, status, and plan reference.
- `urlScanRecordModel.ts`: Guest scan tracking and usage records.

## Deployment Notes

- The project includes a `deploy` script for Vercel production deployments.
- Add all environment variables to the Vercel project before deploying.
- Configure the PayMongo webhook URL to point to `/api/webhooks/paymongo`.
- Make sure the MongoDB database is reachable from the deployment environment.
- Make sure the S3 bucket allows the app to upload and serve profile images as expected.
- Checkout success and cancel URLs are currently configured for the production domain in `app/actions/checkout.ts`.

## Troubleshooting

### Invalid URL

The scanner requires URLs that start with `http` or `https`.

### Missing API Key

If screenshot, OCR, or VirusTotal requests fail, confirm the matching environment variable is set.

### MongoDB Connection Issues

Check `MONGODB_URI`, network access, and database user permissions.

### Payment Or Refund Issues

Check `PAYMONGO_SECRET_ACCESS_KEY`, PayMongo dashboard logs, and the webhook event payload.

### Profile Image Upload Issues

Check the AWS S3 credentials, region, bucket name, bucket policy, and file size/type. Profile uploads currently allow JPG, PNG, and WEBP files up to 1 MB.

## License

This project is private and does not currently declare an open-source license.
