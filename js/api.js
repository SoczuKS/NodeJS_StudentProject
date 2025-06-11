import bcrypt from 'bcrypt'
import DatabaseConnector from "./database.js";

export default class API {
    constructor() {
        this.databaseConnector = new DatabaseConnector()
        this.databaseConnector.connect()
    }

    welcome(request, response) {
        response.send('Hello World from API!')
    }

    getBrands(request, response) {
        this.databaseConnector.database.all('select * from brand order by name', [], (err, rows) => {
            if (err) {
                console.error('Error fetching brands:', err)
                response.status(500).send('Error fetching brands')
                return
            }

            response.json(rows)
        })
    }

    getBrand(request, response) {
        const {brandId} = request.params
        if (!brandId) {
            console.error(`Error fetching brand: ${brandId}`)
            response.status(400).send('Brand ID is required')
            return
        }

        this.databaseConnector.database.get('select * from brand where id = ?', [parseInt(brandId)], (err, row) => {
            if (err) {
                console.error('Error fetching brand:', err)
                response.status(500).send('Error fetching brand')
                return
            }

            response.json(row)
        })
    }

    getModels(request, response) {
        const {brandId} = request.params
        if (!brandId) {
            response.status(400).send('Brand ID is required')
            return
        }

        this.databaseConnector.database.all('select * from model where brandId = ? order by name', [parseInt(brandId)], (err, rows) => {
            if (err) {
                console.error('Error fetching models:', err)
                response.status(500).send('Error fetching models')
                return
            }
            response.json(rows)
        })
    }

    getModel(request, response) {
        const {modelId} = request.params
        if (!modelId) {
            response.status(400).send('Model ID is required')
            return
        }

        this.databaseConnector.database.get('select * from model where id = ?', [parseInt(modelId)], (err, row) => {
            if (err) {
                console.error('Error fetching model:', err)
                response.status(500).send('Error fetching model')
                return
            }

            response.json(row)
        })
    }

    signIn(request, response) {
        const {username, password} = request.body

        const query = 'select * from user where username = ?'
        this.databaseConnector.database.get(query, [username], (err, user) => {
            if (err) {
                console.error(err)
                response.status(500).send('Error fetching user')
                return
            }

            if (!user) {
                response.json({success: false})
                return
            }

            bcrypt.compare(password, user.password, (err, matched) => {
                if (!matched) {
                    response.json({success: false})
                    return
                }
                response.json({
                    success: true,
                    user: {
                        username: user.username,
                        permissionLevel: user.permissionLevel
                    },
                    token: request.session.id
                })
            })
        })
    }

    signUp(request, response) {
        const {username, password, firstname, lastname, phone, email} = request.body

        bcrypt.hash(password, 5, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err)
                response.status(500).send('Error hashing password')
                return
            }

            this.databaseConnector.database.run(
                'insert into user (username, password, name, surname, phoneNumber, email, permissionLevel) values (?, ?, ?, ?, ?, ?, ?)',
                [username, hashedPassword, firstname, lastname, phone, email, 1],
                (err) => {
                    if (err) {
                        console.error('Error inserting user:', err)
                        response.status(500).send('Error fetching user')
                        return
                    }
                    response.json({success: true})
                })
        })
    }
}
