const express = require('express')
const router = express.Router()
const utils = require('../services/utils')
const moment = require('moment')

// schedules Model
const Schedules = require('../models/Schedules')


// Routes
/**
 * @swagger
 * /schedule:
 *  post:
 *      tags: 
 *      - Schedules
 *      description: Create new schedule
 *      summary: Create new schedule
 *      consumes:
 *        - application/json
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *          schema:
 *            required:
 *              - title
 *              - body
 *              - date
 *            properties:
 *              title:
 *                type: string
 *              body:
 *                type: string
 *              date:
 *                type: string
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
router.post('/schedule', utils.adminJwt, async (req, res) => { 
    const newSchedule = new Schedules(req.body)
    const validDate = moment(newSchedule.date, "DD/MM/YYYY").isSameOrAfter() 
    if(!validDate){
        return res.status(400).send({error: 'Invalid date'})
    }
    try {
        const schedule = await newSchedule.save()
        if(!schedule) throw Error('Error creating a schedule.')        
        res.status(200).json(schedule)
    } catch (err) {
        res.status(400).json({msg: err})
    }
})

/**
 * @swagger
 * /schedules:
 *  get:
 *      tags: 
 *      - Schedules
 *      description: Get all schedules
 *      summary: Get all schedules
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.get('/schedules', async (req, res) => { 
    try {
        const schedules = await Schedules.find()
        if(!schedules) throw Error('Error to get all schedules.')        
        res.status(200).json(schedules)
    } catch (err) {
        res.status(400).json({msg: err})        
    }
})

/**
 * @swagger
 * /schedule/{id}:
 *  delete:
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema: 
 *              type: string
 *          description: The schedule id
 *      tags: 
 *      - Schedules
 *      description: Delete schedule
 *      summary: Delete schedule
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.delete('/schedule/:id', async (req, res) => { 
     try {
        const schedule = await Schedules.findByIdAndDelete(req.params.id)
        if(!schedule) throw Error('Post not found.')       
        res.status(200).json({success: true})                 
     } catch (err) {
        res.status(400).json({msg: err})                
     }
})

/**
 * @swagger
 * /schedule/{id}:
 *  put:
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema: 
 *              type: string
 *          description: The schedule id
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                required:
 *                  - title
 *                  - body
 *                properties:
 *                  title:
 *                    type: string
 *                  body:
 *                    type: string
 *                  date:
 *                    type: string
 *      tags: 
 *      - Schedules
 *      description: Edit schedule
 *      summary: Edit schedule
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
router.put('/schedule/:id', async (req, res) => {
    try {
       const schedule = await Schedules.findByIdAndUpdate(req.params.id, req.body)
       if(!schedule) throw Error('Error to update schedule.')       
       res.status(200).json({success: true})                 
    } catch (err) {
       res.status(400).json({msg: err})                
    }
})

/**
 * @swagger
 * /schedule/{id}:
 *  get:
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema: 
 *              type: string
 *          description: The schedule id
 *      tags: 
 *      - Schedules
 *      description: Get schedule by id
 *      summary: Get schedule by id
 *      responses: 
 *          '200':
 *              description: 'Success response'
 */
 router.get('/schedule/:id', async (req, res) => { 
     try {
        const schedule = await Schedules.findById(req.params.id)
        if(!schedule) throw Error('Post not found.')       
        res.status(200).json(schedule)                 
     } catch (err) {
        res.status(400).json({msg: err})                
     }
})

module.exports = router