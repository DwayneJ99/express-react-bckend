///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables

require("dotenv").config()
// pull PORT from .env, give default value of 3000 if not PORT exists
const {DATABASE_URL, PORT = 3000} = process.env
// import express
const express = require('express')
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middlware
const cors = require("cors")
const morgan = require("morgan")


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })

// Connection Events
mongoose.connection.on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

  ///////////////////////////////
// MODELS
////////////////////////////////

const PeopleSchema = new mongoose.Schema ({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model('People', PeopleSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route

app.get('/', (req,res)=>{
    res.send('hello world!')
})

// PEOPLE INDEX ROUTE

app.get('/people', async (req, res)=>{
    try {
         // send all people
        res.json(await People.find({}))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

// GET - PEOPLE SHOW

app.get('/people/:id', async (req,res) => {
    try{
        res.json(await People.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// POST - PEOPLE CREATE ROUTE

app.post('/people', async (req,res)=>{
    try {
        //send all people
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// PUT - PEOPLE Update ROUTE

app.put('/people/:id', async (req, res)=> {
    try {
        res.json (
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

// DELETE - PEOPLE Destroy ROUTE

app.delete('/people/:id' , async (req, res)=> {
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


///////////////////////////////
// LISTENER
////////////////////////////////

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))