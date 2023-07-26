const express = require('express')
const app = express()
const cors = require('cors')
const apiRouter = require('./server/routes')
const errorHandler = require('./server/middlewares/errorHandler')
//const swaggerSetup = require("./server/swagger");
const playerRouter = require("./server/routes/v1/player.routes");
const PORT = process.env.PORT || 4000

// middlewares
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(errorHandler)

const swaggerJson = require('./swagger.json')
const swaggerUi = require('swagger-ui-express')

/**
 * @Routes /api
 * entrypoint for all API routes
 */
app.use("/api", apiRouter)

// Use the playerRouter for your API routes
app.use("/api/v1/players", playerRouter);

app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerJson))


app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})