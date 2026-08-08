import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import photoRoutes from "./routes/photoRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import photoshootRoutes from "./routes/photoshootRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017' // edit

mongoose
.connect(MONGO_URI)
.then(() => console.log('Mongo is running!'))
.catch((err) => {
    console.log('Error: ' + err)
    process.exit(1)
})

const app = express()
app.use(express.json())

app.use('/api/photos', photoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/photoshoots', photoshootRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server is started on http://localhost:" + PORT))