const express = require('express');
const customerController = require('../controllers/customerController');
const { validate, validateCustomer } = require('../middleware/validate');

const router = express.Router();

// GET /api/customers - Get all customers
router.get('/', customerController.getAllCustomers);

// GET /api/customers/:id - Get a single customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create a new customer
router.post('/', validate(validateCustomer), customerController.createCustomer);

// PUT /api/customers/:id - Update a customer
router.put('/:id', validate(validateCustomer), customerController.updateCustomer);

// DELETE /api/customers/:id - Delete a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;