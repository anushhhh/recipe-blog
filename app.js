const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('dotenv').config()
require('./server/models/database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(expressLayouts)

app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes)

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})