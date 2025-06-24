const { ShopItem, ShopItemCategory } = require('../models');

// Get all items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await ShopItem.findAll({
      include: [{ model: ShopItemCategory, as: 'Categories' }],
    });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
};

// Get a single item
exports.getItemById = async (req, res, next) => {
  try {
    const item = await ShopItem.findByPk(req.params.id, {
      include: [{ model: ShopItemCategory, as: 'Categories' }],
    });

    if (!item) {
      return res.status(404).json({ error: 'Shop item not found' });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

// Create a new item
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, price, categories } = req.body;

    const item = await ShopItem.create({ title, description, price });

    // Add categories if provided
    if (categories && categories.length > 0) {
      await item?.setCategories?.(categories);
      // Reload item with categories
      await item.reload({
        include: [{ model: ShopItemCategory, as: 'Categories' }],
      });
    }

    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
};

// Update an item
exports.updateItem = async (req, res, next) => {
  try {
    const { title, description, price, categories } = req.body;
    const item = await ShopItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Shop item not found' });
    }

    await item.update({ title, description, price });

    // Update categories if provided
    if (categories) {
      await item.setCategories(categories);
    }

    // Reload item with categories
    await item.reload({
      include: [{ model: ShopItemCategory, as: 'Categories' }],
    });

    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

// Delete an item
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await ShopItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Shop item not found' });
    }

    await item.destroy();
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};