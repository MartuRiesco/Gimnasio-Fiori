const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    day: { type: String, required: true },
    timings: { type: Array, required: true }
});
const employeeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    classes: [classSchema],
    status: {
        type: String,
        default: 'pendiente'
    }
}, {
    timestamps: true
});

const employeeModel = mongoose.model('employees', employeeSchema);

module.exports = employeeModel;