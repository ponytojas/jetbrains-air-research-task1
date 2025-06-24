const express = require('express');
const orderController = require('../controllers/orderController');
const { validate, validateOrder } = require('../middleware/validate');

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Get a single order by ID
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Create a new order
router.post('/', validate(validateOrder), orderController.createOrder);

// PUT /api/orders/:id - Update an order
router.put('/:id', validate(validateOrder), orderController.updateOrder);

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;