/**
 * Middleware factory to validate request body
 * @param {Function} validator - Validation function that returns errors or null
 * @returns {Function} Express middleware
 */
const validate = (validator) => (req, res, next) => {
  const errors = validator(req.body);
  if (errors) {
    return res.status(400).json({ error: errors });
  }
  return next();
};

// Customer validation
const validateCustomer = (data) => {
  const errors = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.surname) errors.push('Surname is required');
  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Email is invalid');
  }
  
  return errors.length ? errors : null;
};

// ShopItemCategory validation
const validateShopItemCategory = (data) => {
  const errors = [];
  
  if (!data.title) errors.push('Title is required');
  
  return errors.length ? errors : null;
};

// ShopItem validation
const validateShopItem = (data) => {
  const errors = [];
  
  if (!data.title) errors.push('Title is required');
  if (data.price === undefined) {
    errors.push('Price is required');
  } else if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Price must be a positive number');
  }
  
  return errors.length ? errors : null;
};

// Order validation
const validateOrder = (data) => {
  const errors = [];
  
  if (!data.customer_id) errors.push('Customer ID is required');
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must have at least one item');
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.shop_item_id) errors.push(`Item #${index + 1} missing shop_item_id`);
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item #${index + 1} quantity must be at least 1`);
      }
    });
  }
  
  return errors.length ? errors : null;
};

module.exports = {
  validate,
  validateCustomer,
  validateShopItemCategory,
  validateShopItem,
  validateOrder,
};