const db = require('../config/db');

// Criar tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            image TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY(user_id) REFERENCES Users(id),
            FOREIGN KEY(product_id) REFERENCES Products(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            first_name TEXT,
            last_name TEXT,
            address TEXT,
            number TEXT,
            cep TEXT,
            phone TEXT,
            email TEXT,
            payment_method TEXT,
            card_number TEXT,
            card_expiry TEXT,
            card_cvc TEXT,
            boleto_code TEXT,
            pix_key TEXT,
            total_price REAL,
            status TEXT,
            FOREIGN KEY(user_id) REFERENCES Users(id)
        )
    `);

    console.log("Tabelas criadas com sucesso.");

    // Inserir dados de exemplo
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 1', 'Descrição do Produto 1', 10.0, 'images/example.jpg')");
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 2', 'Descrição do Produto 2', 20.0, 'images/example.jpg')");
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 3', 'Descrição do Produto 3', 30.0, 'images/example.jpg')");
});

db.close();
