const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');
const Appointment = require("../models/appointmentModel");
const moment = require('moment');


router.post("/get-employee-info-by-userid", authenticationMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findOne({userId: req.body.userId})
        res.status(200).send({
            success:true, 
            message: "Informacion del empleado ",
            data: employee
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error buscando la informacion de los empleados" ,
        success: false,
        error,
      });
    }
  })
  router.post("/get-employee-info-by-id", authenticationMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.body.employeeId })
        console.log(employee);
        res.status(200).send({
            success:true, 
            message: "Informacion del empleado ",
            data: employee
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error buscando la informacion de los empleados" ,
        success: false,
        error,
      });
    }
  })

  router.post("/update-employee-profile", authenticationMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(200).send({
            success:true, 
            message: "Informacion del empleado actualizada correctamente.",
            data: employee
        })
        console.log('employee', employee);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error actualizando la informacion de los empleados" ,
        success: false,
        error,
      });
    }
  })
  router.get("/get-appointments-by-employee-id", authenticationMiddleware, async (req, res) => {
    try {
      const employee = await Employee.findOne({ userId: req.body.userId })
      const appointments = await Appointment.find({employeeId: employee._id})
      res.status(200).send({
        message:"Turnos listados correctamente",
        success:true,
        data: appointments,
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error buscando los turnos",
        success: false,
        error,
      });
    }
  });

  router.delete('/delete-appointment', async (req, res) => {
      try {
        const { appointmentId, userInfo } = req.body;
       console.log(userInfo);
        const appointmentIdDelete = await Appointment.findOneAndDelete({ _id: appointmentId });
        const user = await User.findOne({ _id: userInfo._id });
        user.unseenNotifications.push({
          type: 'Turno Eliminado',
          message: 'Su turno ha sido eliminado',
        });
        await user.save();
        console.log(user);
        res.status(200).send({
          message: "Turno eliminado correctamente",
          success: true,
          data: {appointmentIdDelete, user}
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Error eliminando el turno" ,
          success: false,
          error,
        });
      }
  })

  router.post("/change-apppointment-status",/*  authenticationMiddleware, */ async (req, res) => {
    try {
          const {appointmentId,  status} = req.body
          const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status });
          const user = await User.findOne({_id: appointment.userId})
          const unseenNotifications = user.unseenNotifications;
          unseenNotifications.push({
          type: 'appointment-request-changed',
          message: `Su turno cambio su estado a ${status}`,
          onClickPath: "/appointments",
      })
      
      await user.save()
          res.status(200).send({
          message: "Cambio de estado del turno correctamente ",
          success: true,
      })
    } catch (error) {
          console.log(error);
          res.status(500).send({
            message: "Error actualizando los turnos" ,
            success: false,
            error,
      });
    }
  })

module.exports = router;