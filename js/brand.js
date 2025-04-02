export default class Brand {
    constructor(jsonString) {
        const jsonObject = JSON.parse(jsonString);

        this.#id = jsonObject.id;
        this.#name = jsonObject.name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    #id;
    #name;
}