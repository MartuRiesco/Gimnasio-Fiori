const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Employee = require('../models/employeeModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');

const moment = require('moment');

router.post('/register', async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(200).send({ message: 'Usuario ya registrado.', success: false });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
    console.log('res', req.body);
        req.body.pago = req.body.pago || false;

        const newUser = new User(req.body);
        await newUser.save();

        if (req.body.isEmployee) {
            const newEmployee = new Employee({
                userId: newUser._id,
                name: newUser.name,
                email: newUser.email,
                classes: req.body.classes || [],
                status: req.body.status || 'pendiente'
            });
            await newEmployee.save();
        }

        res.status(200).send({ message: 'Usuario creado exitosamente!', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error creando al usuario.', success: false, error });
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
router.get('/get-user-info-by-id/:userId', authenticationMiddleware, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-password'); // Excluir el campo de la contraseña
        if (!user) {
            return res.status(404).send({ message: 'No existe el usuario', success: false });
        }
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ message: 'Error obteniendo la información del usuario', success: false, error });
    }
});
router.put('/update-user', authenticationMiddleware, async (req, res) => {
    const { id, valueToUpdate } = req.body;
    try {        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'No existe el usuario', success: false });
        }
        if (valueToUpdate.pago) {
            if (!valueToUpdate.fechaPago || !valueToUpdate.monto) {
                return res.status(400).send({ message: 'Debe proporcionar fecha de pago e importe cuando pago es verdadero', success: false });
            }
            user.fechaPago = valueToUpdate.fechaPago;
            user.monto = valueToUpdate.monto;
        } else {
            user.fechaPago = undefined;
            user.monto = undefined;
        }

    
        user.name = valueToUpdate.name || user.name;
        user.email = valueToUpdate.email || user.email;
        user.phone = valueToUpdate.phone || user.phone;
        user.observaciones = valueToUpdate.observaciones || user.observaciones;
        user.pago = valueToUpdate.pago;
        await user.save();

        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ message: 'Error actualizando la información del usuario', success: false, error });
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




module.exports = router;

