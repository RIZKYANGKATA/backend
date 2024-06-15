import express from 'express'
import db from '../config/Database.js'
import router from './routes/index.js'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const start = async function (a, b) {
  try {
    await db.authenticate()
    console.log('Database Connected')
  } catch (e) {
    console.log(e)
  }
}

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  credentials: true, // enable set cookie
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Set additional headers to handle preflight requests
app.options('*', cors(corsOptions))

// Route-specific CORS
app.use('/users', cors(corsOptions))

app.use(router)

start()

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`)
})

export default app
