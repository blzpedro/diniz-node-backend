const express = require('express')
const bcrypt = require("bcrypt");
const router = express.Router()

//validators
const moment = require('moment')
const emailValidator = require("email-validator");
const { cpf } = require("cpf-cnpj-validator")
const cpfValidator = cpf

const utils = require('../services/utils')

// posts Model
const User = require('../models/User')

// Routes
/**
 * @swagger
 * /all-users:
 *  get:
 *      tags: 
 *      - Users
 *      description: Use to request all users
 *      summary: Get all users
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.get('/all-users', utils.adminJwt, async (req, res) => { 
    try {
        const users = await User.find()
        if(!users) throw Error('Error to get all users.')        
        res.status(200).json(users)
    } catch (err) {
        res.status(400).json({msg: err})        
    }
})

/**
 * @swagger
 * /signup:
 *  post:
 *      tags: 
 *      - Users
 *      description: Create new account
 *      summary: Create new account
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  email:
 *                    type: string
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
 *                  birthdate:
 *                    type: string
 *                  cpf:
 *                    type: string
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.post('/signup', async (req, res) => { 
    const body = req.body
    const { name, email, username, password, birthdate, cpf, admin = false } = body
    const validBirthdate = moment(birthdate, "DD/MM/YYYY").isValid()
    const validEmail = emailValidator.validate(email)
    const validCpf = cpfValidator.isValid(cpf)
    if(!(name && email && username && password && birthdate && cpf)){
        return res.status(400).send({error: 'Invalid body'})
    }
    if(!validBirthdate){
        return res.status(400).send({error: 'Invalid birthdate'})
    }
    if(!validEmail){
        return res.status(400).send({error: 'Invalid email'})
    }
    // if(!validCpf){
    //     return res.status(400).send({error: 'Invalid cpf'})
    // }
    
    const hasEmail = await User.findOne({email: email})
    const hasCPF = await User.findOne({cpf: cpf})
    if(hasEmail || hasCPF){
        return res.status(400).send({error: 'User already exists'})
    }

    const token = utils.generateJwt({...body, admin})
    const newBody = {...body, token}
    const user = new User(newBody)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save().then((doc) => res.status(200).json({success: true}))
})

/**
 * @swagger
 * /login:
 *  post:
 *      tags: 
 *      - Users
 *      description: Login with user
 *      summary: Login with user
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                required:
 *                  - username
 *                  - password
 *                properties:
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
router.post('/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({username: body.username})
    if(user){
        const validPassword = await bcrypt.compare(body.password, user.password)
        validPassword ? res.status(200).json({token: user.token}) : res.status(400).json({error: 'Invalid password'})
    } else {
        res.status(404).json({error: 'User not found'})
    }
})

/**
 * @swagger
 * /user/{id}:
 *  delete:
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema: 
 *              type: string
 *          description: The user id
 *      tags: 
 *      - Users
 *      description: Delete user
 *      summary: Delete user
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.delete('/user/:id', utils.adminJwt, async (req, res) => { 
    try {
       const user = await User.findByIdAndDelete(req.params.id)
       if(!user) throw Error('User not found.')       
       res.status(200).json({success: true})                 
    } catch (err) {
       res.status(400).json({msg: err})                
    }
})

module.exports = router