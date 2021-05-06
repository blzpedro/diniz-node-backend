const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema  = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)