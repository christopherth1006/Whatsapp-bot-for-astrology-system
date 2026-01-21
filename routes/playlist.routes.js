const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');

// Get playlists for a user
router.get('/user/:userId', playlistController.getUserPlaylists);

// Get playlist by ID
router.get('/:id', playlistController.getPlaylistById);

// Generate playlist for user
router.post('/generate', playlistController.generatePlaylist);

// Send playlist
router.post('/:id/send', playlistController.sendPlaylist);

module.exports = router;


