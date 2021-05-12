const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SchedulesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Schedules', SchedulesSchema)