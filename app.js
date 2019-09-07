// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./Restaurant_List.json')

// 載入 mongoose
const mongoose = require('mongoose')

// 設定連線到 mongoDB的restaurant
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true })
// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

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


app.get('/', (req, res) => {
  res.send('hello world!')
})
// 列出全部 Restaurant
app.get('/restaurant', (req, res) => {
  res.send('列出所有 Restaurant')
})
// 新增一筆 Restaurant 頁面
app.get('/restaurant/new', (req, res) => {
  res.send('新增 Restaurant 頁面')
})
// 顯示一筆 Restaurant 的詳細內容
app.get('/restaurant/:id', (req, res) => {
  res.send('顯示 Restaurant 的詳細內容')
})
// 新增一筆  Restaurant
app.post('/restaurant', (req, res) => {
  res.send('建立 Restaurant')
})
// 修改 Restaurant 頁面
app.get('/restaurant/:id/edit', (req, res) => {
  res.send('修改 Restaurant 頁面')
})
// 修改 Restaurant
app.post('/restaurant/:id/edit', (req, res) => {
  res.send('修改 Restaurant')
})
// 刪除 Restaurant
app.post('/restaurant/:id/delete', (req, res) => {
  res.send('刪除 Restaurant')
})

// app.get('/', (req, res) => {
//   res.render('index', { restaurants: restaurantList.results })
// })

// app.get('/restaurants/:restaurant_id', (req, res) => {
//   const focusRestaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)

//   res.render('show', { restaurants: focusRestaurant })
// })

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const matchRestaurant = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
//   })
//   if (matchRestaurant.length === 0) {
//     res.render('unmatch', { keyword: keyword })
//   } else {
//     res.render('index', { restaurants: matchRestaurant, keyword: keyword })
//   }

// })

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})