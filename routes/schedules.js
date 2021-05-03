const express = require('express')
const router = express.Router()

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
 *      parameters:
 *        - in: body
 *          name: postDto
 *          required: 
 *              - postDto
 *          schema:
 *            required:
 *              - title
 *              - body
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
router.post('/schedule', async (req, res) => { 
    const newSchedule = new Schedules(req.body)
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
 *        - in: body
 *          name: scheduleDto
 *          required: 
 *              - scheduleDto
 *          description: The schedule to create.
 *          schema:
 *            required:
 *              - title
 *              - body
 *            properties:
 *              title:
 *                type: string
 *              body:
 *                type: string
 *              date:
 *                type: string
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