import DatabaseConnector from "./database.js";

export default class API {
    constructor(){
        this.db = new DatabaseConnector()
        this.db.connect()
    }

    welcome(request, response) {
        response.send('Hello World from API!')
    }

    getBrands(request, response) {
        const query = 'select * from brand order by name ASC'
        this.db.db.all(query, [], (err, rows) => {
            if(err){
                console.error('Error fetching brands:', err)
                response.status(500).send('Error fetching brands')
            }
            else{
                response.json(rows)
            }
        })
    }

    getBrand(request, response) {
        const brandId = parseInt(request.params.brandId)
        const query = 'select * from brand where id = ?'
        this.db.db.get(query, [brandId], (err, row) => {
            if(err){
                console.error('Error fetching brand:', err)
                response.status(500).send('Error fetching brand')
            }
            else{
                response.json(row)
            }
        })
    }

    getModels(request, response) {
        const brandId = parseInt(request.params.brandId)
        const query = 'select * from model where brandId = ? order by name ASC'
        this.db.db.all(query, [brandId], (err, rows) => {
            if(err){
                console.error('Error fetching models:', err)
                response.status(500).send('Error fetching models')
            }
            else{
                response.json(rows)
            }
        })
    }

    getModel(request,response){
        const modelId = parseInt(request.params.modelId)
        const query = 'select * from model where id = ?'
        this.db.db.get(query, [modelId], (err, row) => {
            if(err){
                console.error('Error fetching model:', err)
                response.status(500).send('Error fetching model')
            }
            else{
                response.json(row)
            }
        })
    }

    signIn(request, response) {
        const username = request.body.username
        const password = request.body.password

        this.db.db.get(username, [username], (err, row) => {
            if(err){
                console.error('Error fetching user:', err)
                response.status(500).send('Error fetching user')
            }
            else{
                if(row && row.password === password){
                    request.session.user = {
                        id: row.id,
                        username: row.username
                    }
                    response.json({success: true})
                }
                else{
                    console.error('Invalid username or password')
                    response.json({success: false})
                }
            }
        })
    }

    signUp(request, response){
        const username = request.body.username
        const password = request.body.password
        const name = request.body.firstname
        const surname = request.body.lastname
        const phone = request.body.phone
        const email = request.body.email

        if (!username || !password || !name || !surname || !phone || !email) {
            return console.error('fields: ' + username + ' ' + password + ' ' + name + ' ' + surname + ' ' + phone + ' ' + email);
        }

        const query = 'insert into user (username, password, name, surname, phoneNumber, email, permissionLevel) values (?, ?, ?, ?, ?, ?, ?)'
        const values = [username, password, name, surname, phone, email, 1]

        this.db.db.run(query, values, function(err){
            if(err){
                console.error('Error inserting user:', err)
                response.status(500).send('Error inserting user')
            }
            else{
                request.session.user = {
                    id: this.lastID,
                    username: username
                }
                response.json({success: true})
            }
        })
    }


}
