const express = require('express')
const bcrypt = require("bcrypt");
const router = express.Router()

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
 router.get('/all-users', async (req, res) => { 
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
 *      parameters:
 *        - in: body
 *          name: userDto
 *          required: 
 *              - userDto
 *          schema:
 *            required:
 *              - user
 *              - password
 *            properties:
 *              user:
 *                type: string
 *              password:
 *                type: string
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.post('/signup', async (req, res) => { 
    const body = req.body
    if(!(body.user && body.password)){
        return res.status(400).send({error: 'Invalid body'})
    }

    const user = new User(body)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save().then((doc) => res.status(200).send(doc))
})

/**
 * @swagger
 * /login:
 *  post:
 *      tags: 
 *      - Users
 *      description: Login with user
 *      summary: Login with user
 *      parameters:
 *        - in: body
 *          name: userDto
 *          required: 
 *              - userDto
 *          schema:
 *            required:
 *              - user
 *              - password
 *            properties:
 *              user:
 *                type: string
 *              password:
 *                type: string
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
router.post('/login', async (req, res) => {
    const body = req.body
    const user = await User.findOne({email: body.email})
    if(user){
        const validPassword = await bcrypt.compare(body.password, user.password)
        validPassword ? res.status(200).json({success: true}) : res.status(400).json({error: 'Invalid password'})
    } else {
        res.status(401).json({error: 'User not found'})
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
 router.delete('/user/:id', async (req, res) => { 
    try {
       const user = await User.findByIdAndDelete(req.params.id)
       if(!user) throw Error('User not found.')       
       res.status(200).json({success: true})                 
    } catch (err) {
       res.status(400).json({msg: err})                
    }
})

module.exports = router