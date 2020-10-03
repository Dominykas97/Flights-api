const mysql = require('mysql2/promise');

const dbConfig = {
    connectionLimit: 10,
    host: "sql2.freemysqlhosting.net",
    database: "sql2368079",
    user: "sql2368079",
    password: "hK3*hZ6!",
    port: 3306
};

const con = mysql.createPool(dbConfig);

module.exports = con