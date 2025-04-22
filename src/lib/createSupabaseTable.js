import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load .env.local file specifically
dotenv.config({ path: './.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Function to create the api_keys table
async function createApiKeysTable() {
  try {
    // Using direct SQL execution instead of RPC
    const { error } = await supabase.from('api_keys').select('count').limit(1).then(async () => {
      console.log('Table already exists')
      return { error: null }
    }).catch(async () => {
      // Table doesn't exist, create it
      console.log('Creating table...')
      return await supabase.auth.getSession().then(async ({ data: { session } }) => {
        const { error } = await supabase.rest.from('/rest/v1/').post({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || supabaseKey}`,
            'apikey': supabaseKey
          },
          query: `
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
            
            -- Create index for faster lookups
            CREATE INDEX IF NOT EXISTS api_keys_name_idx ON api_keys(name);
            CREATE INDEX IF NOT EXISTS api_keys_type_idx ON api_keys(type);
          `
        })
        return { error }
      })
    })

    if (error) {
      console.error('Error creating table:', error)
      return
    }

    console.log('API keys table created or already exists')
  } catch (err) {
    console.error('Error:', err)
  }
}

// Instructions for manual setup if automatic setup fails
console.log(`
If the automatic setup doesn't work, you can manually create the table in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL:

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS api_keys_name_idx ON api_keys(name);
CREATE INDEX IF NOT EXISTS api_keys_type_idx ON api_keys(type);
`)

// Create the table
createApiKeysTable()
  .then(() => {
    console.log('Script completed')
    process.exit(0)
  })
  .catch(err => {
    console.error('Unhandled error:', err)
    process.exit(1)
  }) 