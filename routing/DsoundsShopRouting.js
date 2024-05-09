const express = require('express');

const router = express.Router();

const DsoundsShopController = require('../controllers/DsoundsShopController');


router.get('/ObtenerDiscos', DsoundsShopController.ObtenerDiscos);
router.get('/ObtenerDiscoById',DsoundsShopController.ObtenerDiscoById);
router.post('/RecuperarProvincias',DsoundsShopController.RecuperarProvincias);
router.get('/RecuperarMunicipios',DsoundsShopController.RecuperarMunicipios);
router.post('/RealizarPedido', DsoundsShopController.RealizarPedido);

module.exports =router;