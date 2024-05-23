const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String,
    },
    password: { 
        type: String, 
        required: true 
    },
    isEmployee: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    seenNotifications: {
        type: Array,
        default: []
    },
    unseenNotifications: {
        type: Array,
        default: []
    }
},
{
    timestamps: true
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;