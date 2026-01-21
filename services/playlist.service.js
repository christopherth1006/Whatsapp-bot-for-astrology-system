const { Playlist, User } = require('../models');
const { Op } = require('sequelize');
const astrologyService = require('./astrology.service');
const logger = require('../utils/logger');

class PlaylistService {
  /**
   * Generate playlist for a user for a specific date
   */
  async generatePlaylist(userId, date = new Date()) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Format date to DATEONLY format
      const dateOnly = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const startOfDay = new Date(dateOnly);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateOnly);
      endOfDay.setHours(23, 59, 59, 999);

      // Check if playlist already exists
      const existingPlaylist = await Playlist.findOne({
        where: {
          userId,
          date: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      if (existingPlaylist) {
        logger.info(`Playlist already exists for user ${userId} on ${dateOnly}`);
        return existingPlaylist;
      }

      const playlistItems = [];

      // 1. Daily Horoscope
      if (user.birthDetails?.date) {
        try {
          const horoscopeData = await astrologyService.getDailyHoroscope(
            this.getZodiacSign(user.birthDetails.date),
            date
          );
          playlistItems.push({
            title: 'Daily Horoscope',
            description: horoscopeData.data?.horoscope || 'Your daily horoscope',
            contentType: 'horoscope',
            order: 1,
            isSent: false,
          });
        } catch (error) {
          logger.error(`Error fetching horoscope for user ${userId}:`, error);
        }
      }

      // 2. Panchang (if location available)
      if (user.location?.latitude && user.location?.longitude) {
        try {
          const panchangData = await astrologyService.getPanchang(
            user.location.latitude,
            user.location.longitude,
            date
          );
          playlistItems.push({
            title: 'Today\'s Panchang',
            description: this.formatPanchangData(panchangData),
            contentType: 'panchang',
            order: 2,
            isSent: false,
          });
        } catch (error) {
          logger.error(`Error fetching panchang for user ${userId}:`, error);
        }
      }

      // 3. Nakshatra (if location available)
      if (user.location?.latitude && user.location?.longitude) {
        try {
          const nakshatraData = await astrologyService.getNakshatra(
            user.location.latitude,
            user.location.longitude,
            date
          );
          playlistItems.push({
            title: 'Nakshatra Information',
            description: this.formatNakshatraData(nakshatraData),
            contentType: 'horoscope',
            order: 3,
            isSent: false,
          });
        } catch (error) {
          logger.error(`Error fetching nakshatra for user ${userId}:`, error);
        }
      }

      // Create playlist
      const playlist = await Playlist.create({
        userId,
        date: dateOnly,
        playlistItems,
        status: 'pending',
      });

      logger.info(`Playlist generated for user ${userId} on ${dateOnly}`);

      return playlist;
    } catch (error) {
      logger.error('Error generating playlist:', error);
      throw error;
    }
  }

  /**
   * Get zodiac sign from birth date
   */
  getZodiacSign(birthDate) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
  }

  /**
   * Format panchang data for display
   */
  formatPanchangData(panchangData) {
    if (!panchangData.data) return 'Panchang data not available';
    
    const data = panchangData.data;
    let formatted = '';

    if (data.sunrise) formatted += `Sunrise: ${data.sunrise}\n`;
    if (data.sunset) formatted += `Sunset: ${data.sunset}\n`;
    if (data.moonrise) formatted += `Moonrise: ${data.moonrise}\n`;
    if (data.moonset) formatted += `Moonset: ${data.moonset}\n`;
    if (data.tithi) formatted += `Tithi: ${data.tithi}\n`;
    if (data.nakshatra) formatted += `Nakshatra: ${data.nakshatra}\n`;
    if (data.yoga) formatted += `Yoga: ${data.yoga}\n`;
    if (data.karana) formatted += `Karana: ${data.karana}\n`;

    return formatted || 'Panchang information';
  }

  /**
   * Format nakshatra data for display
   */
  formatNakshatraData(nakshatraData) {
    if (!nakshatraData.data) return 'Nakshatra data not available';
    
    const data = nakshatraData.data;
    let formatted = '';

    if (data.name) formatted += `Nakshatra: ${data.name}\n`;
    if (data.lord) formatted += `Lord: ${data.lord}\n`;
    if (data.description) formatted += `Description: ${data.description}\n`;

    return formatted || 'Nakshatra information';
  }

  /**
   * Send playlist to user via WhatsApp
   */
  async sendPlaylist(playlistId) {
    try {
      const playlist = await Playlist.findByPk(playlistId, {
        include: [{ model: User, as: 'user' }],
      });
      
      if (!playlist) {
        throw new Error('Playlist not found');
      }

      const user = playlist.user;
      const whatsappService = require('./whatsapp.service');

      // Sort playlist items by order
      const sortedItems = [...playlist.playlistItems].sort((a, b) => a.order - b.order);
      
      // Send each playlist item
      for (const item of sortedItems) {
        if (!item.isSent) {
          const message = `*${item.title}*\n\n${item.description}`;
          await whatsappService.sendTextMessage(user.phoneNumber, message);
          
          item.isSent = true;
          item.sentAt = new Date().toISOString();
        }
      }

      playlist.playlistItems = sortedItems;
      playlist.status = 'completed';
      playlist.sentAt = new Date();
      await playlist.save();

      logger.info(`Playlist ${playlistId} sent to user ${user.phoneNumber}`);
      return playlist;
    } catch (error) {
      logger.error('Error sending playlist:', error);
      throw error;
    }
  }
}

module.exports = new PlaylistService();
