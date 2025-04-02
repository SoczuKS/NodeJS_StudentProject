import Brand from './brand.js'
import CarModel from "./car_model.js"

const dummyBrands = [
    new Brand('{"id": 1, "name": "BMW"}'),
    new Brand('{"id": 2, "name": "Mercedes"}'),
    new Brand('{"id": 3, "name": "Audi"}')
]

const dummyCarModels = [
    new CarModel('{"id": 1, "name": "X5", "brandId": 1}'),
    new CarModel('{"id": 2, "name": "X6", "brandId": 1}'),
    new CarModel('{"id": 3, "name": "C-Class", "brandId": 2}'),
    new CarModel('{"id": 4, "name": "A4", "brandId": 3}')
]

export default class API {
    process(request, response) {
        response.send('Hello World from API!')
    }
}