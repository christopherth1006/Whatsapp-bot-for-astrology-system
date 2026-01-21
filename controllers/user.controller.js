const userService = require('../services/user.service');
const logger = require('../utils/logger');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      logger.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Error getting user:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
      });
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creating user',
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error updating user',
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
      });
    }
  }
}

module.exports = new UserController();


