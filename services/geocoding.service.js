const axios = require('axios');
const logger = require('../utils/logger');

class GeocodingService {
  constructor() {
    this.apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
    this.apiUrl = process.env.GOOGLE_GEOCODING_API_URL || 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          address: address,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const location = result.geometry.location;
        const addressComponents = this.parseAddressComponents(result.address_components);

        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: result.formatted_address,
          ...addressComponents,
        };
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Error geocoding address:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const addressComponents = this.parseAddressComponents(result.address_components);

        return {
          formattedAddress: result.formatted_address,
          ...addressComponents,
        };
      } else {
        throw new Error(`Reverse geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Error reverse geocoding:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Parse address components from Google API response
   */
  parseAddressComponents(components) {
    const parsed = {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      timezone: '',
    };

    components.forEach(component => {
      const types = component.types;

      if (types.includes('street_number') || types.includes('route')) {
        parsed.street = component.long_name;
      } else if (types.includes('locality') || types.includes('administrative_area_level_3')) {
        parsed.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        parsed.state = component.long_name;
      } else if (types.includes('country')) {
        parsed.country = component.long_name;
      } else if (types.includes('postal_code')) {
        parsed.postalCode = component.long_name;
      }
    });

    return parsed;
  }

  /**
   * Get timezone for coordinates
   */
  async getTimezone(latitude, longitude, timestamp = Math.floor(Date.now() / 1000)) {
    try {
      const timezoneUrl = 'https://maps.googleapis.com/maps/api/timezone/json';
      const response = await axios.get(timezoneUrl, {
        params: {
          location: `${latitude},${longitude}`,
          timestamp: timestamp,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK') {
        return {
          timezoneId: response.data.timeZoneId,
          timezoneName: response.data.timeZoneName,
          rawOffset: response.data.rawOffset,
          dstOffset: response.data.dstOffset,
        };
      } else {
        throw new Error(`Timezone lookup failed: ${response.data.status}`);
      }
    } catch (error) {
      logger.error('Error getting timezone:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GeocodingService();


