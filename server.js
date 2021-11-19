// CONFIGURE Express.js
const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const app = express();

mongoose.connect(
    'mongodb://localhost/blog', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

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

        // create fake articles datas.
        const articles = [
            {
                title: 'Test Article',
                createdAt: new Date(),
                description: 'test description'
            }
            ,
            {
                title: 'Test Article 2',
                createdAt: new Date(),
                description: 'test description 2'
            }
        ];

        // for route '/' , render view `articles/index.ejs` and pass fake articles datas.
        res.render('articles/index', {articles: articles});
            // SYNTAX: res.render(<viewFilename> , <object key:value to pass to the view>)
    }
);


app.listen(5000);