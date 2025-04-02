export default class CarModel {
    constructor(jsonString) {
        const jsonObject = JSON.parse(jsonString);

        this.#id = jsonObject.id;
        this.#name = jsonObject.name;
        this.#brandId = jsonObject.brandId;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get brandId() {
        return this.#brandId;
    }

    #id;
    #name;
    #brandId;
}