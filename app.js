//Importing modules
const express = require('express')
require('./db/userDB')
require('dotenv').config()
const usersRouter = require('./routes/user')
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
const app = express()

//static files
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

// middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.use(usersRouter)

app.get('/', (req, res) => {
    res.send('home')
})

// port no
const port = process.env.PORT
console.log(port)
//run port
app.listen(port, ()=> {
    console.log('Server run on port: '+ port)
})
