import Brand from './brand.js'
import CarModel from "./car_model.js"

const dummyBrands = [
    new Brand(1, 'BMW'),
    new Brand(2, 'Mercedes'),
    new Brand(3, 'Audi')
]

const dummyCarModels = [
    new CarModel(1, 'X5', 1),
    new CarModel(2, 'X6', 1),
    new CarModel(3, 'C-Class', 2),
    new CarModel(4, 'A4', 3)
]

export default class API {
    welcome(request, response) {
        response.send('Hello World from API!')
    }

    getBrands(request, response) {
        response.json(dummyBrands)
    }

    getBrand(request, response) {
        const brandId = parseInt(request.params.brandId)
        if (!brandId) {
            response.status(400).send('Missing brandId parameter')
            return
        }

        const brand = dummyBrands.find(brand => brand.id === brandId)
        if (!brand) {
            response.status(404).send('Brand not found')
            return
        }

        response.json(brand)
    }

    getModels(request, response) {
        const brandId = parseInt(request.params.brandId)
        if (!brandId) {
            response.status(400).send('Missing brandId parameter')
            return
        }

        const models = dummyCarModels.filter(model => model.brandId === brandId)
        if (models.length === 0) {
            response.status(404).send('No models found for the given brandId')
            return
        }

        response.json(models)
    }

    getModel(request, response) {
        const modelId = parseInt(request.params.modelId)
        if (!modelId) {
            response.status(400).send('Missing modelId parameter')
            return
        }

        const model = dummyCarModels.find(model => model.id === modelId)
        if (!model) {
            response.status(404).send('Model not found')
            return
        }

        response.json(model)
    }
}
