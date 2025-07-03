const express = require('express');
const { ShopItemCategory } = require('../models');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
    try {
        const category = await ShopItemCategory.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    const categories = await ShopItemCategory.findAll();
    res.json(categories);
});

// Read one
router.get('/:id', async (req, res) => {
    const category = await ShopItemCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    res.json(category);
});

// Update
router.put('/:id', async (req, res) => {
    const category = await ShopItemCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    try {
        await category.update(req.body);
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    const category = await ShopItemCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    await category.destroy();
    res.status(204).end();
});

module.exports = router;
