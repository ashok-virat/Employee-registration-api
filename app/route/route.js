const controller = require('../controller/userController.js')
const appConfig = require('../config/appConfig.js');
const middleWare = require('../middleware/validator.js');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/signup`, controller.signup);
    app.post(`${baseUrl}/login`, controller.login);
    app.get(`${baseUrl}/getusers`, middleWare.verifyToken, controller.getAllusers);
    app.post(`${baseUrl}/approveUser`, middleWare.verifyToken, controller.approveUser);
    app.post(`${baseUrl}/createArt`, middleWare.verifyToken, controller.createArt);
    app.get(`${baseUrl}/arts/:userId`, middleWare.verifyToken, controller.getArtsByUser);
    app.post(`${baseUrl}/completeArt`, middleWare.verifyToken, controller.comleteArt);
    app.get(`${baseUrl}/allarts`, middleWare.verifyToken, controller.getAllArts);
    app.get(`${baseUrl}/alluserlevelarts`, middleWare.verifyToken, controller.getArtsGroupedByCreatedBy);
}

module.exports = {
    setRouter: setRouter
}