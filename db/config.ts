import { Pool } from "pg";

// Create pool using connection string for both environments
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default pool;
