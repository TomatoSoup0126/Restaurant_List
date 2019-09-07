const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantSeedList = require('../../Restaurant_list.json')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')
  for (let i = 0; i < restaurantSeedList.results.length; i++) {
    const item = restaurantSeedList.results[i];
    Restaurant.create(item)
  }

  console.log('done')
})
