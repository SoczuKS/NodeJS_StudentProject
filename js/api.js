export default class API {
    welcome(request, response) {
        response.send('Hello World from API!')
    }

    getBrands(request, response) {
        const brands = [
        ]
        response.json(brands)
    }
}