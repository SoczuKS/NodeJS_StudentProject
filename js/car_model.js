export default class CarModel {
    constructor(id, name, brandId) {
        this.#id = id
        this.#name = name
        this.#brandId = brandId
    }

    static fromJSON(jsonString) {
        const jsonObject = JSON.parse(jsonString)
        return new CarModel(jsonObject.id, jsonObject.name, jsonObject.brandId)
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            brandId: this.#brandId
        }
    }

    get id() {
        return this.#id
    }

    get name() {
        return this.#name
    }

    get brandId() {
        return this.#brandId
    }

    #id
    #name
    #brandId
}