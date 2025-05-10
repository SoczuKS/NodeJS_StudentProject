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

    }


}
