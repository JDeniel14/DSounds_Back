const express = require('express');

const router = express.Router();

const DsoundsInfoController = require('../controllers/DsoundsInfoController')

router.post('/GetAllEventsSpain', DsoundsInfoController.GetAllEventsSpain);
//router.get('/ObtenerInfoEvento',DsoundsInfoController.ObtenerInfoEvento)

module.exports=router;