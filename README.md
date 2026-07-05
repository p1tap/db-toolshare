# ToolShare

ToolShare is a full-stack tool-rental marketplace built with Next.js and PostgreSQL. It supports customer browsing, renter-owned listings, rental checkout, payments, order/history tracking, support requests, and admin review workflows.

The project was built as a database-driven marketplace prototype with a strong backend focus: relational schema design, API routes, role-based user flows, CRUD operations, coordinated rental/order status updates, and SQL scripts for testing and analysis.

## Features

### Customer

- Register and sign in with a selected role
- Browse available tools with owner details and category navigation
- View tool detail pages with fallback mock data when needed
- Create orders and rentals from checkout
- Submit payment records through a mock payment flow
- Track orders, rentals, and account history
- Update account details and submit support requests

### Renter

- Register as a renter
- Add new tool listings with name, price, description, image, and owner ID
- View current listings owned by the logged-in renter
- Edit or remove listings through soft status updates
- Review rental requests and update rental status
- View renter balance derived from completed rental/payment data

### Admin

- View dashboard metrics for total tools, active tools, pricing, categories, and recent listings
- Approve or disapprove tool listings by changing tool status
- Review and update support request status
- Monitor marketplace data through admin pages and SQL reporting scripts

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Database | PostgreSQL, `pg` |
| Validation | Zod |
| Runtime | Node.js, pnpm |
| Data model | Users, tools, rentals, orders, payments, history, support requests |

## Project Structure

```txt
app/
  (auth)/                 Login and registration pages
  account/                Customer account, order, rental, and history pages
  admin/                  Admin dashboard, approval, and support review pages
  api/                    Next.js API routes for users, tools, rentals, orders, payments, history, support, admin
  components/             Shared UI components
  renter/                 Renter listing, balance, and request-management pages
  tools/[id]/             Tool detail and checkout flow
db/
  queries/                Domain query modules for users, tools, rentals, orders, payments, and history
  schema/                 Core PostgreSQL schema files
  scripts/                SQL operation demos and analytics scripts
  test-data/              Test inserts for tools, rentals, and orders
public/images/tools/      Tool catalog images
```

## Main User Flows

1. **Registration and login**
   Users register as either a customer or renter. Login uses a role selector and stores the selected role/client session state locally for demo navigation.

2. **Browse and checkout**
   Customers browse tools, open a tool detail page, select rental dates, then create an order, rental, payment, and history entry.

3. **Renter listing management**
   Renters add, edit, and remove their own tool listings. Listings are stored in PostgreSQL and soft-disabled by updating status.

4. **Rental lifecycle**
   Rentals support `pending`, `active`, `completed`, and `cancelled` states. Rental updates also attempt to keep related order status aligned.

5. **Admin operations**
   Admin pages expose dashboard statistics, listing approval/disapproval, and support ticket review.

## API Overview

| Resource | Endpoints |
| --- | --- |
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/[id]`, `GET/PUT /api/users/current`, `GET /api/users/by-username` |
| Tools | `GET/POST /api/tools`, `GET/PUT/DELETE /api/tools/[id]`, `GET /api/renter/tools?ownerId=` |
| Rentals | `GET/POST /api/rentals`, `GET/PUT/DELETE /api/rentals/[id]`, `GET /api/rentals/user/[userId]`, `GET /api/rentals/tool/[toolId]` |
| Orders | `GET/POST /api/orders`, `GET/PUT/DELETE /api/orders/[id]`, `GET /api/orders/user/[userId]` |
| Payments | `GET/POST /api/payments`, `GET/PUT /api/payments/[id]`, `GET /api/users/[id]/payments` |
| History | `GET/POST /api/history`, `GET /api/history/[id]`, `GET /api/history/user/[userId]`, `GET /api/history/order/[orderId]` |
| Support | `GET/POST /api/support`, `PUT /api/support/[id]` |
| Admin | `GET /api/admin/dashboard` |

## Database Model

The PostgreSQL schema models the marketplace around these core entities:

- `users`: account information, role, profile/contact details, and status
- `tools`: rentable listings, owner relationship, price, image, description, and status
- `rentals`: tool rental periods, renter relationship, total price, and lifecycle status
- `orders`: checkout records with user, tool, delivery option, and order status
- `payments`: mock payment records tied to rentals
- `history`: user/order activity trail
- `support_requests`: customer support messages and admin status updates

Indexes are included for common lookup paths such as owner tools, user rentals, tool rentals, order status, and payment history.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 15+ or 17+

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure PostgreSQL

Create a local PostgreSQL database named `toolshare`, then set the connection values in your shell or `.env.local`.

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=toolshare
```

> The app falls back to local PostgreSQL defaults in `db/config.ts`, but environment variables are recommended.

### 3. Create and seed the database

Use the SQL files in `db/schema/` and `db/test-data/`, or restore one of the included backup files:

```bash
psql -U postgres -h localhost -d toolshare -f db/schema/database_setup.sql
psql -U postgres -h localhost -d toolshare -f db/schema/orders-schema.sql
psql -U postgres -h localhost -d toolshare -f db/schema/payments-schema.sql
psql -U postgres -h localhost -d toolshare -f db/schema/history-schema.sql
```

For a fuller demo dataset, inspect and restore:

```bash
psql -U postgres -h localhost -d toolshare -f db/backups/toolshare_backup_with_real_data.sql
```

### 4. Start the development server

```bash
pnpm dev
```

Start your server and open the app in your browser. The root page redirects to `/login`.

## Useful Routes

| Route | Purpose |
| --- | --- |
| `/login` | Role-based demo login |
| `/register` | Customer registration |
| `/register/renter` | Renter registration |
| `/home` | Customer tool catalog |
| `/tools/[id]` | Tool details and checkout |
| `/account` | Customer profile |
| `/account/orders` | Customer orders |
| `/account/rentals` | Customer rentals |
| `/account/history` | Customer order history |
| `/renter/home` | Renter listing dashboard |
| `/renter/add-listing` | Create a tool listing |
| `/renter/status` | Review rental/order requests |
| `/renter/balance` | Renter balance summary |
| `/admin/home` | Admin dashboard |
| `/admin/approve` | Tool listing approval |
| `/admin/accepting-request` | Support request management |
| `/support` | Customer support form |

## Implementation Notes

- Authentication is a demo flow using `localStorage` and username lookup, not production-grade session security.
- Payment processing is mocked and records successful payment data without a real payment gateway.
- Tool deletion and user deletion are handled as soft status changes.
- Several SQL files are included for schema setup, testing, analytics, and operation demos.
- The project uses fallback mock tool data for tool detail pages if database lookup fails.

## Scripts

```bash
pnpm dev      # Start the Next.js development server
pnpm build    # Build the production app
pnpm start    # Run the production build
pnpm lint     # Run linting
```

## Related Documentation

- `docs/user-flows-and-sql-queries.txt`: detailed user flows, API mapping, and SQL examples
- `db/api-docs/all-endpoints.txt`: API endpoint summary
- `db/api-docs/test-api.md`: API testing notes
- `db/schema/`: schema definitions and setup SQL
- `db/scripts/`: SQL demos for rentals, orders, payments, analytics, user operations, and role-specific query flows

## Status

ToolShare is a full-stack marketplace prototype focused on relational data modeling, API coverage, and role-based workflows. The strongest parts of the project are the PostgreSQL schema, organized query modules, marketplace workflow coverage, and customer/renter/admin dashboards.

Production build currently passes with non-blocking lint warnings.
