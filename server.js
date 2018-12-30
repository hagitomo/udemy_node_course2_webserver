const express = require('express')
const fs = require('fs')
const hbs = require('hbs')

const port = process.env.PORT || 3000 // herokuではPORTを取得, localでは存在しない
var app = express()


// hbs 設定
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials') // hbs include指定
hbs.registerHelper('getCurrentYear', () => { // hbs helper関数
  return new Date().getFullYear()
})

// // メンテナンスモード
// // アクセスしてもメンテナンス画面が表示, next()を実施していないので、次の処理に行かない
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

// 静的配信
app.use(express.static(__dirname + '/public'))

// ルーター
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'HOME page',
    welcomeMsg: 'welcome to my home page'
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMsg: 'unable to handle request'
  })
})

// logger
app.use((req, res, next) => {
  var now = new Date().toString()
  var log = `${now}: ${req.method} ${req.url}`
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('unable to append to server.log')
    }
  })
  next()
})

app.listen(port, () => {
  console.log( `server is up on ${port} ......`)
})
