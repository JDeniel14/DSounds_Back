//require('dotenv').config();

process.loadEnvFile(); //<--- nueva forma de cargar .env sin dotenv

const express = require('express');
var serverExpress = express();


const mongoose =require('mongoose');
const configServer = require('./config/config_pipeline');


serverExpress.listen(3003, ()=> console.log('...Servidor express escuchando por puerto 3003'));
configServer(serverExpress);



mongoose.connect(process.env.CONNECTION_MONGODB)
        .then(()=> console.log('conexión al server de MongoDB establecida'))
        .catch((err)=>console.log('fallo al conectar al servidor de MongoDB'));