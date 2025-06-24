const express = require('express');
const shopItemController = require('../controllers/shopItemController');
const { validate, validateShopItem } = require('../middleware/validate');

const router = express.Router();

// GET /api/items - Get all items
router.get('/', shopItemController.getAllItems);

// GET /api/items/:id - Get a single item by ID
router.get('/:id', shopItemController.getItemById);

// POST /api/items - Create a new item
router.post('/', validate(validateShopItem), shopItemController.createItem);

// PUT /api/items/:id - Update an item
router.put('/:id', validate(validateShopItem), shopItemController.updateItem);

// DELETE /api/items/:id - Delete an item
router.delete('/:id', shopItemController.deleteItem);

module.exports = router;