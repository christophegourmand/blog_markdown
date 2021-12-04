const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

// route at uri /articles/
/* custom additional code _chris */
router.get(
    '/',
    (req, res) =>{
        res.send('Your are in route <code>/articles/</code> <br><strong>the article you asked had empty slug uri !</strong>')
    }
);
/* end of custom additional code. */


// route `/articles/new`  to get the new-article-form
router.get(
    '/new',
    (req, res) =>{
        res.render('articles/new', {article: new Article()} ); // to avoid an error, we pass an empty article model
    }
);

// route `/articles/edit/<id>`  to get the new-article-form
router.get(
    '/edit/:id',
    async (req, res) =>{
        const article_to_edit = await Article.findById(req.params.id);

        res.render('articles/edit', {article: article_to_edit } ); // to avoid an error, we pass an empty article model
    }
);

// route `/articles/<slug>`  to get an article from database
router.get(
    '/:slug',
    async (req, res) => {
        
        // ! async function                   ▼
        const article_found = await Article.findOne({slug: req.params.slug}); 
        /* means : `find_me_the_article_matching_with( {as_key_slug: having_this_slug_from_request} )` */
        
        if (article_found == null) res.redirect('/'); // if article is null, we send the client to the homepage.

        res.render('articles/show' , {article: article_found});
    }
)

// route `/articles/` to post the new-article-form
router.post(
    '/',
    async (req, res, next) => {
        req.article = new Article();
        next(); // allow us to go to the next parameter in our list : 'saveArticleAndRedirect(..)'
    },
    saveArticleAndRedirect('new')
);

router.put(
    '/:id',
    async (req, res, next) => {
        req.article = await Article.findById(req.params.id);
        next(); // allow us to go to the next parameter in our list : 'saveArticleAndRedirect(..)'
    },
    saveArticleAndRedirect('edit')
);

// route DELETE /articles/<id> to delete old articles who still have id, but don't have a slug.
router.delete(
    '/:id', 
    async (req, res) => {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }
);

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let articleToSave = req.article;
        articleToSave.title = req.body.title;
        articleToSave.description = req.body.description;
        articleToSave.markdown = req.body.markdown;
        // let newArticle = new Article({
        // });

        try {
            // update 'article' with saved-version from MongoDB
            articleSaved = await articleToSave.save(); // this function is asyncronous!
            res.redirect(`/articles/${articleSaved.slug}`)
        } catch (err) {
            // if error -> send the client back to new-article-form, and pass 'newArticle' just made higher so the form will be pre-filled.

            // display error
            let date = new Date();
            console.log("============================================================================")
            console.log(`                   ERROR at ${date.toLocaleTimeString()}                    `);
            console.log("============================================================================")
            console.error(err);

            // make Client return to form
            res.render(`articles/${path}`, {article: newArticle});
                /* ${path} will either be 'new' or 'edit' */
        }
    }
}


module.exports = router;