// require our dependencies
const express = require("express")
require("dotenv").config()
const morgan = require("morgan")
const mongoose = require("mongoose")
const PORT = process.env.PORT

// initialize the express app
const app = express()

// configure server settings
app.set("view engine", "ejs")
app.use(morgan('dev'))

// establish a connection to MongoDB
const db = mongoose.connection
mongoose.connect(process.env.DATABSE_URL)

db.on('error', (err) => console.log(`${err.message} is mongo not running?`))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

// mount middleware
app.use(express.urlencoded({ extended: true }))

// mount our routes

// INDEX
app.get('/mongoose', (req, res) => {
  Mongoose.find({}, (err, allMongoose) => {
    res.render('index', {
      mongoose: allMongoose
    })
  })
})

// NEW
app.get('mongoose/new', (req, res) => {
  res.render('new')
})

// DELETE
app.delete('/mongoose/:_id', (req, res) => {
  mongoose.splice(req.params._id, 1)
  res.redirect('/mongoose')
})

// UPDATE
app.put('/mongoose/:_id', (req, res) => {
  mongoose[req.params._id] = req.body
  res.redirect('/mongoose')
})

// CREATE
app.post('/mongoose', (req, res) => {
  mongoose.unshift(req.body)
  res.redirect('/mongoose')
})

// EDIT
app.get('/mongoose/:_id/edit', (req, res) => {
  res.render('edit', {
    singleMongoose: mongoose[req.params._id],
    index: req.params._id
  })
})

// SHOW
app.get('/mongoose/:_id', (req, res) => {
  res.render('show', { 
    singleMongoose: mongoose[req.params._id], 
    // name: `${mongoose[req.params._id].name}`
  });
});

// tell the server to listen for requests from the client
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`))