const db = require('../config/db');

// Criar tabelas e inserir dados
db.serialize(() => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    // Tabela de produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            image TEXT
        )
    `);

    // Tabela de carrinho
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

    // Tabela de pedidos
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

    // Inserir dados de exemplo para produtos
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 1', 'Descrição do Produto 1', 10.0, 'images/imagem1.png')");
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 2', 'Descrição do Produto 2', 20.0, 'images/imagem2.png')");
    db.run("INSERT INTO Products (name, description, price, image) VALUES ('Produto 3', 'Descrição do Produto 3', 30.0, 'images/imagem3.png')");
    
});

db.close();
