const mysql = require('mysql');

// connect to mysql database

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'folder_manager', //change
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection to database established!");
});
module.exports = connection;