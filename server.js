const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
app.use(express.json());
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const employeeRoute = require('./routes/employeeRoute')
app.use((error, req, res, next) => {
    const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
    res.status(500).json({ status: 'error', message });
  });
 app.use((req, res, next) => {
    // Configura los encabezados CORS para permitir todas las solicitudes de cualquier origen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}); 

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/employee', employeeRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port: ${port}`));