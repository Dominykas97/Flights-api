const mysql = require('mysql2/promise');

const dbConfig = {
    connectionLimit: 10,
    host: "sql2.freemysqlhosting.net",
    database: "sql2369331",
    user: "sql2369331",
    password: "xZ6*wZ6*",
    port: 3306
};

const con = mysql.createPool(dbConfig);

module.exports = con