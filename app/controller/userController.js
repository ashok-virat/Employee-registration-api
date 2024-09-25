const mongoose = require('mongoose');
const userpath = require('./../model/userModel');
const userModel = mongoose.model('User');
const artpath = require('./../model/artModel');
const ArtModel = mongoose.model('Art');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const secretKey = "ak-vk";

let signup = async (req, res) => {
    try {
        const { email, password, userName, firstName, lastName, userType, isApproved } = req.body;

        if (!email || !password || !userName || !firstName || !lastName) {
            return res.status(400).send("All fields (email, password, username, first name, last name) are required.");
        }

        let createnewuser = new userModel({
            email,
            password,
            userName,
            userType,
            firstName,
            lastName,
            isApproved
        });

        const findUser = await userModel.findOne({
            $or: [{ email }, { userName }]
        });

        if (findUser) {
            return res.status(400).send("Use a different email or username.");
        } else {
            createnewuser.save()
                .then(result => {
                    res.status(201).send(result);
                })
                .catch(err => {
                    res.status(500).send("User could not be created.");
                });
        }
    } catch (e) {
        res.status(500).send(e.message || "An error occurred.");
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
            const token = jwt.sign({ id: data._id, email: data.email, userName: data.userName }, secretKey, { expiresIn: '1h' });

            res.status(200).send({
                token,
                user: data,
            });
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
        const data = await userModel.find({ userType: 'employe' }).select('-password').sort({ createdOn: -1 });
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
        const { artName, createdBy, description, status, ownerName
        } = req.body;

        if (!artName || !createdBy) {
            return res.status(400).json({ message: 'Art name and creator (UUID) are required.' });
        }

        const createdOn = moment().toDate()

        const newArt = new ArtModel({
            artName,
            createdBy,
            description,
            status,
            ownerName,
            createdOn
        });

        await newArt.save();

        res.status(201).json({ message: 'Art created successfully', art: newArt });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating arcrt', error: error.message });
    }
};

const getArtsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID (UUID) is required.' });
        }

        const arts = await ArtModel.find({ createdBy: userId }).sort({ createdOn: -1 });

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

const getAllArts = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};

        if (fromDate && toDate) {
            const startOfDay = moment(fromDate).startOf('day').toDate();
            const endOfDay = moment(toDate).endOf('day').toDate();

            filter.createdOn = {
                $gte: new Date(startOfDay),
                $lte: new Date(endOfDay),
            };
        }

        const inProgressCount = await ArtModel.countDocuments({ ...filter, status: 'inProgress' })

        const completedCount = await ArtModel.countDocuments({ ...filter, status: 'completed' })

        res.status(200).json({ inProgressCount, completedCount, startOfDay, endOfDay });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving arts', error: error.message });
    }
};

const getArtsGroupedByCreatedBy = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let filter = {};

        if (fromDate && toDate) {
            const startOfDay = moment(fromDate).startOf('day').toDate();
            const endOfDay = moment(toDate).endOf('day').toDate();
            console.log(startOfDay)
            console.log(endOfDay)
            filter.createdOn = {
                $gte: new Date(startOfDay),
                $lte: new Date(endOfDay),
            };
        }

        const artsGroupedByCreatedBy = await ArtModel.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: "$createdBy",
                    totalArts: { $sum: 1 },
                    ownerName: { $first: "$ownerName" },
                    completedArts: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    inProgressArts: {
                        $sum: { $cond: [{ $eq: ["$status", "inProgress"] }, 1, 0] }
                    },
                    totalTimeTaken: {
                        $sum: {
                            $add: [
                                { $multiply: ["$timeTaken.days", 86400] },
                                { $multiply: ["$timeTaken.hours", 3600] },
                                { $multiply: ["$timeTaken.minutes", 60] },
                                "$timeTaken.seconds"
                            ]
                        }
                    },
                    arts: {
                        $push: {
                            artName: "$artName",
                            description: "$description",
                            status: "$status",
                            createdOn: "$createdOn",
                            completedOn: "$completedOn",
                            timeTaken: "$timeTaken"
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        artsGroupedByCreatedBy.forEach(user => {
            const totalSeconds = user.totalTimeTaken;

            user.timeTaken = {
                days: Math.floor(totalSeconds / 86400),
                hours: Math.floor((totalSeconds % 86400) / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60
            };

            delete user.totalTimeTaken;
        });

        if (artsGroupedByCreatedBy.length === 0) {
            return res.status(200).json({ message: 'No arts found' });
        }

        res.status(200).json(artsGroupedByCreatedBy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving grouped arts', error: error.message });
    }
};



module.exports = {
    signup: signup,
    login: login,
    getAllusers: getAllusers,
    approveUser: approveUser,
    getArtsByUser,
    createArt,
    comleteArt,
    getAllArts,
    getArtsGroupedByCreatedBy
}