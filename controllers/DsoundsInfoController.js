
const axios = require('axios')
module.exports={
    GetAllEventsSpain: async(req, res, next)=> {

        try {
    
            console.log('Obteniendo eventos...');
    
            const ticketmaster_consumer = process.env.TICKETMASTER_CONSUMER;
            const ticketmaster_secret = process.env.TICKETMASTER_SECRET;
    
            let eventosSpain ;
    
            await axios.get(
                `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketmaster_consumer}&size=15&locale=es&countryCode=es`
            ).then(function(resp){
                console.log('resp..', resp.data);
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
    }
}