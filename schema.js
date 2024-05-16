const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: { // Add userType field to store the user type
        type: String,
        required: true
    }
});

const User= mongoose.model('User', userSchema);
module.exports = {User};
