# API Key Management Dashboard with Supabase

This is a Next.js application that demonstrates how to implement API key management with Supabase as the backend database.

## Features

- Create, view, edit and delete API keys
- Copy API keys to clipboard
- Show/hide API key functionality
- Light/dark mode toggle
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account and project

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up your Supabase credentials:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Project Settings > API.

4. Create the necessary database table:

```bash
npm run setup-db
# or
yarn setup-db
```

If this fails, you can manually create the table using the SQL script provided when you run the command.

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

The API keys are stored in a `api_keys` table with the following structure:

```sql
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  usage INTEGER DEFAULT 0,
  monthly_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/keys` - List all API keys
- `POST /api/keys` - Create a new API key
- `GET /api/keys/:id` - Get details of a specific API key
- `PATCH /api/keys/:id` - Update an API key
- `DELETE /api/keys/:id` - Delete an API key

## Deployment

This application can be deployed using platforms like Vercel, Netlify, or any other platform that supports Next.js applications.

Make sure to set the environment variables in your deployment platform's dashboard.

## Tech Stack

- Next.js 15.x - React framework
- Supabase - Backend as a Service (BaaS)
- Heroicons - Icon library
- React Hooks - State management
- Tailwind-like styling with inline styles

## License

[MIT](LICENSE)
