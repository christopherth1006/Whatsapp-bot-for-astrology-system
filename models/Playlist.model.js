const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User.model');

const Playlist = sequelize.define('Playlist', {
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
  playlistItems: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  sentAt: {
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
  tableName: 'playlists',
  indexes: [
    {
      fields: ['userId', 'date'],
      unique: true,
      name: 'unique_user_date',
    },
    {
      fields: ['status', 'date'],
    },
    {
      fields: ['userId'],
    },
  ],
  hooks: {
    beforeUpdate: (playlist) => {
      playlist.updatedAt = new Date();
    },
  },
});

// Define associations
Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });

module.exports = Playlist;
