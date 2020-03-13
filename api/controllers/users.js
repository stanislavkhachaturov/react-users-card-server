const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validationResult} = require('express-validator');

const User = require("../models/user");

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);  
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.array()[0].msg
            });
        }

        const user = await User.find({ email: req.body.email });
        if (user.length) {
            return res.status(409).json({
                message: "Mail exists"
            });
        } else {
            await bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash
                    });
                    try {
                        const result = await user.save();
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id
                            }, 
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        console.log(result);
                        res.status(201).json({
                            message: "User created",
                            token: token
                        });
                    } catch (error) {
                        console.log(error);
                        res.status(500).json({
                            error: err
                        });
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: err
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);  
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: errors.array()[0].msg
            });
        }

        const user = await User.find({ email: req.body.email });

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed1"
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: "Auth seccessful",
                    token: token
                }); 
            }
            return res.status(401).json({
                message: "Auth failed"
            });        
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}