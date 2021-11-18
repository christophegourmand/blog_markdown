// CONFIGURE Express.js
const express = require('express');
const articleRouter = require('./routes/articles');
const app = express();

// configure view engine so EJS compile __.ejs into HTML files
app.set('view engine', 'ejs');

// every route in our articleRouter will be created at the end of uri '/articles/'
app.use('/articles', articleRouter)

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