
const routingDsoundsInfo = require('../routing/DsoundsInfoRouting')
const routingDsoundsClient = require('../routing/DsoundsClientRouting')
const routingDsoundsShop = require('../routing/DsoundsShopRouting')
const routingDsoundsSpotify = require('../routing/DsoundsSpotifyRouting')

module.exports = function(servExpress){

    servExpress.use('/api/DsoundsInfo',routingDsoundsInfo );
    
    servExpress.use('/api/DsoundsClient', routingDsoundsClient);
    
    servExpress.use('/api/DsoundsShop', routingDsoundsShop);
    
    servExpress.use('/api/DsoundsSpotify',routingDsoundsSpotify);
}