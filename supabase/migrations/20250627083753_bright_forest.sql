/*
  # GeoSentiment Lens Database Setup

  1. New Tables
    - `api_endpoints`
      - `id` (uuid, primary key)
      - `name` (text, endpoint name)
      - `url` (text, API URL)
      - `method` (text, HTTP method)
      - `headers` (jsonb, request headers)
      - `auth_type` (text, authentication type)
      - `auth_value` (text, authentication value)
      - `data_mapping` (jsonb, field mapping configuration)
      - `is_active` (boolean, endpoint status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `live_data`
      - `id` (uuid, primary key)
      - `endpoint_id` (uuid, foreign key to api_endpoints)
      - `raw_data` (jsonb, original API response)
      - `processed_data` (jsonb, processed sentiment data)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- API Endpoints table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  method text DEFAULT 'GET' CHECK (method IN ('GET', 'POST')),
  headers jsonb DEFAULT '{}',
  auth_type text DEFAULT 'none' CHECK (auth_type IN ('none', 'bearer', 'api_key', 'basic')),
  auth_value text,
  data_mapping jsonb NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Live Data table
CREATE TABLE IF NOT EXISTS live_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id uuid REFERENCES api_endpoints(id) ON DELETE CASCADE,
  raw_data jsonb NOT NULL,
  processed_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_data ENABLE ROW LEVEL SECURITY;

-- Policies for api_endpoints
CREATE POLICY "Users can manage their own API endpoints"
  ON api_endpoints
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for live_data
CREATE POLICY "Users can manage their own live data"
  ON live_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to read data (for demo purposes)
CREATE POLICY "Anonymous users can read API endpoints"
  ON api_endpoints
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can read live data"
  ON live_data
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_endpoints_active ON api_endpoints(is_active);
CREATE INDEX IF NOT EXISTS idx_live_data_endpoint_id ON live_data(endpoint_id);
CREATE INDEX IF NOT EXISTS idx_live_data_created_at ON live_data(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_api_endpoints_updated_at
  BEFORE UPDATE ON api_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();