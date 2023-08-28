const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const api = require('./routes/api');

const app = express();



// using cors middleware
app.use(cors({
    origin: 'http://localhost:3000',
    // origin: 'http://localhost:3001',
}));


// for server logs
app.use(morgan('combined'))


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')))


app.use('/v1', api);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// app.use('/v1', api);
// app.use('/v2',v2router);

// we use ('/*') to get express'matching capability and matches everything follow the '/'
// pass to frontend and react and handle routing itself

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// })

module.exports = app;