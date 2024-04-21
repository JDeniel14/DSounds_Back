const express = require('express');

const router = express.Router();

const DsoundsShopController = require('../controllers/DsoundsShopController');


router.get('/ObtenerDiscos', DsoundsShopController.ObtenerDiscos);
router.get('/ObtenerDiscoById',DsoundsShopController.ObtenerDiscoById);

module.exports =router;