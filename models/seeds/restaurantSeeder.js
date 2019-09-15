const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Restaurant = require('../restaurant')
const User = require('../user')

const restaurantSeedList = require('./Restaurant_list.json')
const userSeedList = require('./User_list.json')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')
  for (let i = 0; i < userSeedList.results.length; i++) {
    const newUser = new User({
      name: userSeedList.results[i].name,
      email: userSeedList.results[i].email,
      password: userSeedList.results[i].password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash

        newUser.save().then(users => {
          console.log(users)
          for (var j = i * 3; j < (i * 3) + 3; j++) {
            Restaurant.create({
              userId: users._id,
              name: restaurantSeedList.results[j].name,
              name_en: restaurantSeedList.results[j].name_en,
              category: restaurantSeedList.results[j].category,
              image: restaurantSeedList.results[j].image,
              location: restaurantSeedList.results[j].location,
              phone: restaurantSeedList.results[j].phone,
              google_map: restaurantSeedList.results[j].google_map,
              rating: restaurantSeedList.results[j].rating,
              description: restaurantSeedList.results[j].description
            })

          }
        }).catch(err => {
          console.log(err)
        })
      })
    })

  }
  console.log('Created seed!')
})

