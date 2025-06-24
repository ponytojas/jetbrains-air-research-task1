const request = require('supertest');
const express = require('express');
const customerRoutes = require('../routes/customerRoutes');
const { Customer } = require('../models');
const errorHandler = require('../middleware/errorHandler');

// Mock the database and models
jest.mock('../models', () => {
  const mockCustomer = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  
  return { Customer: mockCustomer };
});

// Create Express app with customer routes
const app = express();
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use(errorHandler);

describe('Customer API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/customers', () => {
    test('should return all customers', async () => {
      const mockCustomers = [
        { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' },
      ];
      
      Customer.findAll.mockResolvedValue(mockCustomers);
      
      const response = await request(app).get('/api/customers');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCustomers);
      expect(Customer.findAll).toHaveBeenCalledTimes(1);
    });
    
    test('should handle errors', async () => {
      Customer.findAll.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app).get('/api/customers');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/customers/:id', () => {
    test('should return a single customer', async () => {
      const mockCustomer = { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' };
      
      Customer.findByPk.mockResolvedValue(mockCustomer);
      
      const response = await request(app).get('/api/customers/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCustomer);
      expect(Customer.findByPk).toHaveBeenCalledWith('1');
    });
    
    test('should return 404 if customer not found', async () => {
      Customer.findByPk.mockResolvedValue(null);
      
      const response = await request(app).get('/api/customers/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Customer not found');
    });
  });
  
  describe('POST /api/customers', () => {
    test('should create a new customer', async () => {
      const mockCustomer = { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' };
      
      Customer.create.mockResolvedValue(mockCustomer);
      
      const response = await request(app)
        .post('/api/customers')
        .send({ name: 'John', surname: 'Doe', email: 'john.doe@example.com' });
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCustomer);
      expect(Customer.create).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });
    });
    
    test('should return 400 if validation fails', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({ name: 'John' }); // Missing required fields
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(Customer.create).not.toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/customers/:id', () => {
    test('should update an existing customer', async () => {
      const mockCustomer = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        update: jest.fn().mockResolvedValue(true),
      };
      
      Customer.findByPk.mockResolvedValue(mockCustomer);
      
      const response = await request(app)
        .put('/api/customers/1')
        .send({ name: 'John', surname: 'Updated', email: 'john.updated@example.com' });
      
      expect(response.status).toBe(200);
      expect(mockCustomer.update).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Updated',
        email: 'john.updated@example.com',
      });
    });
    
    test('should return 404 if customer not found', async () => {
      Customer.findByPk.mockResolvedValue(null);
      
      const response = await request(app)
        .put('/api/customers/999')
        .send({ name: 'John', surname: 'Doe', email: 'john.doe@example.com' });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Customer not found');
    });
  });
  
  describe('DELETE /api/customers/:id', () => {
    test('should delete a customer', async () => {
      const mockCustomer = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      Customer.findByPk.mockResolvedValue(mockCustomer);
      
      const response = await request(app).delete('/api/customers/1');
      
      expect(response.status).toBe(204);
      expect(mockCustomer.destroy).toHaveBeenCalled();
    });
    
    test('should return 404 if customer not found', async () => {
      Customer.findByPk.mockResolvedValue(null);
      
      const response = await request(app).delete('/api/customers/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Customer not found');
    });
  });
});