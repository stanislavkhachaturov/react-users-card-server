const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const uri = process.env.ATLAS_URI;
mongoose.connect(
    uri, 
    { 
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true 
    }
);
const connection = mongoose.connection;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const usersRouter = require('./api/routes/users');
const usersCardsRouter = require('./api/routes/userCards');

app.use('/', usersRouter);
app.use('/users', usersCardsRouter);

app.use((req, res, next) => {
    res.header("Accsess-Control-Allow-Origin", "*");
    res.header(
        "Accsess-Control-Allow-Headers",
        "Oridin, X-Requested-With, Content-Type, Accept, Authorization"
        );
    if (req.method === "OPTIONS") {
        res.header(
            "Accsess-Control-Allow-Methods", 
            "PUT, POST, PATCH, DELETE"
        );
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 400;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;