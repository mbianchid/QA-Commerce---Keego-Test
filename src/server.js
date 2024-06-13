const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Servir frontend estático

// Rota para listar produtos
app.get('/api/produtos', (req, res) => {
    db.all("SELECT * FROM Products", (err, rows) => {
        if (err) {
            res.status(500).send("Erro ao buscar produtos.");
        } else {
            res.json(rows);
        }
    });
});

// Rota para registro de usuário
app.post('/api/registrar', (req, res) => {
    const { email, password } = req.body;
    db.run("INSERT INTO Users (email, password) VALUES (?, ?)", [email, password], function(err) {
        if (err) {
            res.status(500).send("Erro ao registrar usuário.");
        } else {
            res.status(201).send({ id: this.lastID });
        }
    });
});

// Rota para adicionar produtos ao carrinho
app.post('/api/carrinho', (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Verificar se o produto já existe no carrinho
    db.get("SELECT * FROM Cart WHERE user_id = ? AND product_id = ?", [userId, productId], (err, row) => {
        if (err) {
            res.status(500).send("Erro ao buscar produto no carrinho.");
        } else if (row) {
            // Atualizar a quantidade do produto no carrinho
            db.run("UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId], function(err) {
                if (err) {
                    res.status(500).send("Erro ao atualizar quantidade do produto no carrinho.");
                } else {
                    res.status(200).send({ message: 'Quantidade atualizada no carrinho.' });
                }
            });
        } else {
            // Inserir novo produto no carrinho
            db.run("INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, productId, quantity], function(err) {
                if (err) {
                    res.status(500).send("Erro ao adicionar produto ao carrinho.");
                } else {
                    res.status(201).send({ id: this.lastID });
                }
            });
        }
    });
});

// Rota para listar produtos no carrinho
app.get('/api/carrinho/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all("SELECT Products.id as productId, Products.name, Products.price, Cart.quantity FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.user_id = ?", [userId], (err, rows) => {
        if (err) {
            res.status(500).send("Erro ao buscar produtos no carrinho.");
        } else {
            res.json(rows);
        }
    });
});

// Rota para deletar produtos no carrinho
app.delete('/api/carrinho/:userId/:productId', (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    db.run("DELETE FROM Cart WHERE user_id = ? AND product_id = ?", [userId, productId], function(err) {
        if (err) {
            res.status(500).send("Erro ao remover produto do carrinho.");
        } else if (this.changes === 0) {
            res.status(404).send("Produto não encontrado no carrinho.");
        } else {
            res.status(200).send({ message: 'Produto removido do carrinho.' });
        }
    });
});

// Rota para finalizar o pedido
app.post('/api/checkout', (req, res) => {
    const {
        userId, firstName, lastName, address, number, cep, phone, email,
        paymentMethod, cardNumber, cardExpiry, cardCvc, boletoCode, pixKey, totalPrice
    } = req.body;

    db.run(`
        INSERT INTO Orders (
            user_id, first_name, last_name, address, number, cep, phone, email,
            payment_method, card_number, card_expiry, card_cvc, boleto_code, pix_key, total_price, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId, firstName, lastName, address, number, cep, phone, email,
            paymentMethod, cardNumber || null, cardExpiry || null, cardCvc || null, boletoCode || null, pixKey || null, totalPrice, 'Pendente'
        ],
        function(err) {
            if (err) {
                res.status(500).send("Erro ao finalizar pedido.");
            } else {
                res.status(201).send({ id: this.lastID });
            }
        }
    );
});

// Rota para obter status do pedido
app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    db.get("SELECT * FROM Orders WHERE id = ?", [orderId], (err, row) => {
        if (err) {
            res.status(500).send("Erro ao buscar status do pedido.");
        } else {
            res.json(row);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
