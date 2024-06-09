const mysql = require('mysql2');
const util = require('util');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.query = util.promisify(connection.query).bind(connection);

connection.connect((err) => {
    if (err) {
        console.log('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

module.exports = connection;
