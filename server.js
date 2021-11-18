// CONFIGURE Express.js
const express = require('express');
const app = express();

// configure view engine so EJS compile __.ejs into HTML files
app.set('view engine', 'ejs');

// ROUTES
app.get(
    '/hello',
    (req, res)=> {
        res.send('Hello World');
    }
);

app.get(
    '/',
    (req, res)=> {
        res.render('index');
    }
);


app.listen(5000);