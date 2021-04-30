const express = require('express')
const path = require('path') //on importe path qui est déjà installé avec node
const exphbs = require('express-handlebars')
const fetch = require('node-fetch')
const helpers = require('handlebars-helpers')(['string']) //on veut juste charger les trucs des strings => plus léger
const bodyParser = require('body-parser') //permet de récupérer des données POST
require('dotenv').config() // permet les variables d'environnement

const PORT = process.env.PORT || 3000 //on choisi le port de notre serveur, soit un port défini dans une variable environnement, soit le port 3000

const ApiKey = process.env.API
const language = process.env.LANGUAGE


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
        const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${ApiKey}&sort_by=popularity.desc&language=${language}`)

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
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&page=1&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

// recherche un film (se produit au clic sur un film)
const getMovie = async(film = '460465') => {
    try {
        //on appelle les données en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film}?api_key=${ApiKey}&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

// recherche les recommandations par rapport à un film
const getRecommendations = async(film = '460465') => {
    try {
        //on appelle les données en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film}/recommendations?api_key=${ApiKey}&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

const getActeurs = async(film = '460465') => {
    try {
        //on appelle les acteurs en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film}/credits?api_key=${ApiKey}&&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

const getBandeAnnonce = async(film = '460465') => {
    try {
        //on appelle la bande annonce en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/movie/${film}}/videos?api_key=${ApiKey}&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

const getActeur = async(acteur = '287') => {
    try {
        //on appelle les acteurs en fonction du film recherché
        const res = await fetch(`https://api.themoviedb.org/3/person/${acteur}?api_key=${ApiKey}&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}


const recupImage = async(film = '460465') => {
    try {
        //on appelle l'api en fonction du film recherché
        let url = `https://api.themoviedb.org/3/movie/${film}/images?api_key=${ApiKey}`

        const res = await fetch(url)

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
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${ApiKey}&with_genres=16&language=${language}`)

        const json = await res.json()

        return json

    } catch (err) {
        console.log(err)
    }
}

// methode de recherche
const getSearchMovies = async(search) => {

    try {
        //on appelle l'api en fonction des acteurs
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${ApiKey}&query=${search}&page=1&language=${language}`)

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
        const recommendations = await getRecommendations(search)
        const acteurs = await getActeurs(search)
        const ba = await getBandeAnnonce(search)

        const img = await recupImage(search)
        const imgURL = img.posters[0].file_path

        const compagnie = film.production_companies
        const genres = film.genres

        const acteur = acteurs.cast
        const bandeAnnonce = ba.results[0].key

        if (bandeAnnonce) {

            res.render('fiche_film', { film, imgURL, compagnie, genres, acteur, recommendations, bandeAnnonce })
        } else {
            res.render('fiche_film', { film, imgURL, compagnie, genres, acteur, recommendations })
        }


    } catch (err) {
        console.log(err)
    }
})


//on récupère un acteur précis
app.get('/fiche_acteur/:acteur', async(req, res) => {

    try {
        const search = req.params.acteur
        const acteur = await getActeur(search)

        const filmsActeur = acteur.also_know_as

        res.render('fiche_acteur', { acteur, filmsActeur })


    } catch (err) {
        console.log(err)
    }
})




// on défini la page film enfant -> tous les films enfants
app.get('/kids', async(req, res) => {
    try {

        const films = await getKidsMovies()

        res.render('films', { films })

    } catch (err) {
        console.log(err)
    }

})



// redirection en cas d'erreur 404
app.get('/notFound', (req, res) => {
    res.render('notFound')
})

// redirection en cas d'erreur 404
app.get('/contact', (req, res) => {
    res.render('contact')
})


//récupérer l'entrée dans la barre de recherche
app.post('/search', async(req, res) => {
    try {
        // on récupère le champs avec le name search
        const search = req.body.search

        // on appelle la fonction de recherche
        const films = await getSearchMovies(search)

        // on renvoie vers la page du film chercher
        res.render(`films`, { films })

    } catch (err) {
        console.log(err)
    }
})



// On ouvre le serveur
app.listen(PORT, () => console.log(`Le serveur est ouvert sur le port ${PORT}`))