const express = require('express');

const router = express.Router();

const DsoundsSpotifyController = require('../controllers/DsoundsSpotifyController')

router.get('/LoginSpotify', DsoundsSpotifyController.LoginSpotify);
router.get('/CallbackSpotify',DsoundsSpotifyController.CallbackSpotify);
router.post('/GetRefreshTokenSpotify', DsoundsSpotifyController.GetRefreshToken);

module.exports=router;