const mysql = require('mysql2/promise');

// Creamos un Pool en lugar de Connection (es mejor para APIs)
const connDB = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'reciclaje_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// En mysql2/promise no se usa .connect(). 
// Simplemente exportamos el pool.
module.exports = connDB;