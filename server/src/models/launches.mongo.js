const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },

    mission: {
        type: String
    },
    rocket: {
        type: String
    },
    launchDate: {
        type: Date
    },
    target: {
        type: String,
        // ref: "Planet"
       
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        default: true
    },
    success: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model("Launch", launchesSchema);