const express = require('express');

const router = express.Router();

const DsoundsShopController = require('../controllers/DsoundsShopController');


router.get('/ObtenerDiscos', DsoundsShopController.ObtenerDiscos);
router.get('/ObtenerDiscoById',DsoundsShopController.ObtenerDiscoById);
router.post('/RecuperarProvincias',DsoundsShopController.recuperarProvincias);
router.get('/RecuperarMunicipios',DsoundsShopController.recuperarMunicipios);

module.exports =router;