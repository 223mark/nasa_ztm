
const mongoose = require('mongoose');
require('dotenv').config();



mongoose.connection.once('open', () => {
    console.log('Mongo Connection ready!')
})

mongoose.connection.on('error', (error) => {
    console.error(error);
})


async function mongoConnect() {
mongoose.connect(process.env.MONGO_URL);
  
}

async function mongoDisconnect() {
mongoose.disconnect(process.env.MONGO_URL);
  
}


module.exports = {
    mongoDisconnect,
    mongoConnect
};