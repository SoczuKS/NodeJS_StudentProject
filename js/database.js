import sqlite3 from 'sqlite3';
import fs from 'fs';

export default class DatabaseConnector {
    constructor() {
        this.db = null;
    }

    connect() {
        const dbPath = './database.db';
        const isNewDatabase = !fs.existsSync(dbPath);

        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the database.');
                if (isNewDatabase) {
                    console.log('Database file created. Initializing tables...');
                    this.createTables(this.db);
                    console.log("Tables created and initial data inserted.");
                }
            }
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
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
                name    varchar(28) NOT NULL,
                country varchar(20) NOT NULL
            );

            create table model
            (
                id      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name    varchar(20) NOT NULL,
                brandId int         NOT NULL,
                FOREIGN KEY (brandId) REFERENCES brand (id)
            );

            create table fuelType
            (
                id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name varchar(16) NOT NULL
            );

            create table bodyType
            (
                id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name varchar(16) NOT NULL
            );

            create table modelVersion
            (
                id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                brandId         int  NOT NULL,
                modelId         int  NOT NULL,
                bodyTypeId      int  NOT NULL,
                productionStart date NOT NULL,
                productionEnd   date,
                engineCapacity  real,
                power           int  NOT NULL,
                fuelTypeId      int  NOT NULL,
                productionYear  int  NOT NULL,
                FOREIGN KEY (brandId) REFERENCES brand (id),
                FOREIGN KEY (modelId) REFERENCES model (id),
                FOREIGN KEY (bodyTypeId) REFERENCES bodyType (id),
                FOREIGN KEY (fuelTypeId) REFERENCES fuelType (id)
            );

            create table user
            (
                id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name            varchar(20) NOT NULL,
                surname         varchar(20) NOT NULL,
                age             int         NOT NULL,
                phoneNumber     varchar(15) NOT NULL,
                email           varchar(30) NOT NULL,
                address         varchar(50) NOT NULL,
                permissionLevel int         NOT NULL
            );

            create table offer
            (
                id             INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                modelVersionId int  NOT NULL,
                userId         int  NOT NULL,
                description    varchar(200),
                mileage        int  NOT NULL,
                price          real NOT NULL,
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
        
            insert into modelVersion (brandId, modelId, bodyTypeId, productionStart,
                                      productionEnd, engineCapacity, power, fuelTypeId, productionYear)
            values (1, 1, 2, '1993-02-01', '2018-06-22', 1.2, 60, 1, 2004),
                   (3, 3, 6, '1996-12-04', null, 2.0, 150, 2, 2016),
                   (4, 4, 1, '1966-05-01', null, 1.8, 140, 4, 2020),
                   (11, 12, 3, '2021-01-01', null, null, 235, 3, 2022);
        `);
    }
}
