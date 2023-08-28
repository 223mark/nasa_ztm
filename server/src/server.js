

const http = require('http');

// by keeping it top is making dotenv module pass through every other require module down the list so they don't need to require dotenv again
require('dotenv').config();

const app = require('./app');


const {loadPlanetData} = require('./models/plantes.model');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);


async function startServer() {
    await mongoConnect();
    
    // this to prevent to have data in ascyn action way
    await loadPlanetData();

    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`Listening on port:: ${PORT}`);
    })
    
}

startServer();

// by using this(using buit-in http server) allow us not only respond to https requests but also to other types of connections exp-(websockets,,,);
// in this, express is just middleware that we add on top of built-in http server