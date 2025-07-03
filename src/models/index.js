const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

class Customer extends Model { }
Customer.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { sequelize, modelName: 'Customer' });

class ShopItemCategory extends Model { }
ShopItemCategory.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'ShopItemCategory' });

class ShopItem extends Model { }
ShopItem.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
}, { sequelize, modelName: 'ShopItem' });

class OrderItem extends Model { }
OrderItem.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'OrderItem' });

class Order extends Model { }
Order.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
}, { sequelize, modelName: 'Order' });

// Associations
ShopItem.belongsToMany(ShopItemCategory, { through: 'ShopItem_ShopItemCategory' });
ShopItemCategory.belongsToMany(ShopItem, { through: 'ShopItem_ShopItemCategory' });

Order.belongsTo(Customer);
Customer.hasMany(Order);

Order.hasMany(OrderItem, { as: 'items' });
OrderItem.belongsTo(Order);
OrderItem.belongsTo(ShopItem);
ShopItem.hasMany(OrderItem);

module.exports = {
    sequelize,
    Customer,
    ShopItemCategory,
    ShopItem,
    OrderItem,
    Order
};
