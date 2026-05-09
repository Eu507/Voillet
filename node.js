//variaveis
const express = require('express')
const PORT = process.env.PORT || 3000
const app = express()

console.log("Server is listening in " + PORT)
//set and use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/Style'))
app.use(express.static(__dirname + '/Script'))
app.use(express.static(__dirname + '/Imagens'))
app.set('view engine', 'ejs')

//routes
const userRoutes = require('./routes.js')
userRoutes(app)

app.listen(PORT)