# Minimalistic Online Shop Backend

A minimalistic backend web app with full CRUD APIs for a small online shop.

## Features
- CRUD APIs for Customer, ShopItemCategory, ShopItem, and Order
- Sequelize ORM with SQLite for persistence
- Automated tests for all endpoints (Jest + Supertest)
- Database initialized with test data on startup

## Technology Stack
- Node.js (JavaScript)
- Express
- Sequelize (SQLite)
- Jest + Supertest

## Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Run the app locally

```
npm start
```

The server will start on `http://localhost:3000`.

### 3. Run the app in development mode (with auto-reload)

```
npm run dev
```

### 4. Run the tests

```
npm test
```

## API Endpoints

### Customer
- `POST /api/customers` — Create customer
- `GET /api/customers` — List all customers
- `GET /api/customers/:id` — Get customer by ID
- `PUT /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

### ShopItemCategory
- `POST /api/categories` — Create category
- `GET /api/categories` — List all categories
- `GET /api/categories/:id` — Get category by ID
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### ShopItem
- `POST /api/items` — Create item
- `GET /api/items` — List all items
- `GET /api/items/:id` — Get item by ID
- `PUT /api/items/:id` — Update item
- `DELETE /api/items/:id` — Delete item

### Order
- `POST /api/orders` — Create order
- `GET /api/orders` — List all orders
- `GET /api/orders/:id` — Get order by ID
- `PUT /api/orders/:id` — Update order
- `DELETE /api/orders/:id` — Delete order

## Example JSON Payloads

### Create Customer
```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com"
}
```

### Create ShopItemCategory
```json
{
  "title": "Electronics",
  "description": "Electronic gadgets and devices"
}
```

### Create ShopItem
```json
{
  "title": "Smartphone",
  "description": "Latest model smartphone",
  "price": 699.99,
  "categories": [1]
}
```

### Create Order
```json
{
  "customer_id": 1,
  "items": [
    {
      "shop_item_id": 1,
      "quantity": 2
    }
  ]
}
```

## Notes
- The database is reset and seeded with test data on every app start.
- All endpoints return JSON.
- For more details, see the tests in the `tests/` directory.
