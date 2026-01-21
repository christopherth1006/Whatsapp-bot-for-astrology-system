const cron = require('node-cron');
const { Playlist, User } = require('../models');
const { Op } = require('sequelize');
const playlistService = require('./playlist.service');
const logger = require('../utils/logger');

class CronService {
  /**
   * Start all cron jobs
   */
  startCronJobs() {
    // Daily playlist generation and sending (runs at 6 AM every day)
    cron.schedule('0 6 * * *', async () => {
      logger.info('Starting daily playlist generation cron job');
      await this.generateDailyPlaylists();
    });

    // Send pending playlists (runs every hour)
    cron.schedule('0 * * * *', async () => {
      logger.info('Starting pending playlist sending cron job');
      await this.sendPendingPlaylists();
    });

    logger.info('All cron jobs started');
  }

  /**
   * Generate playlists for all active users for today
   */
  async generateDailyPlaylists() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateOnly = today.toISOString().split('T')[0];

      const activeUsers = await User.findAll({
        where: { isActive: true },
      });

      logger.info(`Generating playlists for ${activeUsers.length} active users`);

      for (const user of activeUsers) {
        try {
          await playlistService.generatePlaylist(user.id, today);
        } catch (error) {
          logger.error(`Error generating playlist for user ${user.id}:`, error);
        }
      }

      logger.info('Daily playlist generation completed');
    } catch (error) {
      logger.error('Error in daily playlist generation cron:', error);
    }
  }

  /**
   * Send all pending playlists
   */
  async sendPendingPlaylists() {
    try {
      const today = new Date();
      const dateOnly = today.toISOString().split('T')[0];

      const pendingPlaylists = await Playlist.findAll({
        where: {
          status: 'pending',
          date: {
            [Op.lte]: dateOnly,
          },
        },
        include: [{ model: User, as: 'user' }],
      });

      logger.info(`Found ${pendingPlaylists.length} pending playlists`);

      for (const playlist of pendingPlaylists) {
        try {
          if (playlist.user && playlist.user.isActive) {
            await playlistService.sendPlaylist(playlist.id);
          }
        } catch (error) {
          logger.error(`Error sending playlist ${playlist.id}:`, error);
          playlist.status = 'failed';
          await playlist.save();
        }
      }

      logger.info('Pending playlist sending completed');
    } catch (error) {
      logger.error('Error in pending playlist sending cron:', error);
    }
  }
}

module.exports = new CronService();
