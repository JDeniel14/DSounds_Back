const express = require('express');

const router = express.Router();

const DsoundsClientController = require('../controllers/DsoundsClientController')


router.post('/Registro', DsoundsClientController.Registro)
router.post('/Login', DsoundsClientController.Login);
router.get('/ActivarCuenta',DsoundsClientController.ActivarCuenta);
router.get('/CancelarPedido', DsoundsClientController.CancelarPedido);


module.exports = router;