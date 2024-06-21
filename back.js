const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files
app.use(express.static("public"));

// Template engine
const handlebars = exphbs.create({ extname: ".hbs" });
app.engine('hbs', handlebars.engine);
app.set("view engine", "hbs");

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Shekkina545@', // Replace with your MySQL password
    database: 'form' // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Router
app.get('/', (req, res) => {
    res.render("home");
});

app.post('/submit', (req, res) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error saving data');
        }
        console.log('Data inserted:', result);
        res.send('Account created successfully');
    });
});

// Listen on port
app.listen(port, () => {
    console.log("Listening on port " + port);
});
