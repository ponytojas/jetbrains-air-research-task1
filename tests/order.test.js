const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orderRoutes');
const { Order, OrderItem, Customer, ShopItem } = require('../models');
const sequelize = require('../config/database');
const errorHandler = require('../middleware/errorHandler');


jest.mock('../models', () => {
  const mockOrder = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockOrderItem = {
    create: jest.fn(),
    destroy: jest.fn(),
  };

  const mockCustomer = {
    findByPk: jest.fn(),
  };

  const mockShopItem = {
    findByPk: jest.fn(),
  };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  return {
    Order: mockOrder,
    OrderItem: mockOrderItem,
    Customer: mockCustomer,
    ShopItem: mockShopItem,
  };
});

// Create Express app with order routes
const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

describe('Order API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    test('should return all orders', async () => {
      const mockOrders = [
        {
          id: 1,
          Customer: { id: 1, name: 'John', surname: 'Doe' },
          OrderItems: [
            {
              id: 1,
              quantity: 2,
              ShopItem: { id: 1, title: 'Smartphone', price: 699.99 },
            },
          ],
        },
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
      expect(Order.findAll).toHaveBeenCalledWith({
        include: [
          { model: Customer },
          { model: OrderItem, include: [{ model: ShopItem }] },
        ],
      });
    });
  });

  describe('GET /api/orders/:id', () => {
    test('should return a single order', async () => {
      const mockOrder = {
        id: 1,
        Customer: { id: 1, name: 'John', surname: 'Doe' },
        OrderItems: [
          {
            id: 1,
            quantity: 2,
            ShopItem: { id: 1, title: 'Smartphone', price: 699.99 },
          },
        ],
      };

      Order.findByPk.mockResolvedValue(mockOrder);

      const response = await request(app).get('/api/orders/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
      expect(Order.findByPk).toHaveBeenCalledWith('1', {
        include: [
          { model: Customer },
          { model: OrderItem, include: [{ model: ShopItem }] },
        ],
      });
    });

    test('should return 404 if order not found', async () => {
      Order.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/orders/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });

  describe('POST /api/orders', () => {
    test('should create a new order', async () => {
      // Mock customer
      Customer.findByPk.mockResolvedValue({ id: 1, name: 'John' });

      // Mock shop items
      ShopItem.findByPk.mockResolvedValueOnce({ id: 1, title: 'Smartphone' });

      // Mock order creation
      const mockOrder = { id: 1, CustomerId: 1 };
      Order.create.mockResolvedValue(mockOrder);

      // Mock order item creation
      OrderItem.create.mockResolvedValue({ id: 1, OrderId: 1, ShopItemId: 1, quantity: 2 });

      // Mock fetching the created order with all relations
      const mockFullOrder = {
        id: 1,
        Customer: { id: 1, name: 'John' },
        OrderItems: [
          {
            id: 1,
            quantity: 2,
            ShopItem: { id: 1, title: 'Smartphone' },
          },
        ],
      };
      Order.findByPk.mockResolvedValue(mockFullOrder);

      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: 1,
          items: [
            { shop_item_id: 1, quantity: 2 },
          ],
        });

      expect(response.status).toBe(201);
      expect(Customer.findByPk).toHaveBeenCalledWith(1);
      expect(ShopItem.findByPk).toHaveBeenCalledWith(1);
      expect(Order.create).toHaveBeenCalledWith(
        { CustomerId: 1 },
        { transaction: expect.anything() }
      );
      expect(OrderItem.create).toHaveBeenCalledWith(
        { OrderId: 1, ShopItemId: 1, quantity: 2 },
        { transaction: expect.anything() }
      );
    });

    test('should return 400 if customer not found', async () => {
      Customer.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: 999,
          items: [
            { shop_item_id: 1, quantity: 2 },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Customer not found');
    });

    test('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          // Missing customer_id and items
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/orders/:id', () => {

    test('should return 404 if order not found', async () => {
      Order.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/orders/999')
        .send({
          customer_id: 1,
          items: [
            { shop_item_id: 1, quantity: 2 },
          ],
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    test('should delete an order', async () => {
      const mockOrder = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      Order.findByPk.mockResolvedValue(mockOrder);

      const response = await request(app).delete('/api/orders/1');

      expect(response.status).toBe(204);
      expect(mockOrder.destroy).toHaveBeenCalled();
    });

    test('should return 404 if order not found', async () => {
      Order.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/api/orders/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Order not found');
    });
  });
});