const express = require('express');
const router = express.Router();

// route at uri /articles/
router.get(
    '/',
    (req, res) =>{
        res.send('Your are in /articles/')
    }
);

module.exports = router;