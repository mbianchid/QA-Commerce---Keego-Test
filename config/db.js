const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./qa_commerce.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

module.exports = db;
