const controller = require('../controller/userController.js')
const appConfig = require('../config/appConfig.js');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/signup`, controller.signup);
    app.post(`${baseUrl}/login`, controller.login);
    app.get(`${baseUrl}/getusers`, controller.getAllusers);
    app.post(`${baseUrl}/approveUser`, controller.approveUser);
    app.post(`${baseUrl}/createArt`, controller.createArt);
    app.get(`${baseUrl}/arts/:userId`, controller.getArtsByUser);
    app.post(`${baseUrl}/completeArt`, controller.comleteArt);
    app.get(`${baseUrl}/allarts`, controller.getAllArts);
}

module.exports = {
    setRouter: setRouter
}