-- Outbox table used by services for transactional outbox pattern
CREATE TABLE IF NOT EXISTS outbox (
  id UUID PRIMARY KEY,
  aggregate_id VARCHAR(255),
  type VARCHAR(255),
  payload TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  tries INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Index for efficient polling of pending rows
CREATE INDEX IF NOT EXISTS idx_outbox_status_created_at ON outbox (status, created_at);
