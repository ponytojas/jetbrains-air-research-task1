/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: err.errors.map((e) => e.message),
    });
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference to a related entity',
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'A record with that unique identifier already exists',
    });
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal server error',
    errorDetails: JSON.stringify(err),
  });
};

module.exports = errorHandler;