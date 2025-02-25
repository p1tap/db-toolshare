# Testing the ToolShare API Endpoints

This guide will help you test the rental API endpoints using Postman and PostgreSQL.

## Setting Up the Database

1. Connect to your PostgreSQL database:
   ```bash
   psql -U your_username -d your_database
   ```

2. Run the schema script to create the tables:
   ```sql
   \i db/schema.sql
   ```

3. Run the test data script to populate the tables:
   ```sql
   \i db/test-data.sql
   ```

## Testing with Postman

1. Import the Postman collection:
   - Open Postman
   - Click on "Import" button
   - Select the `db/toolshare-postman-collection.json` file

2. Start your Next.js development server:
   ```bash
   pnpm run dev
   ```

3. Test the following rental endpoints:

### Rental Endpoints

1. **Get All Rentals**
   - Method: GET
   - URL: http://localhost:3000/api/rentals
   - Expected response: Array of rental objects with tool and user details

2. **Create Rental**
   - Method: POST
   - URL: http://localhost:3000/api/rentals
   - Body:
     ```json
     {
       "tool_id": 1,
       "renter_id": 3,
       "start_date": "2023-12-01T00:00:00.000Z",
       "end_date": "2023-12-05T00:00:00.000Z",
       "total_price": 47.97
     }
     ```
   - Expected response: Newly created rental object

3. **Get Rental by ID**
   - Method: GET
   - URL: http://localhost:3000/api/rentals/1
   - Expected response: Rental object with ID 1

4. **Update Rental**
   - Method: PUT
   - URL: http://localhost:3000/api/rentals/1
   - Body:
     ```json
     {
       "status": "active",
       "start_date": "2023-12-02T00:00:00.000Z",
       "end_date": "2023-12-06T00:00:00.000Z"
     }
     ```
   - Expected response: Updated rental object

5. **Cancel Rental**
   - Method: DELETE
   - URL: http://localhost:3000/api/rentals/1
   - Expected response: Cancelled rental object with status "cancelled"

6. **Get Rentals by User ID**
   - Method: GET
   - URL: http://localhost:3000/api/rentals/user/1
   - Expected response: Array of rental objects for user with ID 1

7. **Get Rentals by Tool ID**
   - Method: GET
   - URL: http://localhost:3000/api/rentals/tool/1
   - Expected response: Array of rental objects for tool with ID 1

## Troubleshooting

If you encounter any issues:

1. Check that your database connection is properly configured in your `.env.local` file
2. Ensure that the database schema and test data have been properly loaded
3. Check the server logs for any error messages
4. Verify that your Next.js server is running on port 3000 