const whatsappService = require('../services/whatsapp.service');
const userService = require('../services/user.service');
const geocodingService = require('../services/geocoding.service');
const logger = require('../utils/logger');

class WhatsAppController {
  /**
   * Webhook verification (GET)
   */
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (whatsappService.verifyWebhook(mode, token)) {
      logger.info('Webhook verified');
      res.status(200).send(challenge);
    } else {
      logger.warn('Webhook verification failed');
      res.sendStatus(403);
    }
  }

  /**
   * Handle incoming webhook messages (POST)
   */
  async handleWebhook(req, res) {
    try {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        // Handle messages
        if (value?.messages) {
          const message = value.messages[0];

          await whatsappService.markAsRead(message.id)
          await this.processIncomingMessage(message, value.contacts?.[0]);
        }

        // Handle status updates
        if (value?.statuses) {
          const status = value.statuses[0];
          logger.info(`Message status update: ${status.id} - ${status.status}`);
        }

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      logger.error('Error handling webhook:', error);
      res.sendStatus(500);
    }
  }

  /**
   * Process incoming WhatsApp message
   */
  async processIncomingMessage(message, contact) {
    try {
      console.log(message)
      const phoneNumber = message.from;
      const messageText = message.text?.body || '';
      const messageType = message.type;

      logger.info(`Received ${messageType} message from ${phoneNumber}: ${messageText}`);

      // Find or create user
      let user = await userService.findByPhoneNumber(phoneNumber);
      
      if (!user) {
        user = await userService.createUser({
          phoneNumber,
          name: contact?.profile?.name || '',
        });
        await this.sendWelcomeMessage(phoneNumber, user);
        return
      }
      console.log(messageText)
      if (user.problem === null) {
        await this.sendDetailsFlowMessage(phoneNumber);
        return
      }

      // Update last interaction
      user.lastInteraction = new Date();
      await user.save();

      // Process message based on type
      if (messageType === 'text') {
        await this.handleTextMessage(user, messageText);
      } else if (messageType === 'location') {
        await this.handleLocationMessage(user, message.location);
      } else if (messageType === 'interactive') {
        await this.handleInterativeMessage(user, message.interactive)
      } else {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'I can only process text messages and location sharing. Please send your location or a text message.'
        );
      }
    } catch (error) {
      logger.error('Error processing incoming message:', error);
    }
  }

  /**
   * Handle text message
   */
  async handleTextMessage(user, messageText) {
    const text = messageText.toLowerCase().trim();

    if (text.includes('location') || text.includes('address')) {
      await whatsappService.sendTextMessage(
        user.phoneNumber,
        'Please share your location so I can provide accurate astrology information.'
      );
    } else if (text.includes('horoscope') || text.includes('daily')) {
      await this.sendDailyHoroscope(user);
    } else if (text.includes('help') || text.includes('menu')) {
      await this.sendHelpMessage(user.phoneNumber);
    } else {
      await whatsappService.sendTextMessage(
        user.phoneNumber,
        'Hello! I can help you with:\n\n1. Daily horoscope\n2. Panchang information\n3. Location-based astrology\n\nSend "help" for more options.'
      );
    }
  }

  /**
   * Handle location message
   */
  async handleLocationMessage(user, location) {
    try {
      const { latitude, longitude } = location;

      // Reverse geocode to get address
      const addressData = await geocodingService.reverseGeocode(latitude, longitude);
      
      // Get timezone
      const timezoneData = await geocodingService.getTimezone(latitude, longitude);

      // Update user location
      user.location = {
        latitude,
        longitude,
        address: addressData.formattedAddress,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
      };

      if (!user.preferences) {
        user.preferences = {};
      }
      user.preferences.timezone = timezoneData.timezoneId;

      await user.save();

      await whatsappService.sendTextMessage(
        user.phoneNumber,
        `Location saved! I'll provide astrology information based on ${addressData.city || addressData.formattedAddress}.`
      );
    } catch (error) {
      logger.error('Error handling location:', error);
      await whatsappService.sendTextMessage(
        user.phoneNumber,
        'Sorry, I couldn\'t process your location. Please try again.'
      );
    }
  }

  async handleInterativeMessage(user, interactive) {
    const type = interactive.type;

    if (type === 'button_reply') {
      const { title } = interactive.button_reply;
      user.language = title;
      await user.save();
    } else if (type === 'nfm_reply') {
      // send confirmation message
      const message = "You've successfully registered your details!";
      await whatsappService.sendTextMessage(phoneNumber, message);
    }
  }
  
  /**
   * Send welcome message
   */
  async sendWelcomeMessage(phoneNumber, user) {
    // Update last interaction
    user.lastInteraction = new Date();
    await user.save();

    const message = `Welcome to Astrology Automation! 🌟\n\nI can help you with:\n\n1. Daily horoscope\n2. Panchang information\n3. Location-based astrology\n\nPlease share your location to get started, or send "help" for more options.`;
    await whatsappService.sendTextMessage(phoneNumber, message);
  }

  async sendDetailsFlowMessage(phoneNumber) {
    await whatsappService.sendInteractiveMessage(phoneNumber, {
      type: "flow",
      header: {
        type: "text",
        text: "Hello there 👋",
      },
      body: {
        text: "Ready to transform your space? Schedule a personalized consultation with our expert team!",
      },
      footer: {
        text: "Click the button below to proceed",
      },
      action: {
        name: "flow",
        parameters: {
          flow_id: process.env.FLOW_ID,
          flow_message_version: "3",
          // replace flow_token with a unique identifier for this flow message to track it in your endpoint & webhook
          flow_token: process.env.FLOW_TOKEN,
          flow_cta: "Book an appointment",
          flow_action: "data_exchange",
          // uncomment to send a draft flow before publishing
          mode: "draft",
        },
      },
    })
  }

  async sendLocationMessage(phoneNumber) {
    await whatsappService.sendInteractiveMessage(phoneNumber, {
      type: "location_request_message",
      body: {
        text: "Pls send your place of birth."
      },
      action: {
        name: "send_location"
      }
    })
  }

  /**
   * Send help message
   */
  async sendHelpMessage(phoneNumber) {
    const message = `*Astrology Automation Help*\n\nAvailable commands:\n\n📍 Share Location - Get location-based astrology\n📅 Daily Horoscope - Get your daily horoscope\n📋 Panchang - Get today's panchang\n❓ Help - Show this menu\n\nYou'll receive daily updates automatically!`;
    await whatsappService.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send daily horoscope
   */
  async sendDailyHoroscope(user) {
    try {
      const playlistService = require('../services/playlist.service');
      const today = new Date();
      const playlist = await playlistService.generatePlaylist(user.id, today);
      
      if (playlist && playlist.playlistItems && playlist.playlistItems.length > 0) {
        const horoscopeItem = playlist.playlistItems.find(item => item.contentType === 'horoscope');
        if (horoscopeItem) {
          await whatsappService.sendTextMessage(
            user.phoneNumber,
            `*${horoscopeItem.title}*\n\n${horoscopeItem.description}`
          );
        } else {
          await whatsappService.sendTextMessage(
            user.phoneNumber,
            'Please share your location and birth details to get personalized horoscope.'
          );
        }
      } else {
        await whatsappService.sendTextMessage(
          user.phoneNumber,
          'Please share your location and birth details to get personalized horoscope.'
        );
      }
    } catch (error) {
      logger.error('Error sending daily horoscope:', error);
      await whatsappService.sendTextMessage(
        user.phoneNumber,
        'Sorry, I couldn\'t fetch your horoscope. Please try again later.'
      );
    }
  }
}

module.exports = new WhatsAppController();
