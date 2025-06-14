import express from 'express'
import session from 'express-session'
import fetch from 'node-fetch'
import API from './js/api.js'

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
        throw new Error(`Network response was not ok [${response.status}] ${response.statusText}`)
    }
    return response.json()
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error(`Network response was not ok [${response.status}] ${response.statusText}`)
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
    fetchData(`${apiUrl}brands`).then(brands => {
        response.render('index', {
            language: 'pl',
            page: 'wiki',
            subpage: 'wiki_main',
            brands: brands,
            session: request.session
        })
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.get('/wiki/brand/:brandId', (request, response) => {
    const {brandId} = request.params
    if (!brandId) {
        response.redirect('/')
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
        }).catch(err => {
            console.error(err)
            response.redirect('/')
        })
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.get('/wiki/model/:modelId', (request, response) => {
    const {modelId} = request.params
    if (!modelId) {
        response.redirect('/')
        return
    }

    fetchData(`${apiUrl}model/${modelId}`).then(model => {
        const totalToFetch = 4
        let fetchedCount = 0
        let fuelTypes = []
        let bodyTypes = []
        const render = () => {
            response.render('index', {
                language: 'pl',
                page: 'wiki',
                subpage: 'wiki_model',
                model: model,
                session: request.session,
                fuelTypes: fuelTypes,
                bodyTypes: bodyTypes
            })
        }
        fetchData(`${apiUrl}brand/${model.brandId}`).then(brand => {
            fetchedCount += 1
            model.brand = brand

            if (fetchedCount === totalToFetch) {
                render()
            }
        }).catch(error => {
            console.error('Error fetching brand:', error)
            response.status(500).send('Error fetching brand')
        })

        fetchData(`${apiUrl}model_versions/${model.id}`).then(modelVersions => {
            fetchedCount += 1
            model.modelVersions = modelVersions

            if (fetchedCount === totalToFetch) {
                render()
            }
        }).catch(error => {
            console.error('Error fetching model versions:', error)
            response.status(500).send('Error fetching model versions')
        })

        fetchData(`${apiUrl}fuel_types`).then(fetchedFuelTypes => {
            fetchedCount += 1
            fuelTypes = fetchedFuelTypes

            if (fetchedCount === totalToFetch) {
                render()
            }
        }).catch(error => {
            console.error('Error fetching fuel types:', error)
            response.status(500).send('Error fetching fuel types')
        })

        fetchData(`${apiUrl}body_types`).then(fetchedBodyTypes => {
            fetchedCount += 1
            bodyTypes = fetchedBodyTypes

            if (fetchedCount === totalToFetch) {
                render()
            }
        }).catch(error => {
            console.error('Error fetching body types:', error)
            response.status(500).send('Error fetching body types')
        })
    }).catch(error => {
        console.error('Error fetching model:', error)
        response.status(500).send('Error fetching model')
    })
})

app.get('/signup', (request, response) => {
    response.render('index', {language: 'pl', page: 'signup', session: request.session})
})

app.get('/signin', (request, response) => {
    response.render('index', {language: 'pl', page: 'signin', session: request.session})
})

app.get('/signout', (request, response) => {
    if (request.session && request.session.user) {
        delete request.session.user
    }
    response.redirect('/')
})

app.get('/marketplace', (request, response) => {
    fetchData(`${apiUrl}offers`).then((offers) => {
        response.render('index', {
            language: 'pl',
            page: 'marketplace',
            subpage: 'marketplace_main',
            offers: offers,
            session: request.session
        })
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.get('/marketplace/add_offer', (request, response) => {
    if (!request.session || !request.session.user) {
        response.redirect('/')
        return
    }

    fetchData(`${apiUrl}offers`).then((offers) => {
        fetchData(`${apiUrl}brands`).then((brands) => {
            response.render('index', {
                language: 'pl',
                page: 'marketplace',
                subpage: 'marketplace_add_offer',
                offers: offers,
                brands: brands,
                session: request.session
            })
        }).catch(err => {
            console.error(err)
            response.redirect('/')
        })
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.get('/marketplace/offer/:offerId', (request, response) => {
    const {offerId} = request.params
    fetchData(`${apiUrl}offer/${offerId}`).then((offer) => {
        response.render('index', {
            language: 'pl',
            page: 'marketplace',
            subpage: 'marketplace_offer',
            offer: offer,
            session: request.session
        })
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.get('/adminpanel', (request, response) => {
    if (!request.session || !request.session.user || request.session.user.permissionLevel !== 0) {
        response.redirect('/')
        return
    }

    response.render('index', {language: 'pl', page: 'adminpanel', subpage: 'adminpanel_main', session: request.session})
})

app.get('/adminpanel/users', (request, response) => {
    if (!request.session || !request.session.user || request.session.user.permissionLevel !== 0) {
        response.redirect('/')
        return
    }

    fetchData(`${apiUrl}users`).then(users => {
        response.render('index', {
            language: 'pl',
            page: 'adminpanel',
            subpage: 'adminpanel_users',
            session: request.session,
            users: users
        })
    }).catch(error => {
        console.error('Error fetching users users:', error)
        response.status(500).send('Error fetching users')
    })
})

app.get('/account', (request, response) => {
    if (!request.session || !request.session.user) {
        response.redirect('/')
        return
    }

    response.render('index', {
        language: 'pl',
        page: 'account',
        session: request.session
    })
})

app.post('/adminpanel/wiki/brands/add', (request, response) => {
    if (!request.session || !request.session.user || request.session.user.permissionLevel !== 0) {
        response.redirect('/')
        return
    }

    const postDataResult = postData('http://localhost:3000/api/add_brand', request.body)
    postDataResult.then(_ => {
        response.redirect('/wiki')
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.post('/adminpanel/wiki/models/add', (request, response) => {
    if (!request.session || !request.session.user || request.session.user.permissionLevel !== 0) {
        response.redirect('/')
        return
    }

    const postDataResult = postData('http://localhost:3000/api/add_model', request.body)
    postDataResult.then(_ => {
        response.redirect(`/wiki/brand/${request.body.brand_id}`)
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.post('/adminpanel/wiki/model_versions/add', (request, response) => {
    if (!request.session || !request.session.user || request.session.user.permissionLevel !== 0) {
        response.redirect('/')
        return
    }

    const postDataResult = postData('http://localhost:3000/api/add_model_version', request.body)
    postDataResult.then(_ => {
        response.redirect(`/wiki/model/${request.body.model_id}`)
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.post('/signup', (request, response) => {
    const postDataResult = postData('http://localhost:3000/api/signup', request.body)
    postDataResult.then(_ => {
        response.redirect('/')
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.post('/signin', (request, response) => {
    const postDataResult = postData('http://localhost:3000/api/signin', request.body)
    postDataResult.then(data => {
        if (data.success === true) {
            request.session.user = data.user
            response.session = request.session
            response.redirect('/')
        } else {
            response.redirect('/signin')
        }
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
})

app.post('/marketplace/add_offer', (request, response) => {
    if (!request.session || !request.session.user) {
        response.redirect('/')
        return
    }

    const postDataResult = postData('http://localhost:3000/api/add_offer', request.body)
    postDataResult.then(_ => {
        response.redirect('/marketplace')
    }).catch(err => {
        console.error(err)
        response.redirect('/')
    })
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

app.get('/api/model_versions/:modelId', (request, response) => {
    api.getModelVersions(request, response)
})

app.get('/api/fuel_types', (request, response) => {
    api.getFuelTypes(request, response)
})

app.get('/api/body_types', (request, response) => {
    api.getBodyTypes(request, response)
})

app.get('/api/users', (request, response) => {
    api.getUsers(request, response)
})

app.get('/api/offers', (request, response) => {
    api.getOffers(request, response)
})

app.get('/api/offer/:offerId', (request, response) => {
    api.getOffer(request, response)
})

app.post('/api/signin', (request, response) => {
    api.signIn(request, response)
})

app.post('/api/signup', (request, response) => {
    api.signUp(request, response)
})

app.post('/api/add_brand', (request, response) => {
    api.addBrand(request, response)
})

app.post('/api/add_model', (request, response) => {
    api.addModel(request, response)
})

app.post('/api/add_model_version', (request, response) => {
    api.addModelVersion(request, response)
})

app.post('/api/add_offer', (request, response) => {
    api.addOffer(request, response)
})

app.delete('/api/delete_brand', (request, response) => {
    api.deleteBrand(request, response)
})

app.delete('/api/delete_model', (request, response) => {
    api.deleteModel(request, response)
})

app.delete('/api/delete_model_version', (request, response) => {
    api.deleteModelVersion(request, response)
})

app.delete('/api/delete_user', (request, response) => {
    api.deleteUser(request, response)
})

app.delete('/api/delete_offer', (request, response) => {
    api.deleteOffer(request, response)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
