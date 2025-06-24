const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShopItemCategory = sequelize.define('ShopItemCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ShopItemCategory;