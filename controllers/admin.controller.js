const userService = require('../services/user.service');
const playlistService = require('../services/playlist.service');
const { Playlist, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const totalPlaylists = await Playlist.count();
      const pendingPlaylists = await Playlist.count({ where: { status: 'pending' } });
      const completedPlaylists = await Playlist.count({ where: { status: 'completed' } });

      res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: totalUsers - activeUsers,
          },
          playlists: {
            total: totalPlaylists,
            pending: pendingPlaylists,
            completed: completedPlaylists,
            failed: totalPlaylists - pendingPlaylists - completedPlaylists,
          },
        },
      });
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard stats',
      });
    }
  }

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

  async getAllPlaylists(req, res) {
    try {
      const playlists = await Playlist.findAll({
        include: [{ model: User, as: 'user', attributes: ['phoneNumber', 'name'] }],
        order: [['createdAt', 'DESC']],
      });
      res.json({
        success: true,
        count: playlists.length,
        data: playlists,
      });
    } catch (error) {
      logger.error('Error getting playlists:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching playlists',
      });
    }
  }

  async getPlaylistById(req, res) {
    try {
      const playlist = await Playlist.findByPk(req.params.id, {
        include: [{ model: User, as: 'user' }],
      });
      if (!playlist) {
        return res.status(404).json({
          success: false,
          message: 'Playlist not found',
        });
      }
      res.json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      logger.error('Error getting playlist:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching playlist',
      });
    }
  }

  async generatePlaylists(req, res) {
    try {
      const { userId, date } = req.body;
      const targetDate = date ? new Date(date) : new Date();

      if (userId) {
        // Generate for specific user
        const playlist = await playlistService.generatePlaylist(userId, targetDate);
        res.json({
          success: true,
          data: playlist,
        });
      } else {
        // Generate for all active users
        const activeUsers = await User.findAll({ where: { isActive: true } });
        const playlists = [];

        for (const user of activeUsers) {
          try {
            const playlist = await playlistService.generatePlaylist(user.id, targetDate);
            playlists.push(playlist);
          } catch (error) {
            logger.error(`Error generating playlist for user ${user.id}:`, error);
          }
        }

        res.json({
          success: true,
          count: playlists.length,
          data: playlists,
        });
      }
    } catch (error) {
      logger.error('Error generating playlists:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error generating playlists',
      });
    }
  }

  async sendPlaylist(req, res) {
    try {
      const playlist = await playlistService.sendPlaylist(req.params.id);
      res.json({
        success: true,
        data: playlist,
        message: 'Playlist sent successfully',
      });
    } catch (error) {
      logger.error('Error sending playlist:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error sending playlist',
      });
    }
  }
}

module.exports = new AdminController();
