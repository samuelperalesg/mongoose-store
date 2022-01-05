// require our dependencies
const express = require("express")
require('dotenv').config()
const morgan = require("morgan")
const mongoose = require("mongoose")
const PORT = process.env.PORT
const Item = require('./models/items')
const methodOverride = require("method-override")

// initialize the express app
const app = express()

// configure server settings
app.use(morgan('dev'))

// establish a connection to MongoDB
const db = mongoose.connection
mongoose.connect(process.env.DATABASE_URL)

db.on('error', (err) => console.log(`${err.message} is mongo not running?`))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

// mount middleware
app.use(express.urlencoded({ extended: true }))

// mount our routes

// INDEX
app.get('/items', (req, res) => {
  Item.find({}, (err, allItems) => {
    res.render('index.ejs', {
      items: allItems
    })
  })
})

// NEW
app.get('/items/new', (req, res) => {
  res.render('new.ejs')
})

// DELETE
app.delete('/items/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err, data) => {
    res.redirect('/items')
  })
})

// UPDATE
app.put('/items/:id', (req, res) => {
  Item.findOneAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
    (err, updatedItem) => {
      res.redirect(`/items/${req.params.id}`)
    }
  )
})

// CREATE
app.post('/items', (req, res) => {
	Item.create(req.body, (error, createdItem) => {
    res.redirect('/items');
  });
});

// EDIT
app.get('/items/:id/edit', (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    res.render("edit.ejs", {
      item: foundItem,
    })
  })
})

// SHOW
app.get('/items/:id', (req, res) => {
	Item.findById(req.params.id, (err, foundItem) => {
		res.render('show.ejs', {
			item: foundItem, 
		});
	});
});

// tell the server to listen for requests from the client
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`))