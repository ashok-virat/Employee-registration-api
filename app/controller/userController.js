const mongoose = require('mongoose');
const userpath = require('./../model/userModel');
const userModel = mongoose.model('User');

let signup = async (req, res) => {
    try {
        let createnewuser = new userModel({
            email: req.body.email,
            status: req.body.status,
            password: req.body.password,
            userName: req.body.userName,
        })
        const findUser = await userModel.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
        if (findUser) {
            res.send('use different email and username')
        }
        else {
            createnewuser.save()
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(401).send('User Is Not Created');
                });
        }
    }
    catch (e) {
        res.send(e)
    }
}

const login = async (req, res) => {
    try {
        const data = await userModel.findOne({
            $or: [
                { email: req.body.email },
                { userName: req.body.userName }
            ],
            password: req.body.password
        });
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(401).send('Invalid email/username or password');
        }
    }
    catch (e) {
        res.send(e)
    }
}

const getAllusers = async (req, res) => {
    try {
        const data = await userModel.find().select('-password');
        res.send(data)
    }
    catch (e) {
        res.send(e)
    }
}


module.exports = {
    signup: signup,
    login: login,
    getAllusers: getAllusers,
}