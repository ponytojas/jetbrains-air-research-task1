# Minimalistic Online Shop Backend

A minimalistic backend web app with full CRUD APIs for a small online shop.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Example Payloads](#example-payloads)

## Features

- Full CRUD operations for Customers, Shop Item Categories, Shop Items, and Orders
- Sequelize ORM with SQLite database
- Express.js RESTful API
- Data validation and error handling
- Automatic database initialization with sample data
- Comprehensive test suite

## Technologies Used

- **Language**: JavaScript
- **Framework**: Express.js
- **Database**: SQLite (via Sequelize ORM)
- **Testing**: Jest with Supertest

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd minimalistic-online-shop-backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Production Mode

```
npm start
```

### Development Mode (with auto-reload)

```
npm run dev
```

The server will start on port 3000 by default (http://localhost:3000).

## Running Tests

To run the test suite:

```
npm test
```

To run linting:

```
npm run lint
```

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a single customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Shop Item Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a single category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Shop Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a single item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a single order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

## Example Payloads

### Create/Update a Customer

```json
{
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@example.com"
}
```

### Create/Update a Shop Item Category

```json
{
  "title": "Electronics",
  "description": "Electronic gadgets and devices"
}
```

### Create/Update a Shop Item

```json
{
  "title": "Smartphone",
  "description": "Latest model smartphone",
  "price": 699.99,
  "categories": [1]
}
```

### Create/Update an Order

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

## Database Structure

The application uses the following models:

1. **Customer**:
   - id (primary key)
   - name
   - surname
   - email

2. **ShopItemCategory**:
   - id (primary key)
   - title
   - description

3. **ShopItem**:
   - id (primary key)
   - title
   - description
   - price
   - categories (many-to-many relationship with ShopItemCategory)

4. **OrderItem**:
   - id (primary key)
   - shop_item (reference to ShopItem)
   - quantity

5. **Order**:
   - id (primary key)
   - customer (reference to Customer)
   - items (one-to-many relationship with OrderItem)

## Initial Data

On first startup, the application initializes the database with:
- 3 customers
- 2 categories
- 3 shop items
- 1 order with items

This provides a foundation for testing and exploring the API.