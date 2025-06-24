const express = require('express');
const shopItemCategoryController = require('../controllers/shopItemCategoryController');
const { validate, validateShopItemCategory } = require('../middleware/validate');

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', shopItemCategoryController.getAllCategories);

// GET /api/categories/:id - Get a single category by ID
router.get('/:id', shopItemCategoryController.getCategoryById);

// POST /api/categories - Create a new category
router.post('/', validate(validateShopItemCategory), shopItemCategoryController.createCategory);

// PUT /api/categories/:id - Update a category
router.put('/:id', validate(validateShopItemCategory), shopItemCategoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', shopItemCategoryController.deleteCategory);

module.exports = router;