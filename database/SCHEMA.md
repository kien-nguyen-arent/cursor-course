# Database Schema Documentation

This document provides detailed information about the database schema for the API Key Management Dashboard.

## API Keys Table

The database contains a table `api_keys` with the following structure:

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

## Security Considerations

### Row Level Security (RLS)

For production environments, it's recommended to implement Row Level Security to control access to the table:

```sql
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage api_keys"
ON api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

For more granular control, you can create separate policies for each operation:

```sql
-- Read-only policy
CREATE POLICY "Allow users to view their own api_keys"
ON api_keys
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insert policy
CREATE POLICY "Allow users to create their own api_keys"
ON api_keys
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update policy
CREATE POLICY "Allow users to update their own api_keys"
ON api_keys
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Delete policy
CREATE POLICY "Allow users to delete their own api_keys"
ON api_keys
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## Utility Functions

### Generate API Key

Creating a function to automatically generate API keys:

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

You can use this function when inserting new records:

```sql
INSERT INTO api_keys (name, key, type)
VALUES ('My API Key', generate_api_key(), 'development')
RETURNING *;
```

## Data Model

The API Key object has the following TypeScript representation:

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'development' | 'production';
  usage: number;
  monthly_limit?: number | null;
  created_at: string;
  last_used: string;
}
```

## Recommended Indexes

For optimal performance, consider adding the following indexes:

```sql
-- Index for faster lookups by key
CREATE INDEX idx_api_keys_key ON api_keys(key);

-- Index for filtering by type
CREATE INDEX idx_api_keys_type ON api_keys(type);

-- Index for usage reporting
CREATE INDEX idx_api_keys_usage ON api_keys(usage);

-- Index for date-based queries
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used);
```

## Future Database Expansion

### Potential Relationships

If expanding the application, you might want to add relationships to other tables:

- `users` table: to track which user created each API key
- `api_key_logs` table: to track detailed usage history

### Schema Migrations

When making changes to the schema, it's recommended to use migrations. Here's an example of how to add a new column:

```sql
-- Migration 001: Add user_id to api_keys
ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Migration 002: Add description field
ALTER TABLE api_keys ADD COLUMN description TEXT;
```

To roll back migrations:

```sql
-- Rollback 002
ALTER TABLE api_keys DROP COLUMN description;

-- Rollback 001
ALTER TABLE api_keys DROP COLUMN user_id;
``` 