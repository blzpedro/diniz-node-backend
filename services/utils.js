//jwt
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function generateJwt(user){
    return jwt.sign(user, process.env.TOKEN_SECRET)
}   

function authJwt(token, res) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)    
        if (user) return user
    })
}

module.exports = {
    generateJwt, 
    authJwt
}