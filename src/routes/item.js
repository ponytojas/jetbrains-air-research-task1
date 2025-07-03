const express = require('express');
const { ShopItem, ShopItemCategory } = require('../models');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
    try {
        const { categories, ...itemData } = req.body;
        const item = await ShopItem.create(itemData);
        if (categories && Array.isArray(categories)) {
            await item.setShopItemCategories(categories);
        }
        const result = await ShopItem.findByPk(item.id, { include: ShopItemCategory });
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    const items = await ShopItem.findAll({ include: ShopItemCategory });
    res.json(items);
});

// Read one
router.get('/:id', async (req, res) => {
    const item = await ShopItem.findByPk(req.params.id, { include: ShopItemCategory });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
});

// Update
router.put('/:id', async (req, res) => {
    const item = await ShopItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    try {
        const { categories, ...itemData } = req.body;
        await item.update(itemData);
        if (categories && Array.isArray(categories)) {
            await item.setShopItemCategories(categories);
        }
        const result = await ShopItem.findByPk(item.id, { include: ShopItemCategory });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    const item = await ShopItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.status(204).end();
});

module.exports = router;
