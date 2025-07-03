const express = require('express');
const { Customer } = require('../models');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all
router.get('/', async (req, res) => {
    const customers = await Customer.findAll();
    res.json(customers);
});

// Read one
router.get('/:id', async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    res.json(customer);
});

// Update
router.put('/:id', async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    try {
        await customer.update(req.body);
        res.json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    await customer.destroy();
    res.status(204).end();
});

module.exports = router;
