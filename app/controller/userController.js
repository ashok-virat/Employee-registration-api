const mongoose = require('mongoose');
const userpath = require('./../model/userModel');
const userModel = mongoose.model('User');
const artpath = require('./../model/artModel');
const ArtModel = mongoose.model('Art');
const moment = require('moment');

let signup = async (req, res) => {
    try {
        let createnewuser = new userModel({
            email: req.body.email,
            status: req.body.status,
            password: req.body.password,
            userName: req.body.userName,
            userType: req.body.userType
        })
        const findUser = await userModel.findOne({
            $or: [{ email: req.body.email }, { userName: req.body.userName }],
        })
        if (findUser) {
            res.send('use different email and username')
        }
        else {
            createnewuser.save()
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(404).send('User Is Not Created');
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
            password: req.body.password,
            isApproved: true,
        }).select('-password');
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(404).send("User not found or admin not yet approved.");
        }
    }
    catch (e) {
        res.send(e)
    }
}

const getAllusers = async (req, res) => {
    try {
        const data = await userModel.find({ userType: 'employe' }).select('-password');
        res.send(data)
    }
    catch (e) {
        res.send(e)
    }
}

const approveUser = async (req, res) => {
    try {
        const userId = req.body.id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isApproved: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User approved successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error approving user", error });
    }
}


const createArt = async (req, res) => {
    try {
        const { artName, createdBy, description, status
        } = req.body;

        if (!artName || !createdBy) {
            return res.status(400).json({ message: 'Art name and creator (UUID) are required.' });
        }

        const newArt = new ArtModel({
            artName,
            createdBy,
            description,
            status
        });

        await newArt.save();

        res.status(201).json({ message: 'Art created successfully', art: newArt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating art', error: error.message });
    }
};

const getArtsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID (UUID) is required.' });
        }

        const arts = await ArtModel.find({ createdBy: userId });

        if (arts.length === 0) {
            return res.status(404).json({ message: 'No arts found for this user.' });
        }

        res.status(200).json(arts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving arts', error: error.message });
    }
};


const comleteArt = async (req, res) => {
    const { artId } = req.body
    try {
        const currentDate = new Date();

        const updatedArt = await ArtModel.findOneAndUpdate(
            { _id: artId },
            {
                $set: {
                    status: 'completed',
                    completedOn: currentDate
                }
            },
            { new: true }
        );

        if (!updatedArt) {
            console.log("No art found with the given name in progress status.");
            return;
        }

        const duration = moment.duration(moment(currentDate).diff(moment(updatedArt.createdOn)));
        const timeTaken = {
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds()
        };

        await ArtModel.findOneAndUpdate(
            { _id: artId },
            {
                $set: {
                    timeTaken: timeTaken
                }
            },
            { new: true }
        );

        res.send({ updatedArt, timeTaken });
    } catch (error) {
        res.status(500).json({ message: 'Error updating art', error: error.message });
    }
}

module.exports = {
    signup: signup,
    login: login,
    getAllusers: getAllusers,
    approveUser: approveUser,
    getArtsByUser,
    createArt,
    comleteArt
}