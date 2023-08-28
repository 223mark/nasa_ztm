
const {parse} = require('csv-parse');
const path = require('path');
const fs = require('fs');

const Planet = require('./plantes.mongo');


function isHabitablePlanets(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../', '../', 'data/', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,

        }))
        .on('data', async (data) => {
            if (isHabitablePlanets(data)) {
                savePlanet(data)
            }
            
        })
        .on('error', ((error) => {
            console.log(error);
            reject(error);
        }))
          .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`${countPlanetsFound} hasbitable planets found.`);
            resolve();
        });
  }) 
 
}

async function getAllPlanets() {
    return await Planet.find({},
        //projection{} -> exclude _id and __v  
        {
        '_id':0, '__v': 0
    });
}

async function savePlanet(planet) {
    try {
        // insert + update = upsert 
        await Planet.updateOne({
            // findone and save it
            keplerName: planet.kepler_name
        }, {
            // if find fail save it
            keplerName: planet.kepler_name
        }, {
            // add if not already exsit in db
            upsert: true
        });
    } catch (err) {
        console.error(`Could not save planet: ${err}`)
    }
}

module.exports = {
    getAllPlanets,
    loadPlanetData
}