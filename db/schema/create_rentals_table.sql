-- Drop table if exists
DROP TABLE IF EXISTS rentals;

-- Create rentals table
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tools(id),
    renter_id INTEGER REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Add indexes for common queries
CREATE INDEX idx_rentals_tool ON rentals(tool_id);
CREATE INDEX idx_rentals_renter ON rentals(renter_id);
CREATE INDEX idx_rentals_status ON rentals(status);

-- Add index for date range queries
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date); 