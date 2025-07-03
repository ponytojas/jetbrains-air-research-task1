const express = require('express');
const { Order, OrderItem, Customer, ShopItem } = require('../models');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
    try {
        const { customer_id, items } = req.body;
        if (!customer_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'customer_id and items are required' });
        }
        const order = await Order.create({ CustomerId: customer_id });
        const orderItems = await Promise.all(items.map(async (item) => {
            return await OrderItem.create({
                OrderId: order.id,
                ShopItemId: item.shop_item_id,
                quantity: item.quantity
            });
        }));
        await order.setItems(orderItems);
        const result = await Order.findByPk(order.id, {
            include: [
                { model: Customer },
                { model: OrderItem, as: 'items', include: [ShopItem] }
            ]
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    const orders = await Order.findAll({
        include: [
            { model: Customer },
            { model: OrderItem, as: 'items', include: [ShopItem] }
        ]
    });
    res.json(orders);
});

// Read one
router.get('/:id', async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: Customer },
            { model: OrderItem, as: 'items', include: [ShopItem] }
        ]
    });
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
});

// Update
router.put('/:id', async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    try {
        const { customer_id, items } = req.body;
        if (customer_id) order.CustomerId = customer_id;
        await order.save();
        if (items && Array.isArray(items)) {
            await OrderItem.destroy({ where: { OrderId: order.id } });
            const orderItems = await Promise.all(items.map(async (item) => {
                return await OrderItem.create({
                    OrderId: order.id,
                    ShopItemId: item.shop_item_id,
                    quantity: item.quantity
                });
            }));
            await order.setItems(orderItems);
        }
        const result = await Order.findByPk(order.id, {
            include: [
                { model: Customer },
                { model: OrderItem, as: 'items', include: [ShopItem] }
            ]
        });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    await OrderItem.destroy({ where: { OrderId: order.id } });
    await order.destroy();
    res.status(204).end();
});

module.exports = router;
