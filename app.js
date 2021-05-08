const express = require('express')
const cors = require('cors')
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

//bodyParser/cors middleware
app.use(express.json())
app.use(cors());

const port = process.env.PORT || 5000

// Connect MongoDB
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('MongoDB connected'), err => console.log(err))

// https://swagger.io/specification/#infoObject
const swaggerOptions = {
    definition: {  
        openapi: '3.0.1',  
        info: {            
            swagger: '2.0',
            version: "1.0.0",
            title: "Diniz API",
            description: "Rest API to control Diniz Barber Shop",
            contact: {
                name: "Pedro Melo",
                url: "https://github.com/blzpedro",
                email: "phenriqmelo99@gmail.com",
            },
            servers: ['http://localhost:5000', 'https://diniz-api.herokuapp.com/']
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                },
            }
        },
        security: [{ 
            bearerAuth: [] 
        }],
    },
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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.listen(port, () => {
    console.log(`rodando server na porta ${port}`)
})
