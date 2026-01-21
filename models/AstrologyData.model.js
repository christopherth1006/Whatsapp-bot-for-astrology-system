const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User.model');

const AstrologyData = sequelize.define('AstrologyData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dataType: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'horoscope', 'panchang'),
    allowNull: false,
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  rawResponse: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'astrology_data',
  indexes: [
    {
      fields: ['userId', 'date', 'dataType'],
      unique: true,
      name: 'unique_user_date_datatype',
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['date'],
    },
  ],
  hooks: {
    beforeUpdate: (astrologyData) => {
      astrologyData.updatedAt = new Date();
    },
  },
});

// Define associations
AstrologyData.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AstrologyData, { foreignKey: 'userId', as: 'astrologyData' });

module.exports = AstrologyData;
