const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI

);

const connection = mongoose.connection;


connection.on('connected', () => { 
    console.log('Database connected d');
});

connection.on('error', (error) => {
    console.log('Error in MongoDb connection', error);
});

module.exports = mongoose;