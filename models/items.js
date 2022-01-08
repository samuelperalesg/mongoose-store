const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema ({
  name: {type: String, required: true},
  description: {type: String},
  img: {type: String},
  price: {type: String},
  qty: {type: Number, },
})

const Item = mongoose.model('Item', itemSchema)
module.exports  = Item