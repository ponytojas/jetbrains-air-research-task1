const request = require('supertest');
const app = require('../src/app');
const { sequelize, ShopItemCategory } = require('../src/models');

describe('ShopItemCategory API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await ShopItemCategory.bulkCreate([
            { title: 'Electronics', description: 'Electronic gadgets and devices' },
            { title: 'Books', description: 'Books and literature' }
        ]);
    });

    it('should list all categories', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should get a category by id', async () => {
        const res = await request(app).get('/api/categories/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Electronics');
    });

    it('should return 404 for non-existent category', async () => {
        const res = await request(app).get('/api/categories/999');
        expect(res.statusCode).toBe(404);
    });

    it('should create a category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({ title: 'Toys', description: 'Toys and games' });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Toys');
    });

    it('should update a category', async () => {
        const res = await request(app)
            .put('/api/categories/1')
            .send({ description: 'Updated description' });
        expect(res.statusCode).toBe(200);
        expect(res.body.description).toBe('Updated description');
    });

    it('should return 404 when updating non-existent category', async () => {
        const res = await request(app)
            .put('/api/categories/999')
            .send({ title: 'Nobody' });
        expect(res.statusCode).toBe(404);
    });

    it('should delete a category', async () => {
        const res = await request(app).delete('/api/categories/2');
        expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existent category', async () => {
        const res = await request(app).delete('/api/categories/999');
        expect(res.statusCode).toBe(404);
    });
});
