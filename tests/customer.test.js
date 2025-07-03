const request = require('supertest');
const app = require('../src/app');
const { sequelize, Customer } = require('../src/models');

describe('Customer API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await Customer.bulkCreate([
            { name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
            { name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' }
        ]);
    });

    it('should list all customers', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should get a customer by id', async () => {
        const res = await request(app).get('/api/customers/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('John');
    });

    it('should return 404 for non-existent customer', async () => {
        const res = await request(app).get('/api/customers/999');
        expect(res.statusCode).toBe(404);
    });

    it('should create a customer', async () => {
        const res = await request(app)
            .post('/api/customers')
            .send({ name: 'Alice', surname: 'Wonder', email: 'alice@example.com' });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Alice');
    });

    it('should not create a customer with duplicate email', async () => {
        const res = await request(app)
            .post('/api/customers')
            .send({ name: 'Bob', surname: 'Builder', email: 'john.doe@example.com' });
        expect(res.statusCode).toBe(400);
    });

    it('should update a customer', async () => {
        const res = await request(app)
            .put('/api/customers/1')
            .send({ name: 'Johnny' });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Johnny');
    });

    it('should return 404 when updating non-existent customer', async () => {
        const res = await request(app)
            .put('/api/customers/999')
            .send({ name: 'Nobody' });
        expect(res.statusCode).toBe(404);
    });

    it('should delete a customer', async () => {
        const res = await request(app).delete('/api/customers/2');
        expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existent customer', async () => {
        const res = await request(app).delete('/api/customers/999');
        expect(res.statusCode).toBe(404);
    });
});
