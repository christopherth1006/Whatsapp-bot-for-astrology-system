const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'astrology_system',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connection established successfully');
    
    // Sync models (use { alter: true } in development, { force: false } in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }
  } catch (error) {
    logger.error('Unable to connect to PostgreSQL database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
