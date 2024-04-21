
const axios = require('axios')

const ticketmaster_consumer = process.env.TICKETMASTER_CONSUMER;
const ticketmaster_secret = process.env.TICKETMASTER_SECRET;
module.exports={
    GetAllEventsSpain: async(req, res, next)=> {

        try {
    
            
    
    
            let eventosSpain ;
    
            await axios.get(
                `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmaster_consumer}&size=15&locale=es&countryCode=es`
            ).then(function(resp){
                
                eventosSpain = resp.data; 
            }).catch(function(error){
                console.log('error...', error);
            });

            if(eventosSpain){
                
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'Eventos recuperados desde ticketmaster',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: eventosSpain
                    }
                )
            }else{
                throw new Error('Error al recuperar los eventos...')
            }
    
        } catch (error) {
            res.status(500).send({
                codigo: 1,
                mensaje: 'error al recuperar los eventos desde ticketmaster',
                error: error.message,
                datosCliente: null,
                token: null,
                otrosdatos: null
            });
        }
    },

    ObtenerEventoById: async(req,res,next)=>{
        try {
            let {idEvento} = req.query;
            console.log('id evento...',idEvento)
            let infoEvento;

            await axios.get(
                `https://app.ticketmaster.com/discovery/v2/events/${idEvento}.json?apikey=${ticketmaster_consumer}&locale=es`
            ).then(function(resp){
                
                infoEvento = resp.data; 
            }).catch(function(error){
                console.log('error...', error);
            });

            if(infoEvento){
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje: 'Info del evento recuperada desde ticketmaster',
                        error: null,
                        datosCliente: null,
                        token: null,
                        otrosdatos: infoEvento
                    }
                )
            }else{
                throw new Error('Error al recuperar los eventos...')
            }

        } catch (error) {
            res.status(500).send({
                codigo: 1,
                mensaje: 'error al recuperar info del evento desde ticketmaster',
                error: error.message,
                datosCliente: null,
                token: null,
                otrosdatos: null
            });
        }
    }
}