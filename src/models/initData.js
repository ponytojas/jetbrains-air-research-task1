const { sequelize, Customer, ShopItemCategory, ShopItem, Order, OrderItem } = require('./index');

async function initializeData() {
    await sequelize.sync({ force: true });

    // Customers
    const customers = await Customer.bulkCreate([
        { name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
        { name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' },
        { name: 'Alice', surname: 'Johnson', email: 'alice.johnson@example.com' }
    ]);

    // Categories
    const categories = await ShopItemCategory.bulkCreate([
        { title: 'Electronics', description: 'Electronic gadgets and devices' },
        { title: 'Books', description: 'Books and literature' }
    ]);

    // Items
    const items = await ShopItem.bulkCreate([
        { title: 'Smartphone', description: 'Latest model smartphone', price: 699.99 },
        { title: 'Laptop', description: 'High performance laptop', price: 1299.99 },
        { title: 'Novel', description: 'Bestselling novel', price: 19.99 }
    ]);

    // Item-Category associations
    await items[0].addShopItemCategory(categories[0]); // Smartphone -> Electronics
    await items[1].addShopItemCategory(categories[0]); // Laptop -> Electronics
    await items[2].addShopItemCategory(categories[1]); // Novel -> Books

    // Order
    const order = await Order.create({ CustomerId: customers[0].id });
    const orderItems = await OrderItem.bulkCreate([
        { OrderId: order.id, ShopItemId: items[0].id, quantity: 2 },
        { OrderId: order.id, ShopItemId: items[2].id, quantity: 1 }
    ]);
    await order.setItems(orderItems);
}

module.exports = initializeData;
