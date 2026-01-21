const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  birthDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  problem: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  preferences: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
  },
  lastInteraction: {
    type: DataTypes.DATE,
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
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['phoneNumber'],
    },
    {
      fields: ['isActive'],
    },
  ],
  hooks: {
    beforeUpdate: (user) => {
      user.updatedAt = new Date();
    },
  },
});

// Instance method to compare password (if password field exists)
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
