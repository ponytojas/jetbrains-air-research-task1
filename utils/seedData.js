const { Customer, ShopItemCategory, ShopItem, Order, OrderItem } = require('../models');

/**
 * Seeds the database with initial data
 */
const seedDatabase = async () => {
  try {
    // Create customers (at least 3)
    const customers = await Customer.bulkCreate([
      {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      },
      {
        name: 'Jane',
        surname: 'Smith',
        email: 'jane.smith@example.com',
      },
      {
        name: 'Robert',
        surname: 'Johnson',
        email: 'robert.johnson@example.com',
      },
    ]);

    // Create categories (at least 2)
    const categories = await ShopItemCategory.bulkCreate([
      {
        title: 'Electronics',
        description: 'Electronic gadgets and devices',
      },
      {
        title: 'Books',
        description: 'Printed and digital books',
      },
    ]);

    // Create shop items (at least 3)
    const items = await ShopItem.bulkCreate([
      {
        title: 'Smartphone',
        description: 'Latest model smartphone',
        price: 699.99,
      },
      {
        title: 'Laptop',
        description: 'High-performance laptop',
        price: 1299.99,
      },
      {
        title: 'Programming Book',
        description: 'Learn to code with this comprehensive guide',
        price: 49.99,
      },
    ]);

    // Associate items with categories
    await items[0].addCategories(categories[0]); // Smartphone -> Electronics
    await items[1].addCategories(categories[0]); // Laptop -> Electronics
    await items[2].addCategories(categories[1]); // Book -> Books

    // Create an order
    const order = await Order.create({
      CustomerId: customers[0].id, // Assign to John Doe
    });

    // Add items to the order
    await OrderItem.bulkCreate([
      {
        OrderId: order.id,
        ShopItemId: items[0].id, // Smartphone
        quantity: 1,
      },
      {
        OrderId: order.id,
        ShopItemId: items[2].id, // Book
        quantity: 2,
      },
    ]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;