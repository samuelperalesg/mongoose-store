const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema ({
  name: {type: String, required: true},
  description: {type: String, required: true},
  img: {type: String, required: true},
  price: {type: Number, required: true},
  qty: {type: Number, required: true},
})

const Item = mongoose.model('Item', itemSchema)
module.exports  = Item