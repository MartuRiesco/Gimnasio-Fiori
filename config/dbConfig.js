const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://riescomartina3:OdaWOpZNy70WcGd9@cluster0.kvhznvv.mongodb.net/turnos'

);

const connection = mongoose.connection;


connection.on('connected', () => { 
    console.log('Database connected d');
});

connection.on('error', (error) => {
    console.log('Error in MongoDb connection', error);
});

module.exports = mongoose;