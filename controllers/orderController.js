const { Order, OrderItem, Customer, ShopItem } = require('../models');
const sequelize = require('../config/database');

// Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: ShopItem }],
        },
      ],
    });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
};

// Get a single order
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: ShopItem }],
        },
      ],
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    return res.json(order);
  } catch (err) {
    return next(err);
  }
};

// Create a new order
exports.createOrder = async (req, res, next) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    const { customer_id, items } = req.body;
    
    // Check if customer exists
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Customer not found' });
    }
    
    // Create order
    const order = await Order.create(
      { CustomerId: customer_id },
      { transaction }
    );
    
    // Create order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        // Check if shop item exists
        const shopItem = await ShopItem.findByPk(item.shop_item_id);
        if (!shopItem) {
          throw new Error(`Shop item with ID ${item.shop_item_id} not found`);
        }
        
        return OrderItem.create(
          {
            OrderId: order.id,
            ShopItemId: item.shop_item_id,
            quantity: item.quantity,
          },
          { transaction }
        );
      })
    );
    
    await transaction.commit();
    
    // Fetch full order with relationships
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: ShopItem }],
        },
      ],
    });
    
    return res.status(201).json(fullOrder);
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    return next(err);
  }
};

// Update an order
exports.updateOrder = async (req, res, next) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    const { customer_id, items } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update customer if provided
    if (customer_id) {
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Customer not found' });
      }
      
      await order.update({ CustomerId: customer_id }, { transaction });
    }
    
    // Update items if provided
    if (items && items.length > 0) {
      // Delete existing order items
      await OrderItem.destroy({
        where: { OrderId: order.id },
        transaction,
      });
      
      // Create new order items
      await Promise.all(
        items.map(async (item) => {
          // Check if shop item exists
          const shopItem = await ShopItem.findByPk(item.shop_item_id);
          if (!shopItem) {
            throw new Error(`Shop item with ID ${item.shop_item_id} not found`);
          }
          
          return OrderItem.create(
            {
              OrderId: order.id,
              ShopItemId: item.shop_item_id,
              quantity: item.quantity,
            },
            { transaction }
          );
        })
      );
    }
    
    await transaction.commit();
    
    // Fetch updated order with relationships
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: ShopItem }],
        },
      ],
    });
    
    return res.json(updatedOrder);
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    return next(err);
  }
};

// Delete an order
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.destroy();
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};