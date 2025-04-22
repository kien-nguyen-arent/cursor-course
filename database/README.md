# Database and API Documentation

This document provides detailed information about the database schema, API endpoints, and setup instructions for the API Key Management Dashboard.

## Database Configuration

The application uses Supabase as the backend database service. To connect to your Supabase instance, you need to set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Project Settings > API.

## Database Schema

The database contains a single table `api_keys` with the following structure:

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

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, automatically generated |
| name | TEXT | Name of the API key (for user reference) |
| key | TEXT | The actual API key value (unique) |
| type | TEXT | Type of API key ('development' or 'production') |
| usage | INTEGER | Count of API key usages |
| monthly_limit | INTEGER | Maximum allowed uses per month (optional) |
| created_at | TIMESTAMP | When the key was created |
| last_used | TIMESTAMP | When the key was last used |

## Setting Up the Database

To set up the database, follow these steps:

1. Create a new Supabase project at [https://app.supabase.io/](https://app.supabase.io/)

2. In the SQL Editor, run the following SQL to create the `api_keys` table:

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

3. (Optional) Create an RLS (Row Level Security) policy if you want to restrict access to the table:

```sql
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage api_keys"
ON api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

4. (Optional) Create a function to automatically generate API keys:

```sql
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
  new_key TEXT;
BEGIN
  new_key := encode(gen_random_bytes(24), 'hex');
  RETURN 'sk_' || new_key;
END;
$$ LANGUAGE plpgsql;
```

## API Endpoints

The application provides the following RESTful API endpoints:

### List API Keys

```
GET /api/keys
```

Returns a list of all API keys.

**Response:**
```json
{
  "keys": [
    {
      "id": "uuid",
      "name": "My API Key",
      "key": "sk_***************",
      "type": "development",
      "usage": 0,
      "monthly_limit": 1000,
      "created_at": "2023-05-15T12:00:00Z",
      "last_used": "2023-05-15T12:00:00Z"
    },
    ...
  ]
}
```

### Create API Key

```
POST /api/keys
```

Creates a new API key.

**Request Body:**
```json
{
  "name": "My New API Key",
  "type": "development",
  "monthly_limit": 1000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My New API Key",
  "key": "sk_abcdef123456...",
  "type": "development",
  "usage": 0,
  "monthly_limit": 1000,
  "created_at": "2023-05-15T12:00:00Z",
  "last_used": "2023-05-15T12:00:00Z"
}
```

### Get API Key

```
GET /api/keys/:id
```

Returns details of a specific API key.

**Response:**
```json
{
  "id": "uuid",
  "name": "My API Key",
  "key": "sk_***************",
  "type": "development",
  "usage": 0,
  "monthly_limit": 1000,
  "created_at": "2023-05-15T12:00:00Z",
  "last_used": "2023-05-15T12:00:00Z"
}
```

### Update API Key

```
PATCH /api/keys/:id
```

Updates an existing API key.

**Request Body:**
```json
{
  "name": "Updated API Key Name",
  "monthly_limit": 2000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated API Key Name",
  "key": "sk_***************",
  "type": "development",
  "usage": 0,
  "monthly_limit": 2000,
  "created_at": "2023-05-15T12:00:00Z",
  "last_used": "2023-05-15T12:00:00Z"
}
```

### Delete API Key

```
DELETE /api/keys/:id
```

Deletes an API key.

**Response:**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

## Data Model

The API Key object has the following structure:

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'development' | 'production';
  usage: number;
  monthly_limit?: number;
  created_at: string;
  last_used: string;
}
```

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message"
  }
}
```

Common error codes:
- `not_found`: The requested resource was not found
- `validation_error`: Request validation failed
- `server_error`: Internal server error
- `unauthorized`: Authentication required
- `forbidden`: Operation not allowed

## Rate Limiting

API endpoints are rate-limited to 100 requests per minute per IP address. Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed per minute
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets 