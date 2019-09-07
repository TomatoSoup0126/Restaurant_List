const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

//首頁
router.get('/', (req, res) => {
  sortObject = {}
  sortObject[req.query.ref] = req.query.sort
  Restaurant.find({})
    .sort(sortObject)
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      return res.render('index', { restaurants: restaurants })
    })
})


router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    const matchRestaurant = restaurants.filter(restaurant => {
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
    })

    if (matchRestaurant.length === 0) {
      res.render('unmatch', { keyword: keyword })
    } else {
      res.render('index', { restaurants: matchRestaurant, keyword: keyword })
    }
  })
})

module.exports = router