const express = require('express') //on importe express
const path = require('path') //on importe path qui est inclu avec node
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const helpers = require('handlebars-helpers')(['string']) //on veut juste charger les trucs des strings => plus léger
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000 //on choisi le port de notre serveur, soit un port défini dans une variable environnement, soit le port 3000

const app = express() //on crée notre appli

// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extensed: false }))


// on défini la page d'accueil
app.get('/', (req, res) => {
    res.render('home')
})


// redirection en cas d'erreur 404
app.get('/notFound', (req, res) => {
    res.render('notFound')
})




app.listen(PORT, () => console.log(`Le serveur est ouvert sur le port ${PORT}`))