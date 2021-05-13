const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchedulesSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Schedules', SchedulesSchema)