import sqlite3 from 'sqlite3'
import fs from 'fs'
import bcrypt from 'bcrypt'

export default class DatabaseConnector {
    constructor() {
        this.database = null;
    }

    connect() {
        const dbPath = './database.sqlite';
        const isNewDatabase = !fs.existsSync(dbPath);

        this.database = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the database.');
                if (isNewDatabase) {
                    console.log('Database file created. Initializing tables...');
                    this.createTables(this.database);
                    console.log("Tables created and initial data inserted.");
                }
            }
        });
    }

    close() {
        if (this.database) {
            this.database.close((err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Closed the database connection.');
                }
            });
        }
    }

    createTables(db) {
        db.exec(`
            create table brand
            (
                id      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name    varchar(28)                       NOT NULL UNIQUE,
                country varchar(20)                       NOT NULL
            );

            create table model
            (
                id      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name    varchar(20)                       NOT NULL UNIQUE,
                brandId int                               NOT NULL,
                FOREIGN KEY (brandId) REFERENCES brand (id)
            );

            create table fuelType
            (
                id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name varchar(16)                       NOT NULL UNIQUE
            );

            create table bodyType
            (
                id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name varchar(16)                       NOT NULL UNIQUE
            );

            create table modelVersion
            (
                id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                modelId         int                               NOT NULL,
                bodyTypeId      int                               NOT NULL,
                productionStart date                              NOT NULL,
                productionEnd   date,
                engineCapacity  real,
                power           int                               NOT NULL,
                fuelTypeId      int                               NOT NULL,
                FOREIGN KEY (modelId) REFERENCES model (id),
                FOREIGN KEY (bodyTypeId) REFERENCES bodyType (id),
                FOREIGN KEY (fuelTypeId) REFERENCES fuelType (id)
            );

            create table user
            (
                id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                username        varchar(26)                       NOT NULL UNIQUE,
                password        varchar(30)                       NOT NULL,
                name            varchar(20)                       NOT NULL,
                surname         varchar(55)                       NOT NULL,
                age             int,
                phoneNumber     varchar(15)                       NOT NULL UNIQUE,
                email           varchar(30)                       NOT NULL UNIQUE,
                address         varchar(50),
                permissionLevel int                               NOT NULL
            );

            create table offer
            (
                id             INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                title          varchar(50)                       NOT NULL,
                modelVersionId int                               NOT NULL,
                userId         int                               NOT NULL,
                description    varchar(200),
                mileage        int                               NOT NULL,
                price          real                              NOT NULL,
                FOREIGN KEY (modelVersionId) REFERENCES modelVersion (id),
                FOREIGN KEY (userId) REFERENCES user (id)
            );

            create table wiki
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                description TEXT
            );

            insert into brand (name, country)
            values ('Fiat', 'Italy'),
                   ('Ford', 'USA'),
                   ('Audi', 'Germany'),
                   ('Toyota', 'Japan'),
                   ('Renault', 'France'),
                   ('Mercedes', 'Germany'),
                   ('BMW', 'Germany'),
                   ('Honda', 'Japan'),
                   ('Nissan', 'Japan'),
                   ('Peugeot', 'France'),
                   ('Hyundai', 'South Korea');

            insert into model (name, brandId)
            values ('Punto', 1),
                   ('Focus', 2),
                   ('A3', 3),
                   ('Corolla', 4),
                   ('Clio', 5),
                   ('C-Class', 6),
                   ('3 Series', 7),
                   ('Civic', 8),
                   ('Altima', 9),
                   ('208', 10),
                   ('N Vision 74', 11),
                   ('Ioniq 5', 11);

            insert into fuelType (name)
            values ('Petroleum'),
                   ('Diesel'),
                   ('Electric'),
                   ('Hybrid');

            insert into bodyType (name)
            values ('sedan'),
                   ('hatchback'),
                   ('SUV'),
                   ('coupe'),
                   ('convertible'),
                   ('wagon'),
                   ('crossover'),
                   ('pickup');

            insert into modelVersion (modelId, bodyTypeId, productionStart,
                                      productionEnd, engineCapacity, power, fuelTypeId)
            values (1, 2, '1993-02-01', '2018-06-22', 1.2, 60, 1),
                   (3, 6, '1996-12-04', null, 2.0, 150, 2),
                   (4, 1, '1966-05-01', null, 1.8, 140, 4),
                   (12, 3, '2021-01-01', null, null, 235, 3);
        `);

        bcrypt.hash('Admin', 5, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err)
                throw err
            }

            db.run(
                'insert into user (username, password, name, surname, phoneNumber, email, permissionLevel) values (?, ?, ?, ?, ?, ?, ?)',
                ['Admin', hashedPassword, 'Admin', 'Admin', '000000000', 'admin@admin.com', 0],
                (err) => {
                    if (err) {
                        console.error('Error inserting user:', err)
                        throw err
                    }
                })
        })

        bcrypt.hash('zaq1@WSX', 5, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err)
                throw err
            }

            db.run(
                'insert into user (username, password, name, surname, age, phoneNumber, email, permissionLevel) values (?, ?, ?, ?, ?, ?, ?, ?)',
                ['DummyClient', hashedPassword, 'Wierzchosława', 'Czartoryski Rostworowski-Mycielski Anderson Scimone', 20, '123456789', 'dummy@gmail.com', 1],
                (err) => {
                    if (err) {
                        console.error('Error inserting user:', err)
                        throw err
                    }
                })
        })
    }
}
