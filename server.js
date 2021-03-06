const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
require('dotenv').config()
const app = express()


const uri = process.env.URI
console.log(uri);
mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})



app.get('/delete/:id', async (req, res) => {
  await ShortUrl.findByIdAndDelete(req.params.id)
  res.redirect('/');

})

app.listen(process.env.PORT || 5000);
console.log("Server started on port 5000");