const { Customer } = require('../models');

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll();
    return res.json(customers);
  } catch (err) {
    return next(err);
  }
};

// Get a single customer
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
};

// Create a new customer
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, surname, email } = req.body;
    const customer = await Customer.create({ name, surname, email });
    return res.status(201).json(customer);
  } catch (err) {
    return next(err);
  }
};

// Update a customer
exports.updateCustomer = async (req, res, next) => {
  try {
    const { name, surname, email } = req.body;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customer.update({ name, surname, email });
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customer.destroy();
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};