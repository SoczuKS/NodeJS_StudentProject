export default class User {
    static Role = Object.freeze({
        admin: {value: 2, name: 'admin'},
        user: {value: 1, name: 'user'},
        guest: {value: 0, name: 'guest'}
    })

    constructor(id, username, password, email, firstName, lastName, phone, role) {
        this.#id = id
        this.#username = username
        this.#password = password
        this.#email = email
        this.#firstName = firstName
        this.#lastName = lastName
        this.#phone = phone
        this.#role = role
    }

    static fromJSON(jsonString) {
        const jsonObject = JSON.parse(jsonString)
        return new User(
            jsonObject.id,
            jsonObject.username,
            jsonObject.password,
            jsonObject.email,
            jsonObject.firstName,
            jsonObject.lastName,
            jsonObject.phone,
            jsonObject.role)
    }

    toJSON() {
        return {
            id: this.#id,
            username: this.#username,
            password: this.#password,
            email: this.#email,
            firstName: this.#firstName,
            lastName: this.#lastName,
            phone: this.#phone,
            role: this.#role
        }
    }

    #id
    #username
    #password
    #email
    #firstName
    #lastName
    #phone
    #role
}