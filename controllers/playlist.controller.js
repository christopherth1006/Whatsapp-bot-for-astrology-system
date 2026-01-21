const playlistService = require('../services/playlist.service');
const { Playlist, User } = require('../models');
const logger = require('../utils/logger');

class PlaylistController {
  async getUserPlaylists(req, res) {
    try {
      const { userId } = req.params;
      const playlists = await Playlist.findAll({
        where: { userId },
        order: [['date', 'DESC']],
        limit: 30,
      });
      
      res.json({
        success: true,
        count: playlists.length,
        data: playlists,
      });
    } catch (error) {
      logger.error('Error getting user playlists:', error);
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

  async generatePlaylist(req, res) {
    try {
      const { userId, date } = req.body;
      const targetDate = date ? new Date(date) : new Date();
      
      const playlist = await playlistService.generatePlaylist(userId, targetDate);
      
      res.status(201).json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      logger.error('Error generating playlist:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error generating playlist',
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

module.exports = new PlaylistController();
