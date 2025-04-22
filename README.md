# API Key Management Dashboard

A Next.js application for managing API keys with Supabase.

## Features

- Create, view, edit, and delete API keys
- Copy API keys to clipboard
- Toggle light/dark mode
- Responsive design
- API key usage tracking
- Monthly usage limits
- API key types (development, production)

## Prerequisites

- Node.js 18.x or higher
- Supabase account

## Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd api-key-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Supabase
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database
   See the [Database Documentation](./database/README.md) for detailed instructions on setting up the database schema.

5. Run the development server
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

For details on available API endpoints, see the [Database and API Documentation](./database/README.md#api-endpoints).

## Deployment

This application can be deployed on Vercel, Netlify, or any other Next.js compatible hosting service.

1. Deploy to Vercel
   ```bash
   npx vercel
   ```

2. Deploy to Netlify
   ```bash
   npx netlify deploy
   ```

Remember to set your environment variables in your deployment platform's dashboard.

## Tech Stack

- Next.js
- Supabase
- Heroicons
- React Hooks
- Tailwind-like styling

## License

MIT

## Database

The application uses Supabase (PostgreSQL) for data storage. 

For detailed information about the database schema, tables, and SQL setup, please refer to the [Database Schema Documentation](database/SCHEMA.md).
