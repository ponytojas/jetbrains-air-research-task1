const request = require('supertest');
const app = require('../src/app');
const { sequelize, ShopItem, ShopItemCategory } = require('../src/models');

describe('ShopItem API', () => {
    let category1, category2;
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        [category1, category2] = await ShopItemCategory.bulkCreate([
            { title: 'Electronics', description: 'Electronic gadgets and devices' },
            { title: 'Books', description: 'Books and literature' }
        ]);
    });

    it('should create a shop item with categories', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({
                title: 'Smartphone',
                description: 'Latest model smartphone',
                price: 699.99,
                categories: [category1.id]
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Smartphone');
        expect(res.body.ShopItemCategories.length).toBe(1);
    });

    it('should list all items', async () => {
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should get an item by id', async () => {
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Smartphone');
    });

    it('should return 404 for non-existent item', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.statusCode).toBe(404);
    });

    it('should update an item and its categories', async () => {
        const res = await request(app)
            .put('/api/items/1')
            .send({
                title: 'Smartphone X',
                categories: [category2.id]
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Smartphone X');
        expect(res.body.ShopItemCategories.length).toBe(1);
        expect(res.body.ShopItemCategories[0].id).toBe(category2.id);
    });

    it('should delete an item', async () => {
        const res = await request(app).delete('/api/items/1');
        expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existent item', async () => {
        const res = await request(app).delete('/api/items/999');
        expect(res.statusCode).toBe(404);
    });
});
