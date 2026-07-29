import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server is started on http://localhost:" + PORT))