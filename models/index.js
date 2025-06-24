const Customer = require('./Customer');
const ShopItemCategory = require('./ShopItemCategory');
const ShopItem = require('./ShopItem');
const OrderItem = require('./OrderItem');
const Order = require('./Order');

// Define associations

// Customer can have many Orders
Customer.hasMany(Order, { onDelete: 'CASCADE' });
Order.belongsTo(Customer);

// Order has many OrderItems
Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

// ShopItem has many OrderItems
ShopItem.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(ShopItem);

// ShopItem belongs to many ShopItemCategories (many-to-many)
ShopItem.belongsToMany(ShopItemCategory, {
  through: 'ItemCategories',
  as: 'Categories',
  foreignKey: 'ShopItemId',
  otherKey: 'ShopItemCategoryId'
});
ShopItemCategory.belongsToMany(ShopItem, {
  through: 'ItemCategories',
  as: 'Items',
  foreignKey: 'ShopItemCategoryId',
  otherKey: 'ShopItemId'
});

module.exports = {
  Customer,
  ShopItemCategory,
  ShopItem,
  OrderItem,
  Order,
};