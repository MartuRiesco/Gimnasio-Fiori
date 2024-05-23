const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    employeeId: { 
      type: String, 
      required: true 
    },
    classId: { 
      type: String, 
      required: true 
    },
    employeeInfo: { 
      type: Object, 
      required: true 
    },
    userInfo: {
      type: Object,
      required: true 
    },
    status: {
      type: String,
      required: true,
      default: "pendiente"
    }
  },
  {
    timestamps: true
  }
);

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;