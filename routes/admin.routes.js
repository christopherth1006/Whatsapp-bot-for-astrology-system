const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Get dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user by ID
router.get('/users/:id', adminController.getUserById);

// Update user
router.put('/users/:id', adminController.updateUser);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get all playlists
router.get('/playlists', adminController.getAllPlaylists);

// Get playlist by ID
router.get('/playlists/:id', adminController.getPlaylistById);

// Manually trigger playlist generation
router.post('/playlists/generate', adminController.generatePlaylists);

// Send playlist manually
router.post('/playlists/:id/send', adminController.sendPlaylist);

module.exports = router;


