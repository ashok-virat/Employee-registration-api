let appConfig = {}

appConfig.port = 4001;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri: 'mongodb+srv://ashokChat:Viratashok@chat-app-free.gksijtl.mongodb.net/'
}
appConfig.apiVersion = "/v1";

module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env,
    db: appConfig.db,
    apiVersion: appConfig.apiVersion
}