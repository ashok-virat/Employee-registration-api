let appConfig = {}

appConfig.port = 4001;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb+srv://ashokChat:Viratashok@chat-app-free.gksijtl.mongodb.net/',
    // uri: 'mongodb://localhost:27017'
}
appConfig.apiVersion = "/v1";

// cipNzYcwbczg2MxC
//mongodb+srv://mugeshkannan3112:Viraatshok01@@employee-service.qnljy.mongodb.net/

module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db: appConfig.db,
    apiVersion: appConfig.apiVersion
}