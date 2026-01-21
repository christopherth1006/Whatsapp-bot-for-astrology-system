const axios = require('axios');
const logger = require('../utils/logger');

class AstrologyService {
  constructor() {
    this.apiKey = process.env.PROKERALA_API_KEY;
    this.apiUrl = process.env.PROKERALA_API_URL || 'https://api.prokerala.com/v2/astrology';
  }

  /**
   * Get daily horoscope
   */
  async getDailyHoroscope(sign, date = new Date()) {
    try {
      const response = await axios.get(`${this.apiUrl}/horoscope/daily`, {
        params: {
          sign: sign,
          date: date.toISOString().split('T')[0],
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching daily horoscope:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get panchang (Hindu calendar) data
   */
  async getPanchang(latitude, longitude, date = new Date()) {
    try {
      const response = await axios.get(`${this.apiUrl}/panchang`, {
        params: {
          ayanamsa: 1, // Lahiri
          coordinates: `${latitude},${longitude}`,
          datetime: date.toISOString(),
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching panchang:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get birth chart details
   */
  async getBirthChart(birthDate, birthTime, latitude, longitude, timezone) {
    try {
      const response = await axios.get(`${this.apiUrl}/birth-chart`, {
        params: {
          ayanamsa: 1,
          coordinates: `${latitude},${longitude}`,
          datetime: `${birthDate}T${birthTime}`,
          timezone: timezone,
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching birth chart:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get weekly horoscope
   */
  async getWeeklyHoroscope(sign, weekStartDate = new Date()) {
    try {
      const response = await axios.get(`${this.apiUrl}/horoscope/weekly`, {
        params: {
          sign: sign,
          start_date: weekStartDate.toISOString().split('T')[0],
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching weekly horoscope:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get monthly horoscope
   */
  async getMonthlyHoroscope(sign, month, year) {
    try {
      const response = await axios.get(`${this.apiUrl}/horoscope/monthly`, {
        params: {
          sign: sign,
          month: month,
          year: year,
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching monthly horoscope:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get nakshatra (lunar mansion) details
   */
  async getNakshatra(latitude, longitude, date = new Date()) {
    try {
      const response = await axios.get(`${this.apiUrl}/nakshatra`, {
        params: {
          ayanamsa: 1,
          coordinates: `${latitude},${longitude}`,
          datetime: date.toISOString(),
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching nakshatra:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new AstrologyService();


