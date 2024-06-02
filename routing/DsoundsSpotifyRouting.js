const express = require('express');

const router = express.Router();

const DsoundsSpotifyController = require('../controllers/DsoundsSpotifyController')

router.get('/LoginSpotify', DsoundsSpotifyController.LoginSpotify);
router.get('/CallbackSpotify',DsoundsSpotifyController.CallbackSpotify);
router.post('/GetRefreshTokenSpotify', DsoundsSpotifyController.GetRefreshToken);
router.get('/ObtenerPerfilSpotify',DsoundsSpotifyController.ObtenerPerfilSpotify);
router.get('/ObtenerPlaylistUsuario', DsoundsSpotifyController.ObtenerPlaylistUsuario);
router.post('/BuscarAlbumSpotify', DsoundsSpotifyController.BuscarAlbumSpotify);
router.post('/AddDiscoToPlaylist', DsoundsSpotifyController.AddDiscoToPlaylist);



module.exports=router;