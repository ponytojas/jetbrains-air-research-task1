const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer, ShopItemCategory, ShopItem, Order, OrderItem } = require('../src/models');

describe('Order API', () => {
    let customer, item1, item2;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        customer = await Customer.create({ name: 'John', surname: 'Doe', email: 'john.doe@example.com' });
        const category = await ShopItemCategory.create({ title: 'Electronics', description: 'Electronic gadgets and devices' });
        item1 = await ShopItem.create({ title: 'Smartphone', description: 'Latest model smartphone', price: 699.99 });
        item2 = await ShopItem.create({ title: 'Laptop', description: 'High performance laptop', price: 1299.99 });
        await item1.setShopItemCategories([category.id]);
        await item2.setShopItemCategories([category.id]);
    });

    it('should create an order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send({
                customer_id: customer.id,
                items: [
                    { shop_item_id: item1.id, quantity: 2 },
                    { shop_item_id: item2.id, quantity: 1 }
                ]
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.CustomerId).toBe(customer.id);
        expect(res.body.items.length).toBe(2);
    });

    it('should list all orders', async () => {
        const res = await request(app).get('/api/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should get an order by id', async () => {
        const res = await request(app).get('/api/orders/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
    });

    it('should return 404 for non-existent order', async () => {
        const res = await request(app).get('/api/orders/999');
        expect(res.statusCode).toBe(404);
    });

    it('should update an order', async () => {
        const res = await request(app)
            .put('/api/orders/1')
            .send({
                items: [
                    { shop_item_id: item1.id, quantity: 1 }
                ]
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(1);
    });

    it('should return 404 when updating non-existent order', async () => {
        const res = await request(app)
            .put('/api/orders/999')
            .send({ items: [] });
        expect(res.statusCode).toBe(404);
    });

    it('should delete an order', async () => {
        const res = await request(app).delete('/api/orders/1');
        expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existent order', async () => {
        const res = await request(app).delete('/api/orders/999');
        expect(res.statusCode).toBe(404);
    });
});
