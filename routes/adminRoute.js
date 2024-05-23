const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const Appointments = require ("../models/appointmentModel")
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');

router.get("/get-all-employees", authenticationMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).send({
      message: "Empleados cargados correctamente",
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error buscando los empleados",
      success: false,
      error,
    });
  }
});
router.get("/get-all-appointments", authenticationMiddleware ,async (req, res) => {
  try {
    const appointments = await Appointments.find({});
    res.status(200).send({
      message: "Turnos cargados correctamente",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error buscando los turnos",
      success: false,
      error,
    });
  }
});
router.delete("/delete-user",  async (req, res) => {
  try {
  const {userId}= req.body
    const userToDelete = await User.findOneAndDelete({_id:userId});
    res.status(200).send({
      message: "Usuario eliminado  correctamente",
      success: true,
      data: userToDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error eliminando el usuario" ,
      success: false,
      error,
    });
  }
})


router.delete("/delete-service",  async (req, res) => {
  try {
  const {employeeId}= req.body
    const employeeToDelete = await Employee.findOneAndDelete({_id:employeeId});
    res.status(200).send({
      message: "Servicio eliminado  correctamente",
      success: true,
      data: employeeToDelete,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error eliminando el servicio" ,
      success: false,
      error,
    });
  }
})
router.get("/get-all-users", authenticationMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Usuarios listados correctamente",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error buscando a los usuarios" ,
      success: false,
      error,
    });
  }
})

router.delete("/:employeeId", authenticationMiddleware, async (req, res) => {
  try {
    const deletedUser = await Employee.findByIdAndDelete(req.params.employeeId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
})

router.post("/change-employee-status", authenticationMiddleware, async (req, res) => {
    try {
          const { employeeId, status } = req.body
          const employee = await Employee.findByIdAndUpdate(employeeId,{ status});
          const user = await User.findOne({_id: employee.userId})
          const unseenNotifications = user.unseenNotifications;
          unseenNotifications.push({
          type: 'new-employee-request-changed',
          message: `tu cuenta de empleado cambio su estado a ${status}`,
          onClickPath: "/notifications",
    });
          user.isEmployee = status === "aprobado" ? true : false;
          await user.save()
          res.status(200).send({
              message:"Cambio de estado correctamente ",
              success: true,
              data:employee
          });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: "Error actualizando los empleados" ,
          success: false,
          error,
        });
    }
  })


module.exports = router;