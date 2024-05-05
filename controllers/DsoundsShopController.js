

const mongoose = require('mongoose');
const axios = require('axios')

var Cliente = require('../models/Clientes')
var Disco = require('../models/Disco');
var Direccion = require('../models/direccion');
var Pedido = require('../models/pedido')

const GEOAPI_KEY = process.env.GEOAPI_KEY;

module.exports = {
    ObtenerDiscos : async(req,res,next)=>{
        try {
            
            let discos = await Disco.find()


            if(discos.length > 0){
                return res.status(200).send({
                        codigo: 0,
                        mensaje: 'Discos recuperados correctamente',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: discos
                })
            }else{
                
                throw new Error('error obteniendo discos...')
            }

        } catch (error) {
            return res.status(400).send({
                        codigo: 1,
                        mensaje: 'Ha ocurrido un error al recuperar los discos de la bd',
                        error: error,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
            })
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    ObtenerDiscoById: async(req,res,next)=>{
        try {
            let {idDisco} = req.query;
            console.log('id disco a buscar...',idDisco)

            let disco = await Disco.findById(idDisco);

            if(disco != undefined){
                return res.status(200).send({
                    codigo: 0,
                    mensaje: 'Disco recuperados correctamente',
                    error: null,
                    datosCliente: null,
                    token: null,
                    otrosdatos: disco
            })
        }else{
            
            throw new Error('error obteniendo discos...')
        }
        } catch (error) {
            return res.status(400).send({
                        codigo: 1,
                        mensaje: 'Ha ocurrido un error al recuperar el disco de la bd',
                        error: error,
                        datosCliente: null,
                        token: null,
                        otrosdatos: null
            })
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    recuperarProvincias: async (req,res,next)=>{
        try {
            console.log('hola..121321', GEOAPI_KEY)
            let _resp = await axios.get(`https://apiv1.geoapi.es/provincias?type=JSON&key=${GEOAPI_KEY}&sandbox=1`);
            console.log(_resp.data)
            let _provincias = _resp.data.data;
            console.log('provs....',_provincias)
            res.status(200).send(_provincias);
        } catch (error) {
            res.status(400).send([]);
        }
    },

    recuperarMunicipios: async(req,res,next)=> {
        try {
            let {codpro}=req.query;
            

            let _resp=await axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${codpro}&type=JSON&key=${process.env.GEOAPI_KEY}&sandbox=0`);
            let _municipios=_resp.data.data;
            
            res.status(200).send(_municipios)
        } catch (error) {
            res.status(400).send([]);
        }
    },
}
