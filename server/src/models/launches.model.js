const axios = require('axios');
const launchesDB = require('./launches.mongo');
const planets = require('./plantes.mongo')


const DEFAULT_FLIGHT_NUMBER = 100;

// #exmaple demo data
// const launch = {
//     flightNumber: 100, //flight_number
//     mission: 'Kepler Exploration X', //name
//     rocket: 'Exploer IS1',// rocket name
//     launchDate: new Date('December 27, 2030'), //date_local
//     target: 'Kepler-442 b',//not applicale
//     customers: ['NASA', 'ZTM'],//payload.customers for each payload
//     upcoming: true,
//     success: true,
// }
// saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

// from spaceX api
async function populateLaunches() {
    const res = await axios.post(SPACEX_API_URL, {
        query: {},
       options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name:1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers':1
                    }
                }
            ]
        }
    });
    // check spaceX api ok or not
    if (res.status != 200) {
        console.log('Problems downloading launch data');
        throw new Error('Launch Data Download Fail.')
    }
    
    // api data return with docs
    const launchDocs = res.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);
        
        // save to db
        await saveLaunch(launch);
}
}

async function loadLaunchData() {

   const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
   })
    
    if (firstLaunch) {
        console.log('Launch data already loaded');
        
    } else {
       await populateLaunches();
    }
    
   
};

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({flightNumber: launchId});
}

async function getAllLaunches(skip,limit) {
    // launches.values give us list of itreable value in our map get from  set
    // Array.from () change value into array format

    const launches =await launchesDB
        .find({}, { '_id': 0, '__v': 0 })
        // -1 for decending value and 1 is for ascending value for sorting
        .sort({filghtNumber: 1})
        .skip(skip)
        .limit(limit);
    
    // sec pram is called projection argu
    return res.status(200).json(launches) 
}

async function getLatestFlightNumber() {
    // getting latest flight number from db
    const latestLaunch = await launchesDB.findOne({}).sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;

}


// save to db
async function saveLaunch(launch) {
    
    
    // no updateOne
    await launchesDB.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
      upsert: true
  })
    // await launchesDB.create(launch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         flightNumber: latestFlightNumber,
//         success: true,
//         upcoming: true,
//         customers: ['Zero to Mastery', 'NASA']
//     }));
    
// }

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        // Error is node's built-in error class
        throw new Error('No matching planet found');
    }

    const newFilghtNumber = await getLatestFlightNumber() +1
    const newLaunch = Object.assign(launch, {
        success: true,
        launchDate: launch.launchDate,
        upcoming: true,
       customers: ['Zero to Mastery', 'NASA'],
       flightNumber: newFilghtNumber
    })
    console.log(newLaunch ,'n');
    
     await saveLaunch(newLaunch);

}



async function abortLaunchById(launchId) {
    const aborted = await launchesDB.findOneAndUpdate({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount ===1
    
}

module.exports = {
     loadLaunchData,
    getAllLaunches,
    // addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
   
}