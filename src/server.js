const express = require('express');
const bodyParser = require('body-parser');
const db = require('../config/db'); // Certifique-se de que este caminho está correto
const bcrypt = require('bcrypt');
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
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Erro ao registrar usuário.");
        }
        db.run("INSERT INTO Users (email, password) VALUES (?, ?)", [email, hashedPassword], function(err) {
            if (err) {
                res.status(500).send("Erro ao registrar usuário.");
            } else {
                res.status(201).send({ id: this.lastID });
            }
        });
    });
});

// Limpar o carrinho para um usuário específico
app.post('/api/limpar-carrinho', (req, res) => {
    const { userId } = req.body;
    db.run("DELETE FROM Cart WHERE user_id = ?", [userId], function(err) {
        if (err) {
            res.status(500).send("Erro ao limpar o carrinho.");
        } else {
            res.status(200).send({ message: 'Carrinho limpo com sucesso.' });
        }
    });
});


// Rota para adicionar produtos ao carrinho
app.post('/api/carrinho', (req, res) => {
    const { userId, productId, quantity } = req.body;

    db.get("SELECT * FROM Cart WHERE user_id = ? AND product_id = ?", [userId, productId], (err, row) => {
        if (err) {
            res.status(500).send("Erro ao buscar produto no carrinho.");
        } else if (row) {
            db.run("UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId], function(err) {
                if (err) {
                    res.status(500).send("Erro ao atualizar quantidade do produto no carrinho.");
                } else {
                    res.status(200).send({ message: 'Quantidade atualizada no carrinho.' });
                }
            });
        } else {
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
        paymentMethod, cardNumber, cardExpiry, cardCvc, boletoCode, pixKey, createAccount, password
    } = req.body;

    const shippingFee = 19.90; // Frete fixo
    db.all("SELECT Products.price, Cart.quantity FROM Cart JOIN Products ON Cart.product_id = Products.id WHERE Cart.user_id = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).send("Erro ao calcular total do pedido.");
        }
        
        const totalPrice = rows.reduce((total, item) => total + item.price * item.quantity, 0) + shippingFee;

        db.run(`
            INSERT INTO Orders (
                user_id, first_name, last_name, address, number, cep, phone, email,
                payment_method, card_number, card_expiry, card_cvc, boleto_code, pix_key, total_price, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, firstName, lastName, address, number, cep, phone, email,
                paymentMethod, cardNumber || null, cardExpiry || null, cardCvc || null, boletoCode || null, pixKey || null, totalPrice, 'Pagamento aprovado'
            ],
            function(err) {
                if (err) {
                    return res.status(500).send("Erro ao finalizar pedido.");
                }

                if (createAccount) {
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                        if (err) {
                            return res.status(500).send("Erro ao criar conta.");
                        }

                        db.run("INSERT INTO Users (email, password) VALUES (?, ?)", [email, hashedPassword], function(err) {
                            if (err) {
                                return res.status(500).send("Erro ao criar conta.");
                            }
                        });
                    });
                }

                res.status(201).send({ id: this.lastID });
            }
        );
    });
});

// Rota para obter detalhes de um produto específico
app.get('/api/produtos/:id', (req, res) => {
    const productId = req.params.id;
    db.get("SELECT * FROM Products WHERE id = ?", [productId], (err, row) => {
        if (err) {
            res.status(500).send("Erro ao buscar detalhes do produto.");
        } else if (!row) {
            res.status(404).send("Produto não encontrado.");
        } else {
            res.json(row);
        }
    });
});

// Rota para obter status do pedido
app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    db.get("SELECT * FROM Orders WHERE id = ?", [orderId], (err, row) => {
        if (err) {
            return res.status(500).send("Erro ao buscar status do pedido.");
        } 
        
        if (!row) {
            return res.status(404).send("Pedido não encontrado.");
        }

        const formattedOrderId = `${row.id}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`;
        res.json({
            ...row,
            formattedOrderId
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
