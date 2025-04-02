import express from 'express'
import session from 'express-session'
import API from './js/api_stub.js'
import fetch from 'node-fetch'

const app = express()
const api = new API()
const port = 3000

app.use(session({
    secret: 'abcd1234qwermnbv',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.set('views', './templates')
app.set('view engine', 'ejs')
app.use(express.static('./public'))

async function fetchData(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText)
    }
    return response.json()
}

app.get('/', async (request, response) => {
    try {
        response.render('index', {language: 'pl', page: 'main', session: request.session})
    } catch(error) {
        console.error('Błąd odczytu pliku: ', error)
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' })
        response.end()
    }
})

app.get('/wiki', (request, response) => {
    const fetchDataResult = fetchData('http://localhost:3000/api/brands')

    fetchDataResult.then(data => {
        const brands = data.map(brand => ({
            id: brand.id,
            name: brand.name
        }))
        response.render('index', {language: 'pl', page: 'wiki', brands: brands, session: request.session})
    })
})

app.get('/signup', (request, response) => {
    response.render('index', {language: 'pl', page: 'signup', session: request.session})
})

app.get('/signin', (request, response) => {
    response.render('index', {language: 'pl', page: 'signin', session: request.session})
})

app.get('/marketplace', (request, response) => {
    response.render('index', {language: 'pl', page: 'marketplace', session: request.session})
})

app.get('/api', (request, response) => {
    api.welcome(request, response)
})

app.get('/api/brands', (request, response) => {
    api.getBrands(request, response)
})

app.get('/api/models/:brandId', (request, response) => {
    api.getModels(request, response)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
