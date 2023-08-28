const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

const completeLaunchData = {
        mission: 'US Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
        launchDate: 'January 4, 2028'
}
 
const completeLaunchDataWithoutDate = {
        mission: 'US Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
}
 
const launchDataWithUnvaildDate = {
      mission: 'US Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'zoot'
}

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    })
    
// create a test fixture with different test cases by using this describe function
describe("Test GET /launches", () => {
    // name of our test
    test("It should respond with 200 success", async () => {
        // supertest is doing just like axios or js fetch fun
        const res = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
        // we expect res to be 200 -> to success

        // expect(res.statusCode).toBe(200); <- this is longer way
    })
})


describe("Test POST /launches", () => {
    test('It should respond with 201 create', async () => {
        const res = await request(app)
            // these are supertest's assertion
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
        
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const resDate = new Date(res.body.launchDate).valueOf();

        // comparing  res and req date

        expect(resDate).toBe(requestDate);

        // jest's assertion
        expect(res.body).toMatchObject(completeLaunchDataWithoutDate)
    })

    test('It should catch missing required properites', async() => { 
        const res = await request(app)
            .post('/v1/launches')
            .send(completeLaunchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
        // jest's assertion
        // toStriceEqual() match the exact value of object
        expect(res.body).toStrictEqual({
            error: "Missing required launch property"
        })
    });

    test('It should catch invalid dates', async () => { 
        const res = await request(app)
            .post('/v1/launches')
            .send(launchDataWithUnvaildDate)
            .expect('Content-Type', /json/)
            .expect(400);
        // jest's assertion
        // toStriceEqual() match the exact value of object
        expect(res.body).toStrictEqual({
            error: "Invalid launch date"
        })
    });
})

})




// describe() , test(), expect() arein't built-in js funs it is jest's  know where to find them in it's own module when we run jest 