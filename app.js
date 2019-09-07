// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')
const Handlebars = require("handlebars")


// 載入 mongoose
const mongoose = require('mongoose')
// 引用 body-parser
const bodyParser = require('body-parser');
// 引用 method-override
const methodOverride = require('method-override')


// 設定連線到 mongoDB的restaurant
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
// 設定 method-override
app.use(methodOverride('_method'))

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

//自定義helper
Handlebars.registerHelper('if_equal', function (item, expectedItem, options) {
  if (item === expectedItem) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// routes setting
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//載入restaurant model
const Restaurant = require('./models/restaurant')

//首頁
app.get('/', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants: restaurants })
  })
})


// 列出全部 Restaurant
app.get('/restaurants', (req, res) => {
  return res.redirect('/')
})

// 新增一筆 Restaurant 頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 顯示一筆 Restaurant 的詳細內容
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurants) => {
    if (err) return console.error(err)
    return res.render('show', { restaurants: restaurants })
  })
})


// 新增一筆  Restaurant
app.post('/restaurants', (req, res) => {
  // 建立 restaurant model 實例
  const restaurant = new Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })

  //存入資料庫
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')  // 新增完成後，將使用者導回首頁
  })

})


// 修改 Restaurant 頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurants) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurants: restaurants })
  })
})



// 修改 Restaurant
app.put('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// 刪除 Restaurant
app.delete('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

//改寫搜尋路由
app.get('/search', (req, res) => {
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

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})