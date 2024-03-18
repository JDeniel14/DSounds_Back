
const routingDsoundsInfo = require('../routing/DsoundsInfoRouting')

module.exports = function(servExpress){

    servExpress.use('/api/DsoundsInfo',routingDsoundsInfo );

    
}