// require our dependencies
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const Item = require('./models/items')
const methodOverride = require("method-override")
const itemSeed = require('./models/itemSeed')

require('dotenv').config()

// initialize the express app
const app = express()

// configure server settings
app.use(morgan('dev'))

// establish a connection to MongoDB
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db
  .on('error', (err) => console.log(`${err.message} is mongo not running?`))
  .on('connected', () => console.log('mongo connected'))
  .on('disconnected', () => console.log('mongo disconnected'))

// mount middleware
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(methodOverride('_method'))

// mount our routes

// SEED
app.get('/items/seed', (req, res) => {
  Item.deleteMany({}, (err, allItems) => { })

  Item.create(itemSeed, (err, data) => {
    res.redirect('/items')
  })
})

// BUY
app.put('/items/:id/buy', (req, res) => {
  Item.updateOne({
    _id: req.params.id
  },
  {
    $inc: {'qty':-1}
  },
  (error, updatedItem) => {
    res.redirect(`/items/${req.params.id}`)
  })
})

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
app.put("/items/:id", (req, res) => {
  Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
          new: true,
      },
      (error, updatedItem)=>{
          res.redirect(`/items/${req.params.id}`)
      }
  )
})

// CREATE
app.post('/items', (req, res) => {
	Item.create(req.body, (err, createdItem) => {
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

// BUY



// tell the server to listen for requests from the client
app.listen(process.env.PORT, () => console.log(`server is listening on port: ${process.env.PORT}`))