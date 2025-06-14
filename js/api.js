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
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    getBrand(request, response) {
        const {brandId} = request.params
        if (!brandId) {
            console.error(`Brand ID is not provided`)
            response.json({success: false})
            return
        }

        this.databaseConnector.database.get('select * from brand where id = ?', [parseInt(brandId)], (err, row) => {
            if (err) {
                console.error('Error fetching brand:', err)
                response.json({success: false})
                return
            }

            response.json(row)
        })
    }

    addBrand(request, response) {
        const {brand_name, brand_country, brand_description} = request.body

        if (!brand_name || !brand_country) {
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('insert into brand (name, country, description) values (?, ?, ?)', [brand_name, brand_country, brand_description], (err) => {
            if (err) {
                console.error('Error adding brand:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    updateBrand(request, response) {
        const {brand_id, brand_name, brand_country, brand_description} = request.body

        if (!brand_id || !brand_name || !brand_country) {
            console.error('Brand ID, name, and country are required for update')
            response.json({success: false})
            return
        }
        this.databaseConnector.database.run(
            'update brand set name = ?, country = ?, brand_description = ? where id = ?',
            [brand_name, brand_country, brand_description, parseInt(brand_id)],
            (err) => {
                if (err) {
                    console.error('Error updating brand:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    deleteBrand(request, response) {
        const {id} = request.body

        if (!id) {
            console.error('Brand ID is required for deletion')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('delete from brand where id = ?', [id], (err) => {
            if (err) {
                console.error('Error deleting brand:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    getModels(request, response) {
        const {brandId} = request.params
        if (!brandId) {
            console.error('Brand ID is required')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.all('select * from model where brandId = ? order by name', [parseInt(brandId)], (err, rows) => {
            if (err) {
                console.error('Error fetching models:', err)
                response.json({success: false})
                return
            }
            response.json(rows)
        })
    }

    getModel(request, response) {
        const {modelId} = request.params
        if (!modelId) {
            console.error('Model ID is required')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.get('select * from model where id = ?', [parseInt(modelId)], (err, row) => {
            if (err) {
                console.error('Error fetching model:', err)
                response.json({success: false})
                return
            }

            response.json(row)
        })
    }

    addModel(request, response) {
        const {model_name, brand_id, model_description} = request.body

        if (!model_name || !brand_id) {
            response.status(400).send('Model name and brand ID are required')
            return
        }

        this.databaseConnector.database.run('insert into model (name, brandId, description) values (?, ?, ?)', [model_name, parseInt(brand_id), model_description], (err) => {
            if (err) {
                console.error('Error adding model:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    updateModel(request, response) {
        const {model_id, model_name, brand_id, model_description} = request.body

        if (!model_id || !model_name || !brand_id) {
            console.error('Model ID, name, and brand ID are required for update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update model set name = ?, brandId = ?, modelDescription = ? where id = ?',
            [model_name, parseInt(brand_id), model_description, parseInt(model_id)],
            (err) => {
                if (err) {
                    console.error('Error updating model:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    deleteModel(request, response) {
        const {id} = request.body

        if (!id) {
            console.error('Model ID is required for deletion')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('delete from model where id = ?', [parseInt(id)], (err) => {
            if (err) {
                console.error('Error deleting model:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    getModelVersions(request, response) {
        const {modelId} = request.params
        if (!modelId) {
            console.error('Model ID is required')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.all('select mv.id as modelVersionId, mv.modelId, mv.productionStart, mv.productionEnd, mv.engineCapacity, mv.power, bt.name as bodyType, ft.name as fuelType from modelVersion as mv left join bodyType bt on mv.bodyTypeId = bt.id left join fuelType ft on mv.fuelTypeId = ft.id where mv.modelId = ?', [parseInt(modelId)], (err, rows) => {
            if (err) {
                console.error('Error fetching model versions:', err)
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    addModelVersion(request, response) {
        const {model_id, body_type, production_start, production_end, engine_capacity, power, fuel_type} = request.body

        if (!model_id || !body_type || !production_start || !power || !fuel_type) {
            console.error('Model ID, body type ID, production start date, power and fuel type ID are required')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'insert into modelVersion (modelId, bodyTypeId, productionStart, productionEnd, engineCapacity, power, fuelTypeId) values (?, ?, ?, ?, ?, ?, ?)',
            [parseInt(model_id), parseInt(body_type), production_start, production_end || null, engine_capacity || null, parseInt(power), parseInt(fuel_type)],
            (err) => {
                if (err) {
                    console.error('Error adding model version:', err)
                    response.json({success: false})
                    return
                }

                response.json({success: true})
            })
    }

    updateModelVersion(request, response) {
        const {id, model_id, body_type, production_start, production_end, engine_capacity, power, fuel_type} = request.body
        if (!id || !model_id || !body_type || !production_start || !production_end || !engine_capacity || !power || !fuel_type) {
            console.error('All fields are required for model version update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update modelVersion set modelId = ?, bodyTypeId = ?, productionStart = ?, productionEnd = ?, engineCapacity = ?, power = ?, fuelTypeId = ? where id = ?',
            [parseInt(model_id), parseInt(body_type), production_start, production_end, engine_capacity, parseInt(power), parseInt(fuel_type), parseInt(id)],
            (err) => {
                if (err) {
                    console.error('Error updating model version:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    deleteModelVersion(request, response) {
        const {id} = request.body

        if (!id) {
            console.error('Model version ID is required for deletion')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('delete from modelVersion where id = ?', [parseInt(id)], (err) => {
            if (err) {
                console.error('Error deleting model version:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    getFuelTypes(request, response) {
        this.databaseConnector.database.all('select * from fuelType', [], (err, rows) => {
            if (err) {
                console.error('Error fetching fuel types:', err)
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    getBodyTypes(request, response) {
        this.databaseConnector.database.all('select * from bodyType', [], (err, rows) => {
            if (err) {
                console.error('Error fetching body types:', err)
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    signIn(request, response) {
        const {username, password} = request.body

        const query = 'select * from user where username = ?'
        this.databaseConnector.database.get(query, [username], (err, user) => {
            if (err) {
                console.error('Error fetching user:', err)
                response.json({success: false})
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
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        surname: user.surname,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        age: user.age,
                        address: user.address,
                        permissionLevel: user.permissionLevel
                    },
                    token: request.session.id
                })
            })
        })
    }

    signUp(request, response) {
        const {username, password, firstname, lastname, phone, email} = request.body

        if (!username || !password || !firstname || !lastname || !phone || !email) {
            console.error('All fields are required for signup')
            response.json({success: false})
            return
        }

        bcrypt.hash(password, 5, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err)
                response.json({success: false})
                return
            }

            this.databaseConnector.database.run(
                'insert into user (username, password, name, surname, phoneNumber, email, permissionLevel) values (?, ?, ?, ?, ?, ?, ?)',
                [username, hashedPassword, firstname, lastname, phone, email, 1],
                (err) => {
                    if (err) {
                        console.error('Error inserting user:', err)
                        response.json({success: false})
                        return
                    }
                    response.json({success: true})
                })
        })
    }

    getUsers(request, response) {
        this.databaseConnector.database.all('select id, username, name, surname, phoneNumber, email, permissionLevel from user', [], (err, rows) => {
            if (err) {
                console.error('Error fetching users:', err)
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    updateUsername(request, response) {
        const {userId, newUsername} = request.body

        if (!userId || !newUsername) {
            console.error('User ID and new username are required for username update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set username = ? where id = ?', [newUsername, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating username:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updatePassword(request, response) {
        const {userId, currentPassword, newPassword} = request.body

        if (!userId || !currentPassword || !newPassword) {
            console.error('User ID, current password, and new password are required for password update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.get('select * from user where id = ?', [parseInt(userId)], (err, user) => {
            if(err){
                console.error('Error fetching user:', err)
                response.json({success: false})
                return
            }
            if(!user) {
                console.error('User not found')
                response.json({success: false})
                return
            }

            const match = bcrypt.compare(currentPassword, user.password)
            if (!match) {
                console.error('Current password does not match')
                response.json({success: false})
                return
            }

            const newHashedPassword = bcrypt.hash(newPassword, 5);

            this.databaseConnector.database.run(
                'update user set password = ? where id = ?', [newHashedPassword, parseInt(userId)], (err) => {
                    if (err) {
                        console.error('Error updating password:', err)
                        response.json({success: false})
                        return
                    }
                    response.json({success: true})
                }
            )
        })
    }

    updateName(request, response) {
        const {userId, newName} = request.body

        if (!userId || !newName) {
            console.error('User ID and new name are required for name update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set name = ? where id = ?', [newName, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating name:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updateSurname(request, response) {
        const {userId, newSurname} = request.body

        if (!userId || !newSurname) {
            console.error('User ID and new surname are required for surname update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set surname = ? where id = ?', [newSurname, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating surname:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updatePhoneNumber(request, response) {
        const {userId, newPhoneNumber} = request.body

        if (!userId || !newPhoneNumber) {
            console.error('User ID and new phone number are required for phone number update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set phoneNumber = ? where id = ?', [newPhoneNumber, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating phone number:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updateEmail(request, response) {
        const {userId, newEmailAddress} = request.body

        if (!userId || !newEmailAddress) {
            console.error('User ID and new email are required for email update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set email = ? where id = ?', [newEmailAddress, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating email:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updateAddress(request, response) {
        const {userId, newAddress} = request.body

        if (!userId || !newAddress) {
            console.error('User ID and new address are required for address update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set address = ? where id = ?', [newAddress, parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating address:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    updatePermissionLevel(request, response) {
        const {userId, newPermissionLevel} = request.body

        if (!userId || !newPermissionLevel) {
            console.error('User ID and new permission level are required for permission level update')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'update user set permissionLevel = ? where id = ?', [parseInt(newPermissionLevel), parseInt(userId)], (err) => {
                if (err) {
                    console.error('Error updating permission level:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    getFavoriteCars(request, response) {
        const {userId} = request.params
        if (!userId) {
            console.error('User ID is required to fetch favorite cars')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.all(
            'select m.id as modelId, m.name as modelName, b.name as brandName from favoriteCar as fc join model as m on fc.modelId = m.id join brand as b on m.brandId = b.id where fc.userId = ?',
            [parseInt(userId)],
            (err, rows) => {
                if (err) {
                    console.error('Error fetching favorite cars:', err)
                    response.json({success: false})
                    return
                }
                response.json(rows)
            }
        )
    }

    addFavoriteCar(request, response) {
        const {userId, modelId} = request.body

        if (!userId || !modelId) {
            console.error('User ID and model ID are required for adding favorite car')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'insert into favoriteCar (userId, modelId) values (?, ?)',
            [parseInt(userId), parseInt(modelId)],
            (err) => {
                if (err) {
                    console.error('Error adding favorite car:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    deleteFavoriteCar(request, response) {
        const {userId, modelId} = request.body

        if (!userId || !modelId) {
            console.error('User ID and model ID are required for deleting favorite car')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'delete from favoriteCar where userId = ? and modelId = ?',
            [parseInt(userId), parseInt(modelId)],
            (err) => {
                if (err) {
                    console.error('Error deleting favorite car:', err)
                    response.json({success: false})
                    return
                }
                response.json({success: true})
            }
        )
    }

    deleteUser(request, response) {
        const {id} = request.body

        if (!id) {
            console.error('User ID is required for deletion')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('delete from user where id = ?', [parseInt(id)], (err) => {
            if (err) {
                console.error('Error deleting user:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }

    getOffers(request, response) {
        this.databaseConnector.database.all('select offer.id as id, offer.title as title, offer.description as description, offer.mileage as mileage, offer.price as price, ' +
            'modelVersion.productionStart as productionStart, modelVersion.productionEnd as productionEnd, modelVersion.engineCapacity as engineCapacity, modelVersion.power as power, ' +
            'model.name as modelName, ' +
            'brand.name as brandName, ' +
            'user.username as username, user.phoneNumber as phoneNumber, ' +
            'fuelType.name as fuelType, ' +
            'bodyType.name as bodyType ' +
            'from offer ' +
            'join modelVersion on offer.modelVersionId = modelVersion.id ' +
            'join model on modelVersion.modelId = model.id ' +
            'join brand on model.brandId = brand.id ' +
            'join bodyType on modelVersion.bodyTypeId = bodyType.id ' +
            'join fuelType on modelVersion.fuelTypeId = fuelType.id ' +
            'join user on offer.userId = user.id', [], (err, rows) => {
            if (err) {
                console.error('Error fetching offers:', err)
                response.json({success: false})
                return
            }

            response.json(rows)
        })
    }

    getOffer(request, response) {
        const {offerId} = request.params
        this.databaseConnector.database.get('select offer.title as title, offer.description as description, offer.mileage as mileage, offer.price as price, ' +
            'modelVersion.productionStart as productionStart, modelVersion.productionEnd as productionEnd, modelVersion.engineCapacity as engineCapacity, modelVersion.power as power, ' +
            'model.name as modelName, ' +
            'brand.name as brandName, ' +
            'user.username as username, user.phoneNumber as phoneNumber, ' +
            'fuelType.name as fuelType, ' +
            'bodyType.name as bodyType ' +
            'from offer ' +
            'join modelVersion on offer.modelVersionId = modelVersion.id ' +
            'join model on modelVersion.modelId = model.id ' +
            'join brand on model.brandId = brand.id ' +
            'join bodyType on modelVersion.bodyTypeId = bodyType.id ' +
            'join fuelType on modelVersion.fuelTypeId = fuelType.id ' +
            'join user on offer.userId = user.id ' +
            'where offer.id = ?', [parseInt(offerId)], (err, row) => {
            if (err) {
                console.error('Error fetching offers:', err)
                response.json({success: false})
                return
            }

            response.json(row)
        })
    }

    addOffer(request, response) {
        const {title, model_version_id, description, mileage, price, user_id} = request.body

        if (!model_version_id || !price || !user_id || !title || !mileage || !description) {
            console.error('Model version ID, price and user ID are required for adding an offer')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run(
            'insert into offer (title, modelVersionId, userId, description, mileage, price) values (?, ?, ?, ?, ?, ?)',
            [title, parseInt(model_version_id), parseInt(user_id), description, mileage, price],
            (err) => {
                if (err) {
                    console.error('Error adding offer:', err)
                    response.json({success: false})
                    return
                }

                response.json({success: true})
            })
    }

    deleteOffer(request, response) {
        const {id} = request.body

        if (!id) {
            console.error('Offer ID is required for deletion')
            response.json({success: false})
            return
        }

        this.databaseConnector.database.run('delete from offer where id = ?', [parseInt(id)], (err) => {
            if (err) {
                console.error('Error deleting offer:', err)
                response.json({success: false})
                return
            }

            response.json({success: true})
        })
    }
}
