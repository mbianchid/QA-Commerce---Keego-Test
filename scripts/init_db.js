const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../src/qa_commerce.db');

// Abrir o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error('Erro ao abrir o banco de dados:', err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabelas e inserir dados
db.serialize(() => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            isAdmin INTEGER DEFAULT 0
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
            order_number TEXT,
            FOREIGN KEY(user_id) REFERENCES Users(id)
        )
    `);
    console.log("Tabelas criadas com sucesso.");


    

    // Inserir dados de exemplo para produtos
    const products = [
        { name: 'Produto 1', description: 'Descrição do Produto 1', price: 10.0, image: 'images/imagem1.png' },
        { name: 'Produto 2', description: 'Descrição do Produto 2', price: 20.0, image: 'images/imagem2.png' },
        { name: 'Produto 3', description: 'Descrição do Produto 3', price: 30.0, image: 'images/imagem3.png' },
        { name: 'Produto 4', description: 'Descrição do Produto 4', price: 40.0, image: 'images/imagem4.png' },
        { name: 'Produto 5', description: 'Descrição do Produto 5', price: 50.0, image: 'images/imagem5.png' },
        { name: 'Produto 6', description: 'Descrição do Produto 6', price: 60.0, image: 'images/imagem6.png' },
        { name: 'Produto 7', description: 'Descrição do Produto 7', price: 70.0, image: 'images/imagem7.png' },
        { name: 'Produto 8', description: 'Descrição do Produto 8', price: 80.0, image: 'images/imagem8.png' },
        { name: 'Produto 9', description: 'Descrição do Produto 9', price: 90.0, image: 'images/imagem9.png' },
        { name: 'Produto 10', description: 'Descrição do Produto 10', price: 100.0, image: 'images/imagem10.png' },
        { name: 'Produto 11', description: 'Descrição do Produto 11', price: 110.0, image: 'images/imagem11.png' },
        { name: 'Produto 12', description: 'Descrição do Produto 12', price: 120.0, image: 'images/imagem12.png' },
        { name: 'Produto 13', description: 'Descrição do Produto 13', price: 130.0, image: 'images/imagem13.png' },
        { name: 'Produto 14', description: 'Descrição do Produto 14', price: 140.0, image: 'images/imagem14.png' },
        { name: 'Produto 15', description: 'Descrição do Produto 15', price: 150.0, image: 'images/imagem15.png' },
    ];

    products.forEach(product => {
        db.run("INSERT INTO Products (name, description, price, image) VALUES (?, ?, ?, ?)",
            [product.name, product.description, product.price, product.image]);
    });

    console.log("Produtos de exemplo inseridos com sucesso.");

    // Inserir usuário administrador
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';
    const adminName = 'Admin';
    const saltRounds = 10;

    bcrypt.hash(adminPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao hashear a senha:', err.message);
            db.close((closeErr) => {
                if (closeErr) {
                    console.error('Erro ao fechar o banco de dados:', closeErr.message);
                }
            });
            return;
        }
        db.run(
            "INSERT INTO Users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)",
            [adminName, adminEmail, hashedPassword, 1], // 1 indica que é administrador
            (err) => {
                if (err) {
                    console.error('Erro ao inserir usuário administrador:', err.message);
                } else {
                    console.log('Usuário administrador inserido com sucesso.');
                }
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Erro ao fechar o banco de dados:', closeErr.message);
                    } else {
                        console.log('Fechando a conexão com o banco de dados SQLite.');
                    }
                });
            }
        );
    });
});
