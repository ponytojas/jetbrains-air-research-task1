const { ShopItemCategory } = require('../models');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await ShopItemCategory.findAll();
    return res.json(categories);
  } catch (err) {
    return next(err);
  }
};

// Get a single category
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await ShopItemCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.json(category);
  } catch (err) {
    return next(err);
  }
};

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const category = await ShopItemCategory.create({ title, description });
    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
};

// Update a category
exports.updateCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const category = await ShopItemCategory.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await category.update({ title, description });
    return res.json(category);
  } catch (err) {
    return next(err);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await ShopItemCategory.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await category.destroy();
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};