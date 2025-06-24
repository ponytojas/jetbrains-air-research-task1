const request = require('supertest');
const express = require('express');
const shopItemCategoryRoutes = require('../routes/shopItemCategoryRoutes');
const { ShopItemCategory } = require('../models');
const errorHandler = require('../middleware/errorHandler');

// Mock the database and models
jest.mock('../models', () => {
  const mockCategory = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  
  return { ShopItemCategory: mockCategory };
});

// Create Express app with category routes
const app = express();
app.use(express.json());
app.use('/api/categories', shopItemCategoryRoutes);
app.use(errorHandler);

describe('ShopItemCategory API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/categories', () => {
    test('should return all categories', async () => {
      const mockCategories = [
        { id: 1, title: 'Electronics', description: 'Electronic gadgets' },
        { id: 2, title: 'Books', description: 'Printed and digital books' },
      ];
      
      ShopItemCategory.findAll.mockResolvedValue(mockCategories);
      
      const response = await request(app).get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(ShopItemCategory.findAll).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('GET /api/categories/:id', () => {
    test('should return a single category', async () => {
      const mockCategory = { id: 1, title: 'Electronics', description: 'Electronic gadgets' };
      
      ShopItemCategory.findByPk.mockResolvedValue(mockCategory);
      
      const response = await request(app).get('/api/categories/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategory);
      expect(ShopItemCategory.findByPk).toHaveBeenCalledWith('1');
    });
    
    test('should return 404 if category not found', async () => {
      ShopItemCategory.findByPk.mockResolvedValue(null);
      
      const response = await request(app).get('/api/categories/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
  
  describe('POST /api/categories', () => {
    test('should create a new category', async () => {
      const mockCategory = { id: 1, title: 'Electronics', description: 'Electronic gadgets' };
      
      ShopItemCategory.create.mockResolvedValue(mockCategory);
      
      const response = await request(app)
        .post('/api/categories')
        .send({ title: 'Electronics', description: 'Electronic gadgets' });
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCategory);
      expect(ShopItemCategory.create).toHaveBeenCalledWith({
        title: 'Electronics',
        description: 'Electronic gadgets',
      });
    });
    
    test('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ description: 'Electronic gadgets' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(ShopItemCategory.create).not.toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/categories/:id', () => {
    test('should update an existing category', async () => {
      const mockCategory = {
        id: 1,
        title: 'Electronics',
        description: 'Electronic gadgets',
        update: jest.fn().mockResolvedValue(true),
      };
      
      ShopItemCategory.findByPk.mockResolvedValue(mockCategory);
      
      const response = await request(app)
        .put('/api/categories/1')
        .send({ title: 'Updated Electronics', description: 'Updated description' });
      
      expect(response.status).toBe(200);
      expect(mockCategory.update).toHaveBeenCalledWith({
        title: 'Updated Electronics',
        description: 'Updated description',
      });
    });
    
    test('should return 404 if category not found', async () => {
      ShopItemCategory.findByPk.mockResolvedValue(null);
      
      const response = await request(app)
        .put('/api/categories/999')
        .send({ title: 'Electronics', description: 'Electronic gadgets' });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
  
  describe('DELETE /api/categories/:id', () => {
    test('should delete a category', async () => {
      const mockCategory = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      ShopItemCategory.findByPk.mockResolvedValue(mockCategory);
      
      const response = await request(app).delete('/api/categories/1');
      
      expect(response.status).toBe(204);
      expect(mockCategory.destroy).toHaveBeenCalled();
    });
    
    test('should return 404 if category not found', async () => {
      ShopItemCategory.findByPk.mockResolvedValue(null);
      
      const response = await request(app).delete('/api/categories/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
});