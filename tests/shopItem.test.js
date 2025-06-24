const request = require('supertest');
const express = require('express');
const shopItemRoutes = require('../routes/shopItemRoutes');
const { ShopItem, ShopItemCategory } = require('../models');
const errorHandler = require('../middleware/errorHandler');

// Mock the database and models
jest.mock('../models', () => {
  const mockItem = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  return {
    ShopItem: mockItem,
    ShopItemCategory: {},
  };
});

// Create Express app with item routes
const app = express();
app.use(express.json());
app.use('/api/items', shopItemRoutes);
app.use(errorHandler);

describe('ShopItem API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    test('should return all items', async () => {
      const mockItems = [
        {
          id: 1,
          title: 'Smartphone',
          description: 'Latest model',
          price: 699.99,
          ShopItemCategories: [{ id: 1, title: 'Electronics' }],
        },
        {
          id: 2,
          title: 'Laptop',
          description: 'High performance',
          price: 1299.99,
          ShopItemCategories: [{ id: 1, title: 'Electronics' }],
        },
      ];

      ShopItem.findAll.mockResolvedValue(mockItems);

      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItems);
      expect(ShopItem.findAll).toHaveBeenCalledTimes(1);
      expect(ShopItem.findAll).toHaveBeenCalledWith({
        include: [{ "as": "Categories", model: ShopItemCategory }],
      });
    });
  });

  describe('GET /api/items/:id', () => {
    test('should return a single item', async () => {
      const mockItem = {
        id: 1,
        title: 'Smartphone',
        description: 'Latest model',
        price: 699.99,
        ShopItemCategories: [{ id: 1, title: 'Electronics' }],
      };

      ShopItem.findByPk.mockResolvedValue(mockItem);

      const response = await request(app).get('/api/items/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItem);
      expect(ShopItem.findByPk).toHaveBeenCalledWith('1', {
        include: [{ as: "Categories", model: ShopItemCategory }],
      });
    });

    test('should return 404 if item not found', async () => {
      ShopItem.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Shop item not found');
    });
  });

  describe('POST /api/items', () => {
    test('should create a new item', async () => {
      const mockItem = {
        id: 1,
        title: 'Smartphone',
        description: 'Latest model',
        price: 699.99,
        setCategories: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue({
          id: 1,
          title: 'Smartphone',
          description: 'Latest model',
          price: 699.99,
          ShopItemCategories: [{ id: 1, title: 'Electronics' }],
        }),
      };

      ShopItem.create.mockResolvedValue(mockItem);

      let response;

      try{
        response = await request(app)
          .post('/api/items')
          .send({
            title: 'Smartphone',
            description: 'Latest model',
            price: 699.99,
            categories: [1],
          });
      } catch (error) {
        console.error('Error during request:', error.response?.body || error.message);
      }

      expect(response.status).toBe(201);
      expect(ShopItem.create).toHaveBeenCalledWith({
        title: 'Smartphone',
        description: 'Latest model',
        price: 699.99,
      });
      expect(mockItem.setCategories).toHaveBeenCalledWith([1]);
      expect(mockItem.reload).toHaveBeenCalled();
    });

    test('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({
          description: 'Latest model',
          // Missing title and price
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(ShopItem.create).not.toHaveBeenCalled();
    });
  });

  describe('PUT /api/items/:id', () => {
    test('should update an existing item', async () => {
      const mockItem = {
        id: 1,
        title: 'Smartphone',
        description: 'Latest model',
        price: 699.99,
        update: jest.fn().mockResolvedValue(true),
        setCategories: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue({
          id: 1,
          title: 'Updated Smartphone',
          description: 'Updated description',
          price: 799.99,
          ShopItemCategories: [{ id: 1, title: 'Electronics' }],
        }),
      };

      ShopItem.findByPk.mockResolvedValue(mockItem);

      const response = await request(app)
        .put('/api/items/1')
        .send({
          title: 'Updated Smartphone',
          description: 'Updated description',
          price: 799.99,
          categories: [1],
        });

      expect(response.status).toBe(200);
      expect(mockItem.update).toHaveBeenCalledWith({
        title: 'Updated Smartphone',
        description: 'Updated description',
        price: 799.99,
      });
      expect(mockItem.setCategories).toHaveBeenCalledWith([1]);
      expect(mockItem.reload).toHaveBeenCalled();
    });

    test('should return 404 if item not found', async () => {
      ShopItem.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/items/999')
        .send({
          title: 'Smartphone',
          description: 'Latest model',
          price: 699.99,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Shop item not found');
    });
  });

  describe('DELETE /api/items/:id', () => {
    test('should delete an item', async () => {
      const mockItem = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      ShopItem.findByPk.mockResolvedValue(mockItem);

      const response = await request(app).delete('/api/items/1');

      expect(response.status).toBe(204);
      expect(mockItem.destroy).toHaveBeenCalled();
    });

    test('should return 404 if item not found', async () => {
      ShopItem.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/api/items/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Shop item not found');
    });
  });
});