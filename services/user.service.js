const { User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class UserService {
  /**
   * Find user by phone number
   */
  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({ where: { phoneNumber } });
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    return await User.findByPk(userId);
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    const user = await User.create(userData);
    logger.info(`New user created: ${user.phoneNumber}`);
    return user;
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    await user.update(updateData);
    return user;
  }

  /**
   * Get all users
   */
  async getAllUsers(filters = {}) {
    const where = {};
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    return await User.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get active users count
   */
  async getActiveUsersCount() {
    return await User.count({ where: { isActive: true } });
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      return user;
    }
    return null;
  }
}

module.exports = new UserService();
