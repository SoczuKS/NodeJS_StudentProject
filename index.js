import express from 'express'
import session from 'express-session'
import API from './js/api_stub.js'
import fetch from 'node-fetch'

const app = express()
const api = new API()
const port = 3000
const apiUrl = 'http://localhost:3000/api/'

app.use(session({
    secret: 'abcd1234qwermnbv',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('views', './templates')
app.set('view engine', 'ejs')
app.use(express.static('./public', {
    setHeaders: (response, path) => {
        if (path.endsWith('.css')) {
            response.setHeader('Content-Type', 'text/css; charset=UTF-8')
        } else if (path.endsWith('.js')) {
            response.setHeader('Content-Type', 'text/javascript; charset=UTF-8')
        }
    }
}))

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
    } catch (error) {
        console.error('Read file failed: ', error)
        response.writeHead(500, {'Content-Type': 'text/plain; charset=UTF-8'})
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
        response.render('index', {
            language: 'pl',
            page: 'wiki',
            subpage: 'wiki_main',
            brands: brands,
            session: request.session
        })
    })
})

app.get('/wiki/brand/:brandId', (request, response) => {
    const brandId = parseInt(request.params.brandId)
    if (!brandId) {
        response.status(400).send('Missing brandId parameter')
        return
    }

    fetchData(`${apiUrl}brand/${brandId}`).then(brand => {
        fetchData(`${apiUrl}models/${brandId}`).then(models => {
            response.render('index', {
                language: 'pl',
                page: 'wiki',
                subpage: 'wiki_brand',
                brand: brand,
                session: request.session,
                models: models
            })
        }).catch(error => {
            console.error('Error fetching models:', error)
            response.status(500).send('Error fetching models')
        })
    }).catch(error => {
        console.error('Error fetching brand:', error)
        response.status(500).send('Error fetching brand')
    })
})

app.get('/wiki/model/:modelId', (request, response) => {
    const modelId = parseInt(request.params.modelId)
    if (!modelId) {
        response.status(400).send('Missing modelId parameter')
        return
    }

    fetchData(`${apiUrl}model/${modelId}`).then(model => {
        fetchData(`${apiUrl}brand/${model.brandId}`).then(brand => {
            model.brand = brand

            response.render('index', {
                language: 'pl',
                page: 'wiki',
                subpage: 'wiki_model',
                model: model,
                session: request.session
            })
        }).catch(error => {
            console.error('Error fetching brand:', error)
            response.status(500).send('Error fetching brand')
        })
    }).catch(error => {
        console.error('Error fetching model:', error)
        response.status(500).send('Error fetching model')
    })
})

app.get('/signup', (request, response) => {
    response.render('index', {language: 'pl', page: 'signup', session: request.session})
})

app.post('/signup', (request, response) => {
    const { username, password, email, firstname, lastname, phone } = request.body
    console.log(`Received signup data: ${username}, ${password}, ${email}, ${firstname}, ${lastname}, ${phone}`)
    response.redirect('/')
})

app.get('/signin', (request, response) => {
    response.render('index', {language: 'pl', page: 'signin', session: request.session})
})

app.post('/signin', (request, response) => {
    const { username, password } = request.body
    console.log(`Received signin data: ${username}, ${password}`)
    response.redirect('/')
})

app.get('/marketplace', (request, response) => {
    response.render('index', {language: 'pl', page: 'marketplace', session: request.session})
})

app.get('/api', (request, response) => {
    api.welcome(request, response)
})

app.get('/api/brand/:brandId', (request, response) => {
    api.getBrand(request, response)
})

app.get('/api/brands', (request, response) => {
    api.getBrands(request, response)
})

app.get('/api/models/:brandId', (request, response) => {
    api.getModels(request, response)
})

app.get('/api/model/:modelId', (request, response) => {
    api.getModel(request, response)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
