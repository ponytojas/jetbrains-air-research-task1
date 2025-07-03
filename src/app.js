const express = require('express');
const bodyParser = require('express').json;
const { sequelize } = require('./models');
const initializeData = require('./models/initData');

const customerRoutes = require('./routes/customer');
const categoryRoutes = require('./routes/category');
const itemRoutes = require('./routes/item');
const orderRoutes = require('./routes/order');

const app = express();
app.use(bodyParser());

app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Minimalistic Online Shop Backend' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    (async () => {
        await initializeData();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })();
}

module.exports = app;
