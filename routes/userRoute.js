const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Employee = require('../models/employeeModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');
const Appointment = require('../models/appointmentModel');
const moment = require('moment');

router.post('/register', async(req, res) => {
    try {
        const email = req.body.email.toLowerCase()
        const userExists = await User.findOne({ email: email });
        if(userExists) {
          return res
            .status(200)
            .send({ message: 'Usuario ya registrado.', success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res
            .status(200)
            .send({ message: 'Usuario creado exitosamente!', success: true })
    } catch (error) {
        res
            .status(500)
            .send({ message: 'Error creando al usuario.', success: false, error })
    }
});

router.post('/login', async(req, res) => {
    try {
        const email = req.body.email.toLowerCase()
        const user = await User.findOne({ email:email });
        if(!user) {
            return res
                .status(200)
                .send({ message: 'No existe el usuario', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch) {
            return res
                .status(200)
                .send({ message: 'Password is incorrect', success: false });
        } else {
            
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
            res
                .status(200)
                .send({ message: 'Login successful', success: true, data: token })
        }
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: 'Error logging in', success: false, error})
    }
});

router.post('/get-user-info-by-id', authenticationMiddleware, async(req, res) => {
    try {

        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined
        if(!user) {
            return res
                .status(200)
                .send({ message: 'No existe el usuario', success: true, data: user })
        } else {
            res
                .status(200)
                .send({ success: true, data: user})
        }
    } catch (error) {
        res
         .status(500)
         .send({ message: 'Error obteniendo información', success: false, error })
    }
})
router.get('/get-user-info-by-id', authenticationMiddleware, async(req,res)=>{
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined
        if(!user) {
            return res
                .status(200)
                .send({ message: 'No existe el usuario', success: true, data: user })
        } else {
            res
                .status(200)
                .send({ success: true, data: user})
        }

})
router.put('/update-user',  async(req, res) => {
    console.log('res',req.body);
    const { id, valueToUpdate } = req.body;

    try {
        const userToUpdate = await User.findByIdAndUpdate(id, valueToUpdate);
        console.log( 'us',userToUpdate);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'No se encontró el usuario para actualizar' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', user: userToUpdate });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar usuario' });
    }
});
router.post('/apply-employee-account', authenticationMiddleware, async (req, res) => {
    try {
        console.log('Datos recibidos en el servidor:', req.body);
        req.body.classes.forEach(cls => {
            console.log('Timings:', cls.timings);
        });

        const newEmployee = new Employee({ ...req.body, status: 'pendiente' });
        await newEmployee.save();

        const adminUser = await User.findOne({ isAdmin: true });

        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: 'new-employee-request',
            message: `${newEmployee.name} solicitó permiso para la cuenta de empleado`,
            data: {
                employeeId: newEmployee._id,
                name: newEmployee.name
            },
            onClickPath: '/admin/employees'
        });

        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
        res.status(200).send({ success: true, message: 'Cuenta de empleado solicitada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error solicitando la cuenta de empleado.', success: false, error });
    }
});
router.post('/mark-all-notifications-as-seen',authenticationMiddleware, async(req, res) => {
    try {
        const user = await User.findOne( {_id: req.body.userId})
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications= seenNotifications
        const updateUser = await user.save()
        updateUser.password = undefined;
        res.status(200).send({
            success: true, 
            message: "Todas las notificaciones leidas",
            data: updateUser,
        })

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: 'Error solicitando la cuenta de empleado.', success: false, error })
    }
});
router.post('/delete-all-notifications',authenticationMiddleware, async(req, res) => {
    try {
        const user = await User.findOne( {_id: req.body.userId})
        user.seenNotifications = []
        user.unseenNotifications = [];
        const updateUser = await user.save();
        updateUser.password = undefined;
        res.status(200).send({
            success: true, 
            message: "Todas las notificaciones borradas",
            data: updateUser,
        })

    } catch (error) {

        console.log(error);
        res
            .status(500)
            .send({ message: 'Error solicitando la cuenta de empleado.', success: false, error })
    }
});
router.get("/get-all-employees", authenticationMiddleware, async (req, res) => {
    try {
      const employees = await Employee.find({ status: "aprobado"});
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
router.get("appointment-booked", authenticationMiddleware, async (req,res)=>{
    
})
router.post("/book-appointment", authenticationMiddleware, async (req, res) => {
    try {
      const { employeeId, userId, classId, userInfo, employeeInfo } = req.body;
      const newAppointment = new Appointment({
        employeeId,
        userId,
        classId,
        employeeInfo,
        userInfo,
        status: "pendiente"
      });
      await newAppointment.save();
      const user = await User.findOne({ _id: employeeInfo.userId });
      user.unseenNotifications.push({
        type: "nuevo-turno-solicitado",
        message: `Un nuevo turno fue solicitado por ${userInfo.name}`,
        onClickPath: "/employee/appointments"
      });
      await user.save();
      res.status(200).send({
        message: 'Inscripción registrada correctamente',
        success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error solicitando la inscripción",
        success: false,
        error,
      });
    }
  });

  router.post("/check-booking-availability", authenticationMiddleware, async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(59, 'minutes').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(59, 'minutes').toISOString();
        const employeeId = req.body.employeeId
        const appointments = await Appointment.find({
            employeeId,
            date,
            time: { $gte: fromTime, $lte: toTime },
            status: 'aprobado'
        })
    if(appointments.length > 0){
        return res.status(200).send({
            message: 'El turno no esta disponible',
            success: false
        })
    }else{
        return res.status(200).send({
            message: 'El turno esta disponible',
            success: true
        })
    }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error solicitando el turno ",
        success: false,
        error,
      });
    }
  });
  router.get("/get-appointments-by-user-id", authenticationMiddleware, async (req, res) => {
    try {
      const appointments = await Appointment.find({userId: req.body.userId})
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



module.exports = router;

