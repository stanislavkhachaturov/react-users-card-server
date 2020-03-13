const mongoose = require("mongoose");

const userCardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { 
        type: String,
        required: true 
    },
    lastName: { 
        type: String,
        required: true 
    },    
    address: { 
        type: String
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model("UserCard", userCardSchema);