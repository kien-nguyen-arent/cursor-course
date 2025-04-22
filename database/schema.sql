-- API Keys Database Schema
-- This file contains the SQL schema for the Supabase database used in this project

-- API Keys Table
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(type);

-- Sample data insertion (uncomment to use)
/*
INSERT INTO api_keys (name, key, type, usage, monthly_limit)
VALUES 
  ('Development Key', 'arent-kient-dev-abc123', 'dev', 0, 1000),
  ('Production Key', 'arent-kient-prod-xyz456', 'prod', 0, 5000);
*/ 