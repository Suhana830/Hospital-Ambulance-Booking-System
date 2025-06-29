const { Schema, model } = require("mongoose")

const journeySchema = new Schema({
    RiderId: {
        type: String,
        require: true
    },
    DriderId: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    RiderLatitude: {
        type: String,
        require: true,
    },
    RiderLongitude: {
        type: String,
        require: true,
    },
    AmbulanceNumber: {
        type: String,
        require: true
    },
    HospitalLatitude: {
        type: String,
        require: true,
    },
    HospitalLongitude: {
        type: String,
        require: true,
    },
    startTime: {
        type: String,

    },
    endTime: {
        type: String
    }


}, { timestamps: true });



const journey = new model("journey", journeySchema);

module.exports = journey;