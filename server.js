const express = require('express');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const shopItemCategoryRoutes = require('./routes/shopItemCategoryRoutes');
const shopItemRoutes = require('./routes/shopItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');
const seedDatabase = require('./utils/seedData');

// Import models to ensure they are registered with Sequelize
require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/categories', shopItemCategoryRoutes);
app.use('/api/items', shopItemRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Minimalistic Online Shop Backend API',
    endpoints: {
      customers: '/api/customers',
      categories: '/api/categories',
      items: '/api/items',
      orders: '/api/orders',
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const initializeApp = async () => {
  try {
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Seed database with initial data
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
initializeApp();
