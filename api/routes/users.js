const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const UserController = require("../controllers/users");

router.post("/signup", [ 
    check('email', 'Your email is not valid').isEmail(),
    check('password', 'Your password must be at least 5 characters').isLength({ min: 5 }),
    check('lastName', 'Last name is required').notEmpty(),
    check('firstName', 'First name is required').notEmpty()
    ], UserController.signup);

router.post("/login",[ 
    check('email', 'Your email is not valid').notEmpty(),
    check('password', 'Your password must be at least 5 characters').notEmpty()
    ], UserController.login);

module.exports = router;