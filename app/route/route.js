const controller = require('../controller/userController.js')
const appConfig = require('../config/appConfig.js');

let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/signup`, controller.signup);
    app.post(`${baseUrl}/login`, controller.login);
    app.get(`${baseUrl}/getusers`, controller.getAllusers);
}

module.exports = {
    setRouter: setRouter
}