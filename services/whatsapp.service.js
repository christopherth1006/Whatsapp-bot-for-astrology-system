const axios = require('axios');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.GRAPH_API_URL || 'https://graph.facebook.com/v24.0';
    this.phoneNumberId = process.env.PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;
  }

  /**
   * Send text message via WhatsApp
   */
  async sendTextMessage(phoneNumber, message) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      logger.info(`Message sent to ${phoneNumber}:`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send template message via WhatsApp
   */
  async sendTemplateMessage(phoneNumber, templateName, languageCode = 'en', parameters = []) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param,
              })),
            },
          ] : [],
        },
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      logger.info(`Template message sent to ${phoneNumber}:`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error sending WhatsApp template:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send interactive message (buttons, lists)
   */
  async sendInteractiveMessage(phoneNumber, interactiveData) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'interactive',
        interactive: interactiveData,
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      logger.info(`Interactive message sent to ${phoneNumber}:`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error sending interactive message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Error marking message as read:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verify webhook token
   */
  verifyWebhook(mode, token) {
    return mode === 'subscribe' && token === this.verifyToken;
  }
}

module.exports = new WhatsAppService();


