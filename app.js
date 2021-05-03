const express = require('express')
const app = express()

// mongoDB
const mongoose = require('mongoose')
const { MONGO_URI } = require('./config')

// swagger
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// routes
const schedulesRoutes = require('./routes/schedules')
const userRoutes = require('./routes/users')

//bodyParser middleware
app.use(express.json())

const port = process.env.PORT || 5000

// Connect MongoDB
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB connected'), err => console.log(err))

// https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Diniz API',
            description: 'Diniz API Information',
            contact: {
                name: 'Pedro Melo'
            },
            servers: ['http://localhost:5000']
        }
    },
    // ['routes/*.js']
    apis: ['routes/*.js']
}

/**
 * @swagger
 * tags:
 *   - name: Users
 *   - name: Schedules
 * 
*/


const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/', schedulesRoutes)
app.use('/', userRoutes)

app.listen(port, () => {
    console.log(`rodando server na porta ${port}`)
})