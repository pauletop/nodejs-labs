const express = require('express');
const logger = require('morgan');
// const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// import local modules
const routes = require('./routes');
const db = require('./configs/database');
const corsCustom = require('./middlewares/cors');

// create express app
const app = express();
const port = process.env.PORT || 3000;

// set view engine
// app.engine('hbs', engine({ extname: '.hbs' }));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// set static folder
app.use(express.static(path.join(__dirname, 'public')));
// set logger
app.use(logger('dev'));
// set cors
app.use(corsCustom);
// set body parser
app.use(express.urlencoded({ extended: true })); // extended: true -> support nested object, false -> support string or array only
app.use(express.json());
// set session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// connect to database
console.log(`Connecting to database ${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}...`);
db.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`);

// set routes
routes(app);

// set 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
});
// set 500 page
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: '500' });
});
// warning: http method is not supported
app.use((req, res) => {
    res.status(405).json({ message: '405 - Method Not Allowed' });
});
// listen on port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}, url: http://localhost:${port}. Press Ctrl + C to terminate.`);
});