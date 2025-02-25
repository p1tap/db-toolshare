-- Drop table if exists (useful for development)
DROP TABLE IF EXISTS tools;

-- Create tools table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    cost_per_day DECIMAL(10,2) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add any indexes
CREATE INDEX idx_tools_owner ON tools(owner_id);