const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flow.controller');

// Handle the flow logic
router.post('/', flowController.handleFlow.bind(flowController));

module.exports = router;


