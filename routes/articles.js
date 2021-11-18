const express = require('express');
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

// route to create new article at `/articles/new`
router.get(
    '/new',
    (req, res) =>{
        res.render('/articles/new');
    }
);

module.exports = router;