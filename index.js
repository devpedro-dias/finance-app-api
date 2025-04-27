import 'dotenv/config.js'
import express from 'express'

export const app = express()

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
