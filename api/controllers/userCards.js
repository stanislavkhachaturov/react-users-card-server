const mongoose = require("mongoose");

const UserCard = require("../models/userCard");

exports.user_cards_get_all = async (req, res, next) => {
    try {
        const userCards = await UserCard.find().select("_id firstName lastName address status");    

        const response = {
            userCards: userCards.map(doc => {
                return {
                    id: doc._id,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    address: doc.address,
                    status: doc.status
                }
            })      
        }

        if (userCards.length) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: "No entries found"
            });
        }
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            error: error
        });
    }  
};

exports.user_cards_get_one = async (req, res, next) => {
    try {
        const userCard = await UserCard.findOne({ _id: req.params.id }).select("_id firstName lastName address status");    

        console.log(userCard);
        if (userCard._id) {
            res.status(200).json(userCard);
        } else {
            res.status(404).json({
                message: "No entries found"
            });
        }
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            error: error
        });
    }  
};

exports.user_cards_create = async (req, res, next) => {
    try {
        const userCard = new UserCard({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            status: req.body.status
        });
    
        await userCard.save();
    
        res.status(201).json({
            message: "User added",
            createdUser: {
                id: userCard._id,
                firstName: userCard.firstName,
                lastName: userCard.lastName,
                address: userCard.address,
                status: userCard.status
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

exports.user_cards_edit = async (req, res, next) => {
    try {
        const id = req.body.id;

        const modifiedUserCard = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            status: req.body.status
        }

        const updatedUserCard = await UserCard.updateOne({ _id: id }, { $set: modifiedUserCard });

        console.log("updatedUsereCard", updatedUserCard);
        res.status(200).json(updatedUserCard);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            error: error
        });
    }
}

exports.user_cards_delete = async (req, res, next) => {
    try {
        const id = req.body.userId;

        const removedUserCard = await UserCard.deleteOne({ _id: id });
    
        res.status(200).json(removedUserCard);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}