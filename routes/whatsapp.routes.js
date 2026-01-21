const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// Webhook verification (GET)
router.get('/', whatsappController.verifyWebhook.bind(whatsappController));

// Webhook handler (POST)
router.post('/', whatsappController.handleWebhook.bind(whatsappController));

module.exports = router;


