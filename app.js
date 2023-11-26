const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const flash = require('connect-flash');

require('dotenv').config()
require('./server/models/database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieparser('CookingBlogSecure'))
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}))
app.use(flash())
app.use(fileUpload())

app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes)

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})
