export default class Brand {
    constructor(id, name) {
        this.#id = id
        this.#name = name
    }

    static fromJSON(jsonString) {
        const jsonObject = JSON.parse(jsonString)
        return new Brand(jsonObject.id, jsonObject.name)
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name
        }
    }

    get id() {
        return this.#id
    }

    get name() {
        return this.#name
    }

    #id
    #name
}