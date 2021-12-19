// CONFIGURE Express.js
const express = require('express');
const mongoose = require('mongoose');
const Article_model = require('./models/article');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override'); // ability to use methods PUT and DELETE using method POST.

// about SASS:
const sass = require('sass');
const fs = require('fs'); // to write style.css
const { dirname } = require('path');

const app = express();

mongoose.connect(
    'mongodb://localhost/blog', 
    {
        useNewUrlParser: true
        , useUnifiedTopology: true
        // , useCreateIndex: true
    }
);

// configure view engine so EJS compile __.ejs into HTML files
app.set('view engine', 'ejs');

// we add a middleware in Express, who will help to pass mongoose models with url.
app.use( express.urlencoded({extended: false}) );
    /* INFO1: Note on express.urlencoded() :
    - this method is a middleware, based on 'body-parser'.
    - in the incoming request, it look inside the payload, and parse it.
    - if the pre-programmed key 'extended' is set to 'false' : then the url-encoded-data is parsed using the library 'querystring'.
    - if the pre-programmed key 'extended' is set to 'tue' : then the url-encoded-data is parsed using the library 'qs'.
    */
    /* INFO2: so now in `articles.js` we can access to our form fields by looking at the route, using:
        example: req.body.title
        example: req.body.description
        example: req.body.markdown
    */
    /* INFO3: this line '..urlencoded...' need to be BEFORE `app.use('/articles', articleRouter)` ,
    if not, we get an error that 'req.body.____' is not accessible. */


/* source : https://www.npmjs.com/package/method-override 
    as explained on the source website, to use "_method" allow us to make an action DELETE, 
    by using `<form action="/articles/..... ?_method=DELETE" method="POST">`
*/
app.use(methodOverride("_method"));

// ##################################################### 
// About Public Folder 
// ##################################################### 
// About Public Folder 

/* make 'public' folder accessible = served , by using `express.static` built-in middleware. */
app.use( "/public", express.static('public') );

// ##################################################### 
// ABOUT SASS

const compiledScssAsCss = sass.compile(__dirname + "/public/css/style_custom.scss");

fs.writeFile(
    __dirname+"/public/css/style_custom.css", // param1: path to file to write
    compiledScssAsCss.css, // param2: datas to write inside (typed as String) 
    err =>{                // param3: callback who receive 'error' to handle. 
        if (err) {
            console.error(err);
            return;
        }
    }
);

// ##################################################### 
// ROUTER :  routes at `/` or `/something`

app.get(
    '/hello',
    (req, res)=> {
        res.send('Hello World');
    }
);

app.get(
    '/',
    async (req, res)=> {

        /* // create fake articles datas.
        const fake_articles = [
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
        ]; */

        const all_articles_from_mongo = 
            await Article_model
                .find()  // the method `.find()` is asynchronous, so we add 'await' and also 'async' before the '(req,res)=>{..}'
                .sort({createdAt: 'desc'}); 

        // for route '/' , render view `articles/index.ejs` and pass fake articles datas.
        res.render('articles/index', {articles: all_articles_from_mongo});
            // SYNTAX: res.render(<viewFilename> , <object key:value to pass to the view>)
    }
);

// ##################################################### 
// SUB-ROUTER : routes at `/articles` or `/articles/something`

// every route in our articleRouter will be created at the end of uri '/articles/'
app.use('/articles', articleRouter)


// #####################################################
// SERVER READY WHEN LISTENING

app.listen(5000);