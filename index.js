import express from 'express'
import API from './js/api_stub.js'

const app = express()
const api = new API()
const port = 3000

app.set('views', './templates')
app.set('view engine', 'ejs')
app.use(express.static('./public'))

const pages = ['main', 'wiki', 'marketplace', 'signin', 'signup']

app.get('/', async (request, response) => {
    console.log("New request received with params: ", request.query)

    let page = request.query.page
    if (!page || !pages.includes(page)) {
        console.log("As no page was provided, defaulting to main")
        page = 'main'
    }

    try {
        response.render('index', {language: 'pl', page: page})
    } catch(error) {
        console.error('Błąd odczytu pliku: ', error)
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' })
        response.end()
    }
})

app.get('/api', (request, response) => {
    api.welcome(request, response)
})

app.get('/api/brands', (request, response) => {
    api.getBrands(request, response)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
