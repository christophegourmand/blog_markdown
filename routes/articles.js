const express = require('express');
const Article_model = require('./../models/article');
const router = express.Router();

// route at uri /articles/
/*
router.get(
    '/',
    (req, res) =>{
        res.send('Your are in /articles/')
    }
);
*/

// route `/articles/new`  to get the new-article-form
router.get(
    '/new',
    (req, res) =>{
        res.render('articles/new', {article: new Article_model()} ); // to avoid an error, we pass an empty article model
    }
);

// route `/articles/🆔`  to get an article from database
router.get(
    '/:id',
    async (req, res) => {
        const article_found = await Article_model.findById(req.params.id); // findById() is an async function
        
        if (article_found == null) res.redirect('/'); // if article is null, we send the client to the homepage.

        res.render('articles/show' , {article: article_found});
    }
)

// route `/articles/` to post the new-article-form
router.post(
    '/',
    async (req, res) => {
        let newArticle = new Article_model({
            title: req.body.title,
            description: req.body.description,
            markdown: req.body.markdown
        });

        try {
            // update 'article' with saved-version from MongoDB
            newArticle = await newArticle.save(); // this function is asyncronous!
            res.redirect(`/articles/${newArticle.id}`)
        } catch (err) {
            // if error -> send the client back to new-article-form, and pass 'newArticle' just made higher so the form will be pre-filled.

            // display error
            let date = new Date();
            console.log("============================================================================")
            console.log(`                   ERROR at ${date.toLocaleTimeString()}                    `);
            console.log("============================================================================")
            console.error(err);

            // make Client return to form
            res.render('articles/new', {article: newArticle});
        }
    }
);

module.exports = router;