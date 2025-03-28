import express from 'express'
import API from './js/api.js'

const app = express()
const api = new API()
const port = 3000

app.get('/', (request, response) => {
    response.send('Hello World!')
})

app.get('/api', (request, response) => {
    api.process(request, response)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
