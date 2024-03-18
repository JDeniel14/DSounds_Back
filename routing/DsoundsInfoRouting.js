const express = require('express');

const router = express.Router();

const DsoundsInfoController = require('../controllers/DsoundsInfoController')

router.post('/GetAllEventsSpain', DsoundsInfoController.GetAllEventsSpain);


module.exports=router;