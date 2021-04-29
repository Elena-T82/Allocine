const express = require('express')
const path = require('path') //on importe path qui est déjà installé avec node
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const helpers = require('handlebars-helpers')(['string']) //on veut juste charger les trucs des strings => plus léger
const bodyParser = require('body-parser') //permet de récupérer des données POST
require('dotenv').config() // permet les variables d'environnement

const PORT = process.env.PORT || 3000 //on choisi le port de notre serveur, soit un port défini dans une variable environnement, soit le port 3000

const ApiKey = process.env.API


const app = express() //on crée notre appli


// --------- MIDDLEWARE ------------

app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extensed: false }))




// ---------- NOS FONCTIONS -----------

// liste tous les films du moment par derniere date de sortie
const getAllMomentMovies = async() => {
    try {

        // On appelle l'api
        const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${ApiKey}&sort_by=popularity.desc`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

// liste tous les films
const getAllMovies = async() => {
    try {

        // On appelle l'api
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&page=1`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

// recherche un film (se produit au clic sur un film)
const getMovie = async(film = '460465') => {
    try {
        //on appelle l'api en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film}?api_key=${ApiKey}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}


// liste tous les films pour enfant
const getKidsMovies = async() => {

    try {
        //on appelle l'api en fonction des acteurs
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&primary_release_date.gte=2021-04-01&primary_release_date.lte=2021-04-02`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}




// ------- NOS ROUTES ----------

// on défini la page d'accueil -> dernier film
app.get('/', async(req, res) => {
    try {

        const films = await getAllMomentMovies()
        res.render('home', { films })

    } catch (err) {
        console.log(err)
    }

})

// on défini la page film -> tous les films
app.get('/films', async(req, res) => {
    try {

        const films = await getAllMovies()
        res.render('films', { films })

    } catch (err) {
        console.log(err)
    }

})

//on récupère un film précis
app.get('/fiche_film/:film', async(req, res) => {

    try {
        const search = req.params.film
        const film = await getMovie(search)

        res.render('fiche_film.hbs', { film })

    } catch (err) {
        console.log(err)
    }
})




// on défini la page film enfant -> tous les films enfants
app.get('/kidsmovies', async(req, res) => {
    try {

        const films = await getKidsMovies()
        res.render('kidsmovies', { films })

    } catch (err) {
        console.log(err)
    }

})


//on récupère un film pour enfant au clic
app.get('/fiche_kids/:film', async(req, res) => {

    try {
        const search = req.params.film
        const film = await getMovie(search)

        res.render('fiche_kids.hbs', { film })

    } catch (err) {
        console.log(err)
    }
})



// redirection en cas d'erreur 404
app.get('/notFound', (req, res) => {
    res.render('notFound')
})



// On ouvre le serveur
app.listen(PORT, () => console.log(`Le serveur est ouvert sur le port ${PORT}`))