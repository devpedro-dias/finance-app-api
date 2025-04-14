import 'dotenv/config.js'
import express from 'express'

const app = express()

app.use(express.json())

app.listen(procces.env.PORT, () => console.log('listening on port 8080'))
