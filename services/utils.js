//jwt
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function generateJwt(user){
    return jwt.sign(user, process.env.TOKEN_SECRET)
}   

function authJwt(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(400)
    
        req.user = user

        next()
    })
}

function adminJwt(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (!user.admin) return res.sendStatus(401)
    
        req.user = user

        next()
    })
}

module.exports = {
    generateJwt, 
    authJwt,
    adminJwt
}