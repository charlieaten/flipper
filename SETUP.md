# Flipper Game Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Webhook Security
WEBHOOK_SECRET=your_webhook_secret_key

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up Convex**
   - Run `npx convex dev` to start Convex locally
   - The Convex URL will be automatically added to your `.env.local` file
   - For production, deploy with `npx convex deploy` and update the URL

3. **Configure Webhook Secret**
   - Generate a random secret key for webhook validation
   - Add it to your `.env.local` file as `WEBHOOK_SECRET`

4. **Run the Application**
   ```bash
   npm run dev
   ```

## Webhook Configuration

The application expects webhooks at `/api/webhooks/payment` for the following events:

- `payment.created`
- `payment.succeeded`
- `payment.failed`
- `payment.expired`

Configure your payment provider to send webhooks to:
`https://your-domain.com/api/webhooks/payment`

## Features

- **Backend-based Game Logic**: All game state is stored in Convex
- **Webhook Integration**: Automatic token addition when payments succeed
- **Top-up Tracking**: All payment attempts are tracked in Convex
- **Game History**: Player game history is persisted
- **Token Management**: Secure token balance management

## API Endpoints

- `GET /api/game/session?userId={userId}` - Get user's game session
- `POST /api/game/flip` - Process coin flip game
- `POST /api/recharge` - Create payment for token top-up
- `GET /api/topup/attempts?userId={userId}` - Get user's top-up history
- `POST /api/webhooks/payment` - Handle payment webhooks
